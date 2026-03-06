import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EnergyService } from '../../core/services/energy.service';
import { ThemeService } from '../../core/services/theme.service';
import { TotalProductionEnergy, ENERGY_TYPES } from '../../core/models/energy.models';
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
  ApexTooltip,
  ApexGrid,
  ApexTitleSubtitle,
} from 'ng-apexcharts';

@Component({
  selector: 'app-total-production',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgApexchartsModule, LoadingSpinnerComponent, EmptyStateComponent, DecimalPipe],
  template: `
    <div class="animate-fade-in">
      <div class="mb-6">
        <h2 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Producción Total por Tipo de Energía y Año</h2>
        <p class="text-slate-500 dark:text-slate-400">Consulta la producción de energía agrupada por regiones.</p>
      </div>

      <!-- Filters -->
      <form [formGroup]="filterForm" (ngSubmit)="onSearch()" class="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1" for="tp-energy">Tipo de Energía</label>
            <select id="tp-energy" formControlName="energyType"
              class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none">
              @for (type of productionTypes; track type.name) {
                <option [value]="type.name">{{ type.name }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1" for="tp-year">Año</label>
            <input id="tp-year" type="number" formControlName="year" min="1965" max="2022"
              class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1" for="tp-limit">Filas</label>
            <input id="tp-limit" type="number" formControlName="limit" min="1" max="50"
              class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
          </div>
          <button type="submit" [disabled]="isLoading()"
            class="px-6 py-2.5 bg-primary text-bg-dark font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-smooth disabled:opacity-50 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-[18px]">search</span> Consultar
          </button>
        </div>
      </form>

      @if (isLoading()) { <app-loading-spinner /> }

      @if (!isLoading() && data().length > 0) {
        <!-- Table -->
        <div class="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th class="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">#</th>
                <th class="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Región</th>
                <th class="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Tipo Energía</th>
                <th class="px-6 py-3 text-right font-semibold text-slate-600 dark:text-slate-400">Total</th>
                <th class="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Unidad</th>
                <th class="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Año</th>
              </tr>
            </thead>
            <tbody>
              @for (item of data(); track item.region; let i = $index) {
                <tr class="border-b border-slate-50 dark:border-slate-800 hover:bg-primary/5 transition-fast">
                  <td class="px-6 py-3 text-slate-400 dark:text-slate-500 font-medium">{{ i + 1 }}</td>
                  <td class="px-6 py-3 font-semibold text-slate-800 dark:text-white">{{ item.region }}</td>
                  <td class="px-6 py-3 text-slate-600 dark:text-slate-400">{{ item.energyType }}</td>
                  <td class="px-6 py-3 text-right font-bold text-slate-900 dark:text-white">{{ item.total | number:'1.2-2' }}</td>
                  <td class="px-6 py-3 text-slate-500 dark:text-slate-400">{{ item.unit }}</td>
                  <td class="px-6 py-3 text-slate-500 dark:text-slate-400">{{ item.year }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Chart -->
        @if (chartOptions()) {
          <div class="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <apx-chart
              [series]="chartOptions()!.series" [chart]="chartOptions()!.chart"
              [xaxis]="chartOptions()!.xaxis" [yaxis]="chartOptions()!.yaxis"
              [dataLabels]="chartOptions()!.dataLabels" [plotOptions]="chartOptions()!.plotOptions"
              [fill]="chartOptions()!.fill" [tooltip]="chartOptions()!.tooltip"
              [grid]="chartOptions()!.grid" [colors]="chartOptions()!.colors"
              [title]="chartOptions()!.title" />
          </div>
        }
      }

      @if (!isLoading() && data().length === 0 && hasSearched()) {
        <app-empty-state />
      }
    </div>
  `,
})
export class TotalProductionComponent implements OnInit {
  private readonly energyService = inject(EnergyService);
  private readonly fb = inject(FormBuilder);
  private readonly themeService = inject(ThemeService);

  private readonly chartTitleColor = computed(() => this.themeService.darkMode() ? '#FFFFFF' : '#0f172a');
  private readonly chartTextColor = computed(() => this.themeService.darkMode() ? '#94A3B8' : '#334155');
  private readonly chartGridColor = computed(() => this.themeService.darkMode() ? '#1e3a2c' : '#f1f5f9');
  private readonly chartForeColor = computed(() => this.themeService.darkMode() ? '#F1F5F9' : '#373d3f');

  readonly isLoading = signal(false);
  readonly hasSearched = signal(false);
  readonly data = signal<TotalProductionEnergy[]>([]);
  readonly productionTypes = ENERGY_TYPES.filter((t) => t.unit === 'TWh');

  readonly filterForm = this.fb.nonNullable.group({
    energyType: ['Wind Production'],
    year: [2019, [Validators.required, Validators.min(1965), Validators.max(2022)]],
    limit: [10, [Validators.required, Validators.min(1), Validators.max(50)]],
  });

  readonly chartOptions = computed(() => {
    const d = this.data();
    if (!d.length) return null;
    return {
      series: [{ name: d[0].energyType, data: d.map((r) => Math.round(r.total * 100) / 100) }],
      chart: { type: 'bar' as const, height: 380, fontFamily: 'Inter, sans-serif', foreColor: this.chartForeColor(), toolbar: { show: false }, animations: { enabled: true, easing: 'easeinout' as const, speed: 600 } },
      plotOptions: { bar: { borderRadius: 6, horizontal: true, barHeight: '55%', distributed: true } },
      colors: ['#13ec6d', '#10b981', '#059669', '#047857', '#065f46', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#ecfdf5'],
      dataLabels: { enabled: true, formatter: (val: number) => `${val.toLocaleString()}`, style: { fontSize: '11px', fontWeight: 600, colors: [this.chartTextColor()] }, offsetX: 5 },
      xaxis: { categories: d.map((r) => r.region), labels: { style: { fontSize: '12px', colors: this.chartTextColor() } } },
      yaxis: { labels: { style: { fontSize: '12px', colors: [this.chartTextColor()] } } },
      fill: { opacity: 0.9 },
      tooltip: { theme: this.themeService.darkMode() ? 'dark' : 'light', y: { formatter: (val: number) => `${val.toLocaleString()} ${d[0].unit}` } },
      grid: { borderColor: this.chartGridColor(), strokeDashArray: 4 },
      title: { text: `${d[0].energyType} por Región (${d[0].year})`, style: { fontSize: '16px', fontWeight: '800', fontFamily: 'Inter', color: this.chartTitleColor() } },
    };
  });

  ngOnInit(): void {
    this.onSearch();
  }

  onSearch(): void {
    if (this.filterForm.invalid) return;
    this.isLoading.set(true);
    this.hasSearched.set(true);
    const { energyType, year, limit } = this.filterForm.getRawValue();
    this.energyService.getTotalProduction(energyType, year, limit).subscribe({
      next: (result) => { this.data.set(result); this.isLoading.set(false); },
      error: () => { this.data.set([]); this.isLoading.set(false); },
    });
  }
}
