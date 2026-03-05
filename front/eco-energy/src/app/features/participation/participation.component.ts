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
import { ParticipationElectricalConsumption } from '../../core/models/energy.models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-participation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgApexchartsModule, LoadingSpinnerComponent, EmptyStateComponent, DecimalPipe],
  template: `
    <div class="animate-fade-in">
      <div class="mb-6">
        <h2 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Participación Global en Electricidad</h2>
        <p class="text-slate-500 dark:text-slate-400">Distribución de fuentes renovables en el consumo eléctrico.</p>
      </div>

      <!-- Filters -->
      <form [formGroup]="filterForm" (ngSubmit)="onSearch()" class="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1" for="pa-entity">Entidad</label>
            <input id="pa-entity" type="text" formControlName="entityName" placeholder="World, China, etc."
              class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1" for="pa-year">Año</label>
            <input id="pa-year" type="number" formControlName="year" min="1965" max="2022"
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
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Donut Chart -->
          @if (donutOptions()) {
            <div class="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
              <apx-chart
                [series]="donutOptions()!.series" [chart]="donutOptions()!.chart"
                [labels]="donutOptions()!.labels" [legend]="donutOptions()!.legend"
                [colors]="donutOptions()!.colors" [tooltip]="donutOptions()!.tooltip"
                [dataLabels]="donutOptions()!.dataLabels" [plotOptions]="donutOptions()!.plotOptions"
                [responsive]="donutOptions()!.responsive" [title]="donutOptions()!.title" />
            </div>
          }

          <!-- Table -->
          <div class="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-x-auto">
            <div class="p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Detalle de Participación</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ data()[0]?.entity ?? '' }} — {{ data()[0]?.year ?? '' }}</p>
            </div>
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th class="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Fuente Energética</th>
                  <th class="px-6 py-3 text-right font-semibold text-slate-600 dark:text-slate-400">Participación</th>
                </tr>
              </thead>
              <tbody>
                @for (item of data(); track item.energySource) {
                  <tr class="border-b border-slate-50 dark:border-slate-800 hover:bg-primary/5 transition-fast">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-3 h-3 rounded-full" [style.background-color]="getSourceColor(item.energySource)"></div>
                        <span class="font-semibold text-slate-800 dark:text-white">{{ formatSourceName(item.energySource) }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <span class="font-bold text-slate-900 dark:text-white text-lg">{{ item.sharePercent | number:'1.2-2' }}%</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
            <!-- Total Row -->
            <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center border-t border-slate-200 dark:border-slate-700">
              <span class="font-bold text-slate-700 dark:text-slate-300">Total Combinado</span>
              <span class="font-black text-primary text-lg">{{ totalPercent() | number:'1.2-2' }}%</span>
            </div>
          </div>
        </div>
      }

      @if (!isLoading() && data().length === 0 && hasSearched()) {
        <app-empty-state />
      }
    </div>
  `,
})
export class ParticipationComponent implements OnInit {
  private readonly energyService = inject(EnergyService);
  private readonly fb = inject(FormBuilder);
  private readonly themeService = inject(ThemeService);

  private readonly chartTitleColor = computed(() => this.themeService.darkMode() ? '#FFFFFF' : '#0f172a');
  private readonly chartTextColor = computed(() => this.themeService.darkMode() ? '#94A3B8' : '#334155');
  private readonly chartForeColor = computed(() => this.themeService.darkMode() ? '#F1F5F9' : '#373d3f');

  readonly isLoading = signal(false);
  readonly hasSearched = signal(false);
  readonly data = signal<ParticipationElectricalConsumption[]>([]);

  private readonly sourceColors: Record<string, string> = {
    'Share Electricity Renewables': '#13ec6d',
    'Share Electricity Hydro': '#3b82f6',
    'Share Electricity Wind': '#f59e0b',
    'Share Electricity Solar': '#ef4444',
  };

  readonly filterForm = this.fb.nonNullable.group({
    entityName: ['World'],
    year: [2019, [Validators.required, Validators.min(1965), Validators.max(2022)]],
  });

  readonly totalPercent = computed(() =>
    this.data().reduce((sum, d) => sum + d.sharePercent, 0)
  );

  readonly donutOptions = computed(() => {
    const d = this.data();
    if (!d.length) return null;
    return {
      series: d.map((item) => Math.round(item.sharePercent * 100) / 100),
      chart: { type: 'donut' as const, height: 420, fontFamily: 'Inter, sans-serif', foreColor: this.chartForeColor(), animations: { enabled: true, easing: 'easeinout' as const, speed: 800 } },
      labels: d.map((item) => this.formatSourceName(item.energySource)),
      legend: { position: 'bottom' as const, fontSize: '13px', fontFamily: 'Inter', fontWeight: 500, markers: { size: 8 }, labels: { colors: this.chartTextColor() } },
      colors: d.map((item) => this.getSourceColor(item.energySource)),
      tooltip: { y: { formatter: (val: number) => `${val}%` } },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${Math.round(val * 10) / 10}%`,
        style: { fontSize: '13px', fontWeight: 700 },
        dropShadow: { enabled: false },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '55%',
            labels: {
              show: true,
              name: { show: true, fontSize: '14px', fontFamily: 'Inter', color: this.chartTextColor() },
              value: { show: true, fontSize: '22px', fontWeight: '800', fontFamily: 'Inter', color: this.chartTitleColor(), formatter: (val: string) => `${val}%` },
              total: {
                show: true,
                label: 'Total',
                fontSize: '13px',
                fontFamily: 'Inter',
                color: this.chartTextColor(),
                formatter: (w: { globals: { seriesTotals: number[] } }) => {
                  const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                  return `${Math.round(total * 10) / 10}%`;
                },
              },
            },
          },
        },
      },
      responsive: [{ breakpoint: 480, options: { chart: { width: 300 }, legend: { position: 'bottom' as const } } }],
      title: { text: `Participación Eléctrica — ${d[0].entity} (${d[0].year})`, style: { fontSize: '16px', fontWeight: '800', fontFamily: 'Inter', color: this.chartTitleColor() } },
    };
  });

  ngOnInit(): void { this.onSearch(); }

  onSearch(): void {
    if (this.filterForm.invalid) return;
    this.isLoading.set(true);
    this.hasSearched.set(true);
    const { entityName, year } = this.filterForm.getRawValue();
    this.energyService.getParticipation(year, entityName).subscribe({
      next: (result) => { this.data.set(result); this.isLoading.set(false); },
      error: () => { this.data.set([]); this.isLoading.set(false); },
    });
  }

  getSourceColor(source: string): string {
    return this.sourceColors[source] ?? '#94a3b8';
  }

  formatSourceName(source: string): string {
    return source
      .replace('Share Electricity ', '')
      .replace('Renewables', 'Renovables Total')
      .replace('Hydro', 'Hidroeléctrica')
      .replace('Wind', 'Eólica')
      .replace('Solar', 'Solar');
  }
}
