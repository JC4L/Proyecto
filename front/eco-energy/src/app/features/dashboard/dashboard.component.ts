import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { forkJoin } from 'rxjs';
import { EnergyService } from '../../core/services/energy.service';
import { ThemeService } from '../../core/services/theme.service';
import {
  TotalProductionEnergy,
  TopEnergyYear,
  ParticipationElectricalConsumption,
  TrendEnergy,
  ENERGY_TYPES,
} from '../../core/models/energy.models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexFill,
  ApexLegend,
  ApexTooltip,
  ApexStroke,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexGrid,
  ApexTitleSubtitle,
} from 'ng-apexcharts';

/** Chart option types */
interface BarChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  colors: string[];
  title: ApexTitleSubtitle;
}

interface DonutChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  legend: ApexLegend;
  colors: string[];
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  title: ApexTitleSubtitle;
}

interface LineChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  colors: string[];
  fill: ApexFill;
  title: ApexTitleSubtitle;
}

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgApexchartsModule, LoadingSpinnerComponent, EmptyStateComponent, FormsModule, DecimalPipe],
  template: `
    <div class="animate-fade-in">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h2 class="text-3xl font-black tracking-tight mb-1 text-slate-900 dark:text-white">Panel de Control</h2>
          <p class="text-slate-500 dark:text-slate-400">Resumen global de producción y consumo de energías renovables.</p>
        </div>
        <!-- Year Selector -->
        <div class="flex items-center gap-3">
          <label for="year-select" class="text-sm font-semibold text-slate-600 dark:text-slate-300">Año:</label>
          <select
            id="year-select"
            [ngModel]="selectedYear()"
            (ngModelChange)="onYearChange($event)"
            class="px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-fast cursor-pointer"
          >
            @for (year of availableYears; track year) {
              <option [value]="year">{{ year }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <app-loading-spinner message="Cargando datos del dashboard..." />
      }

      @if (!isLoading()) {
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Total Production KPI -->
          <div class="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-smooth animate-fade-in stagger-1">
            <div class="flex justify-between items-start mb-4">
              <div class="p-3 bg-blue-50 rounded-lg text-blue-600">
                <span class="material-symbols-outlined">bolt</span>
              </div>
              @if (kpiTotalProduction() > 0) {
                <span class="text-primary text-xs font-bold flex items-center bg-green-50 px-2 py-1 rounded-full">
                  <span class="material-symbols-outlined text-sm">trending_up</span>
                  Activo
                </span>
              }
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">Producción Hidraulica Total (Top 10)</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white">
              {{ kpiTotalProduction() | number:'1.1-1' }} {{ kpiTotalUnit() }}
            </h3>
            <p class="text-xs text-slate-400 mt-1">{{ kpiTotalRegion() }} — {{ selectedYear() }}</p>
          </div>

          <!-- Renewable % KPI -->
          <div class="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-smooth animate-fade-in stagger-2">
            <div class="flex justify-between items-start mb-4">
              <div class="p-3 bg-green-50 rounded-lg text-primary">
                <span class="material-symbols-outlined">eco</span>
              </div>
              @if (kpiRenewablePercent() > 50) {
                <span class="text-primary text-xs font-bold flex items-center bg-green-50 px-2 py-1 rounded-full">
                  <span class="material-symbols-outlined text-sm">trending_up</span>
                  > 50%
                </span>
              }
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">Energía Renovable — {{ kpiRenewableRegion() }}</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white">
              {{ kpiRenewablePercent() | number:'1.1-1' }}%
            </h3>
            <p class="text-xs text-slate-400 mt-1">{{ kpiRenewableRegion() }} — {{ selectedYear() }}</p>
          </div>

          <!-- Top Country KPI -->
          <div class="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-smooth animate-fade-in stagger-3">
            <div class="flex justify-between items-start mb-4">
              <div class="p-3 bg-amber-50 rounded-lg text-amber-600">
                <span class="material-symbols-outlined">military_tech</span>
              </div>
              <span class="text-amber-600 text-xs font-bold flex items-center bg-amber-50 px-2 py-1 rounded-full">
                <span class="material-symbols-outlined text-sm">star</span>
                #1
              </span>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">País Líder en Producción Hidraulica</p>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white">{{ kpiTopCountry() }}</h3>
            <p class="text-xs text-slate-400 mt-1">
              {{ kpiTopCountryValue() | number:'1.1-1' }} {{ kpiTopCountryUnit() }}
            </p>
          </div>
        </div>

        <!-- Charts Row 1: Bar + Donut -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Top Countries Bar Chart -->
          <div class="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            @if (barChartOptions()) {
              <apx-chart
                [series]="barChartOptions()!.series"
                [chart]="barChartOptions()!.chart"
                [xaxis]="barChartOptions()!.xaxis"
                [yaxis]="barChartOptions()!.yaxis"
                [dataLabels]="barChartOptions()!.dataLabels"
                [plotOptions]="barChartOptions()!.plotOptions"
                [fill]="barChartOptions()!.fill"
                [tooltip]="barChartOptions()!.tooltip"
                [grid]="barChartOptions()!.grid"
                [colors]="barChartOptions()!.colors"
                [title]="barChartOptions()!.title"
              />
            } @else {
              <app-empty-state title="Sin datos" description="No hay datos de países disponibles." />
            }
          </div>

          <!-- Participation Donut Chart -->
          <div class="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            @if (donutChartOptions()) {
              <apx-chart
                [series]="donutChartOptions()!.series"
                [chart]="donutChartOptions()!.chart"
                [labels]="donutChartOptions()!.labels"
                [legend]="donutChartOptions()!.legend"
                [colors]="donutChartOptions()!.colors"
                [tooltip]="donutChartOptions()!.tooltip"
                [dataLabels]="donutChartOptions()!.dataLabels"
                [plotOptions]="donutChartOptions()!.plotOptions"
                [responsive]="donutChartOptions()!.responsive"
                [title]="donutChartOptions()!.title"
              />
            } @else {
              <app-empty-state title="Sin datos" description="No hay datos de participación disponibles." />
            }
          </div>
        </div>

        <!-- Charts Row 2: Trend Line -->
        <div class="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
          @if (lineChartOptions()) {
            <apx-chart
              [series]="lineChartOptions()!.series"
              [chart]="lineChartOptions()!.chart"
              [xaxis]="lineChartOptions()!.xaxis"
              [yaxis]="lineChartOptions()!.yaxis"
              [stroke]="lineChartOptions()!.stroke"
              [dataLabels]="lineChartOptions()!.dataLabels"
              [tooltip]="lineChartOptions()!.tooltip"
              [grid]="lineChartOptions()!.grid"
              [colors]="lineChartOptions()!.colors"
              [fill]="lineChartOptions()!.fill"
              [title]="lineChartOptions()!.title"
            />
          } @else {
            <app-empty-state title="Sin datos" description="No hay datos de tendencia disponibles." />
          }
        </div>

        <!-- Error Message -->
        @if (errorMessage()) {
          <div class="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
            <p class="text-sm text-red-600 font-medium">{{ errorMessage() }}</p>
          </div>
        }
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly energyService = inject(EnergyService);
  private readonly themeService = inject(ThemeService);

  // Dark mode chart colors
  private readonly chartTitleColor = computed(() => this.themeService.darkMode() ? '#FFFFFF' : '#0f172a');
  private readonly chartTextColor = computed(() => this.themeService.darkMode() ? '#94A3B8' : '#334155');
  private readonly chartGridColor = computed(() => this.themeService.darkMode() ? '#1e3a2c' : '#f1f5f9');
  private readonly chartForeColor = computed(() => this.themeService.darkMode() ? '#F1F5F9' : '#373d3f');

  // State signals
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly selectedYear = signal(2019);

  // Data signals
  readonly totalProductionData = signal<TotalProductionEnergy[]>([]);
  readonly topCountriesData = signal<TopEnergyYear[]>([]);
  readonly participationData = signal<ParticipationElectricalConsumption[]>([]);
  readonly trendData = signal<TrendEnergy[]>([]);

  // KPI computed signals
  readonly kpiTotalProduction = computed(() => this.totalProductionData()[0]?.total ?? 0);
  readonly kpiTotalUnit = computed(() => this.totalProductionData()[0]?.unit ?? 'TWh');
  readonly kpiTotalRegion = computed(() => this.totalProductionData()[0]?.region ?? '—');

  readonly kpiRenewablePercent = computed(() => {
    const data = this.participationData();
    if (!data.length) return 0;
    return data.reduce((sum, p) => sum + (p.sharePercent ?? 0), 0);
  });
  readonly kpiRenewableRegion = computed(() => {
    const first = this.participationData()[0];
    return first?.entity ?? '—';
  });

  readonly kpiTopCountry = computed(() => this.topCountriesData()[0]?.country ?? '—');
  readonly kpiTopCountryValue = computed(() => this.topCountriesData()[0]?.energy ?? 0);
  readonly kpiTopCountryUnit = computed(() => this.topCountriesData()[0]?.unit ?? 'TWh');

  // Available years
  readonly availableYears = Array.from({ length: 20 }, (_, i) => 2020 - i);

  // Chart options computed from data
  readonly barChartOptions = computed<BarChartOptions | null>(() => {
    const data = this.topCountriesData();
    if (!data.length) return null;

    return {
      series: [
        {
          name: data[0]?.energyType ?? 'Producción',
          data: data.map((d) => Math.round(d.energy * 100) / 100),
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        fontFamily: 'Inter, sans-serif',
        foreColor: this.chartForeColor(),
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          horizontal: true,
          barHeight: '60%',
          distributed: true,
        },
      },
      colors: [
        '#13ec6d', '#10b981', '#059669', '#047857', '#065f46',
        '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#ecfdf5',
      ],
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toLocaleString()} ${data[0]?.unit ?? ''}`,
        style: { fontSize: '11px', fontWeight: 600, colors: [this.chartTextColor()] },
        offsetX: 8,
      },
      xaxis: {
        categories: data.map((d) => d.country),
        labels: { style: { fontSize: '12px', fontFamily: 'Inter', colors: this.chartTextColor() } },
      },
      yaxis: {
        labels: { style: { fontSize: '12px', fontFamily: 'Inter', colors: [this.chartTextColor()] } },
      },
      fill: { opacity: 0.9 },
      tooltip: {
        theme: this.themeService.darkMode() ? 'dark' : 'light',
        y: { formatter: (val: number) => `${val.toLocaleString()} ${data[0]?.unit ?? ''}` },
      },
      grid: { borderColor: this.chartGridColor(), strokeDashArray: 4 },
      title: {
        //text: `Top Países — ${data[0]?.energyType ?? ''} (${this.selectedYear()})`,
        text: `Top Países — Producción Hidraulica (${this.selectedYear()})`,
        style: { fontSize: '16px', fontWeight: '800', fontFamily: 'Inter', color: this.chartTitleColor() },
      },
    };
  });

  readonly donutChartOptions = computed<DonutChartOptions | null>(() => {
    const data = this.participationData();
    if (!data.length) return null;

    const labels = data.map((d) =>
      d.energySource
        .replace('Share Electricity ', '')
        .replace('Renewables', 'Renovables Total')
    );

    return {
      series: data.map((d) => Math.round(d.sharePercent * 100) / 100),
      chart: {
        type: 'donut',
        height: 350,
        fontFamily: 'Inter, sans-serif',
        foreColor: this.chartForeColor(),
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      labels,
      legend: {
        position: 'bottom',
        fontSize: '13px',
        fontFamily: 'Inter',
        fontWeight: 500,
        markers: { size: 8, shape: 'circle' },
        labels: { colors: this.chartTextColor() },
      },
      colors: ['#13ec6d', '#3b82f6', '#f59e0b', '#ef4444'],
      tooltip: {
        y: { formatter: (val: number) => `${val}%` },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${Math.round(val * 10) / 10}%`,
        style: { fontSize: '12px', fontWeight: 600 },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '60%',
            labels: {
              show: true,
              name: { show: true, fontSize: '14px', fontFamily: 'Inter', color: this.chartTextColor() },
              value: {
                show: true,
                fontSize: '20px',
                fontWeight: '800',
                fontFamily: 'Inter',
                color: this.chartTitleColor(),
                formatter: (val: string) => `${val}%`,
              },
              total: {
                show: true,
                label: 'Renovables',
                fontSize: '13px',
                color: this.chartTextColor(),
                fontFamily: 'Inter',
                formatter: (w: { globals: { seriesTotals: number[] } }) => {
                  const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                  return `${Math.round(total * 10) / 10}%`;
                },
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: { chart: { width: 280 }, legend: { position: 'bottom' } },
        },
      ],
      title: {
        text: `Participación Eléctrica — ${data[0]?.entity ?? 'World'} (${this.selectedYear()})`,
        style: { fontSize: '16px', fontWeight: '800', fontFamily: 'Inter', color: this.chartTitleColor() },
      },
    };
  });

  readonly lineChartOptions = computed<LineChartOptions | null>(() => {
    const data = this.trendData();
    if (!data.length) return null;

    const sorted = [...data].sort((a, b) => a.year - b.year);

    return {
      series: [
        {
          name: `Capacidad (${sorted[0]?.unit ?? 'GW'})`,
          data: sorted.map((d) => Math.round(d.totalSolarCapacity * 100) / 100),
        },
      ],
      chart: {
        type: 'area',
        height: 300,
        fontFamily: 'Inter, sans-serif',
        foreColor: this.chartForeColor(),
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      colors: ['#13ec6d'],
      dataLabels: { enabled: false },
      xaxis: {
        categories: sorted.map((d) => d.year.toString()),
        labels: { style: { fontSize: '12px', fontFamily: 'Inter', colors: this.chartTextColor() } },
      },
      yaxis: {
        labels: {
          style: { fontSize: '12px', fontFamily: 'Inter', colors: [this.chartTextColor()] },
          formatter: (val: number) => `${val.toLocaleString()} ${sorted[0]?.unit ?? ''}`,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 100],
        },
      },
      tooltip: {
        theme: this.themeService.darkMode() ? 'dark' : 'light',
        y: {
          formatter: (val: number) => `${val.toLocaleString()} ${sorted[0]?.unit ?? ''}`,
        },
      },
      grid: { borderColor: this.chartGridColor(), strokeDashArray: 4 },
      title: {
        text: `Tendencia — Capacidad Solar Instalada (${sorted[0]?.country ?? 'World'})`,
        style: { fontSize: '16px', fontWeight: '800', fontFamily: 'Inter', color: this.chartTitleColor() },
      },
    };
  });

  ngOnInit(): void {
    this.loadDashboardData();
  }

  onYearChange(year: number): void {
    this.selectedYear.set(Number(year));
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    const year = this.selectedYear();

    forkJoin({
      totalProduction: this.energyService.getTotalProduction('Wind Production', year, 5),
      topCountries: this.energyService.getTopCountries(year, 'Hydro Production', 10),
      participation: this.energyService.getParticipation(year, 'World', 10),
      trend: this.energyService.getTrend('Installed Solar PV Capacity', 'World', 20),
    }).subscribe({
      next: (results) => {
        this.totalProductionData.set(results.totalProduction);
        this.topCountriesData.set(results.topCountries);
        this.participationData.set(results.participation);
        this.trendData.set(results.trend);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          'Error al cargar los datos del dashboard. Verifique la conexión con el backend.'
        );
        console.error('Dashboard load error:', err);
      },
    });
  }
}
