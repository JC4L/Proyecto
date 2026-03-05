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
import { TrendEnergy, ENERGY_TYPES } from '../../core/models/energy.models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { entities } from '../../constant/entities';

@Component({
  selector: 'app-trend',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgApexchartsModule, LoadingSpinnerComponent, EmptyStateComponent, DecimalPipe],
  template: `
    <div class="animate-fade-in">
      <div class="mb-6">
        <h2 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Tendencia Temporal</h2>
        <p class="text-slate-500 dark:text-slate-400">Evolución de un tipo de energía a lo largo del tiempo para una entidad.</p>
      </div>

      <!-- Filters -->
      <form [formGroup]="filterForm" (ngSubmit)="onSearch()" class="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1" for="tr-energy">Tipo de Energía</label>
            <select id="tr-energy" formControlName="energyType"
              class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none">
              @for (type of energyTypes; track type.name) {
                <option [value]="type.name">{{ type.name }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1" for="tr-entity">Entidad</label>
            <select id="tr-entity" formControlName="entityName"
              class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none">
              <option value="World" selected>World</option>
              @for (entity of entities; track entity) {
                <option [value]="entity">{{ entity }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1" for="tr-limit">Nº de Años</label>
            <input id="tr-limit" type="number" formControlName="limit" min="5" max="50"
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
        <!-- Chart first for trend -->
        @if (chartOptions()) {
          <div class="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
            <apx-chart
              [series]="chartOptions()!.series" [chart]="chartOptions()!.chart"
              [xaxis]="chartOptions()!.xaxis" [yaxis]="chartOptions()!.yaxis"
              [stroke]="chartOptions()!.stroke" [dataLabels]="chartOptions()!.dataLabels"
              [tooltip]="chartOptions()!.tooltip" [grid]="chartOptions()!.grid"
              [colors]="chartOptions()!.colors" [fill]="chartOptions()!.fill"
              [title]="chartOptions()!.title"
              [markers]="chartOptions()!.markers" />
          </div>
        }

        <!-- Table -->
        <div class="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th class="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Año</th>
                <th class="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">País / Entidad</th>
                <th class="px-6 py-3 text-right font-semibold text-slate-600 dark:text-slate-400">Valor</th>
                <th class="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Unidad</th>
              </tr>
            </thead>
            <tbody>
              @for (item of sortedData(); track item.year) {
                <tr class="border-b border-slate-50 dark:border-slate-800 hover:bg-primary/5 transition-fast">
                  <td class="px-6 py-3 font-semibold text-slate-800 dark:text-white">{{ item.year }}</td>
                  <td class="px-6 py-3 text-slate-600 dark:text-slate-400">{{ item.country }}</td>
                  <td class="px-6 py-3 text-right font-bold text-slate-900 dark:text-white">{{ item.totalSolarCapacity | number:'1.2-2' }}</td>
                  <td class="px-6 py-3 text-slate-500 dark:text-slate-400">{{ item.unit }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (!isLoading() && data().length === 0 && hasSearched()) {
        <app-empty-state />
      }
    </div>
  `,
})
export class TrendComponent implements OnInit {
  private readonly energyService = inject(EnergyService);
  private readonly fb = inject(FormBuilder);
  private readonly themeService = inject(ThemeService);
  readonly entities = entities;

  private readonly chartTitleColor = computed(() => this.themeService.darkMode() ? '#FFFFFF' : '#0f172a');
  private readonly chartTextColor = computed(() => this.themeService.darkMode() ? '#94A3B8' : '#334155');
  private readonly chartGridColor = computed(() => this.themeService.darkMode() ? '#1e3a2c' : '#f1f5f9');
  private readonly chartForeColor = computed(() => this.themeService.darkMode() ? '#F1F5F9' : '#373d3f');

  readonly isLoading = signal(false);
  readonly hasSearched = signal(false);
  readonly data = signal<TrendEnergy[]>([]);
  readonly energyTypes = ENERGY_TYPES;

  readonly sortedData = computed(() => [...this.data()].sort((a, b) => a.year - b.year));

  readonly filterForm = this.fb.nonNullable.group({
    energyType: ['Installed Solar PV Capacity'],
    entityName: ['World'],
    limit: [20, [Validators.required, Validators.min(5), Validators.max(50)]],
  });

  readonly chartOptions = computed(() => {
    const sorted = this.sortedData();
    if (!sorted.length) return null;
    const unit = sorted[0].unit;
    return {
      series: [{ name: `Valor (${unit})`, data: sorted.map((d) => Math.round(d.totalSolarCapacity * 100) / 100) }],
      chart: { type: 'area' as const, height: 350, fontFamily: 'Inter, sans-serif', foreColor: this.chartForeColor(), toolbar: { show: false }, animations: { enabled: true, easing: 'easeinout' as const, speed: 800 } },
      stroke: { curve: 'smooth' as const, width: 3 },
      colors: ['#13ec6d'],
      markers: { size: 4, colors: ['#13ec6d'], strokeColors: '#fff', strokeWidth: 2, hover: { size: 7 } },
      dataLabels: { enabled: false },
      xaxis: { categories: sorted.map((d) => d.year.toString()), labels: { style: { fontSize: '12px', colors: this.chartTextColor() } } },
      yaxis: { labels: { style: { fontSize: '12px', colors: [this.chartTextColor()] }, formatter: (val: number) => `${val.toLocaleString()}` } },
      fill: { type: 'gradient' as const, gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } },
      tooltip: { theme: this.themeService.darkMode() ? 'dark' : 'light', y: { formatter: (val: number) => `${val.toLocaleString()} ${unit}` } },
      grid: { borderColor: this.chartGridColor(), strokeDashArray: 4 },
      title: { text: `Tendencia — ${sorted[0].country}`, style: { fontSize: '16px', fontWeight: '800', fontFamily: 'Inter', color: this.chartTitleColor() } },
    };
  });

  ngOnInit(): void { this.onSearch(); }

  onSearch(): void {
    if (this.filterForm.invalid) return;
    this.isLoading.set(true);
    this.hasSearched.set(true);
    const { energyType, entityName, limit } = this.filterForm.getRawValue();
    this.energyService.getTrend(energyType, entityName, limit).subscribe({
      next: (result) => { this.data.set(result); this.isLoading.set(false); },
      error: () => { this.data.set([]); this.isLoading.set(false); },
    });
  }
}
