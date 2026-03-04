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
import { TrendEnergy, ENERGY_TYPES } from '../../core/models/energy.models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-trend',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgApexchartsModule, LoadingSpinnerComponent, EmptyStateComponent, DecimalPipe],
  template: `
    <div class="animate-fade-in">
      <div class="mb-6">
        <h2 class="text-2xl font-black tracking-tight text-slate-900">Tendencia Temporal</h2>
        <p class="text-slate-500">Evolución de un tipo de energía a lo largo del tiempo para una entidad.</p>
      </div>

      <!-- Filters -->
      <form [formGroup]="filterForm" (ngSubmit)="onSearch()" class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1" for="tr-energy">Tipo de Energía</label>
            <select id="tr-energy" formControlName="energyType"
              class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none">
              @for (type of energyTypes; track type.name) {
                <option [value]="type.name">{{ type.name }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1" for="tr-entity">Entidad / País</label>
            <input id="tr-entity" type="text" formControlName="entityName" placeholder="World, China, etc."
              class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1" for="tr-limit">Nº de Años</label>
            <input id="tr-limit" type="number" formControlName="limit" min="5" max="50"
              class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
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
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
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
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50">
                <th class="px-6 py-3 text-left font-semibold text-slate-600">Año</th>
                <th class="px-6 py-3 text-left font-semibold text-slate-600">País / Entidad</th>
                <th class="px-6 py-3 text-right font-semibold text-slate-600">Valor</th>
                <th class="px-6 py-3 text-left font-semibold text-slate-600">Unidad</th>
              </tr>
            </thead>
            <tbody>
              @for (item of sortedData(); track item.year) {
                <tr class="border-b border-slate-50 hover:bg-primary/5 transition-fast">
                  <td class="px-6 py-3 font-semibold text-slate-800">{{ item.year }}</td>
                  <td class="px-6 py-3 text-slate-600">{{ item.country }}</td>
                  <td class="px-6 py-3 text-right font-bold text-slate-900">{{ item.totalSolarCapacity | number:'1.2-2' }}</td>
                  <td class="px-6 py-3 text-slate-500">{{ item.unit }}</td>
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
      chart: { type: 'area' as const, height: 350, fontFamily: 'Inter, sans-serif', toolbar: { show: false }, animations: { enabled: true, easing: 'easeinout' as const, speed: 800 } },
      stroke: { curve: 'smooth' as const, width: 3 },
      colors: ['#13ec6d'],
      markers: { size: 4, colors: ['#13ec6d'], strokeColors: '#fff', strokeWidth: 2, hover: { size: 7 } },
      dataLabels: { enabled: false },
      xaxis: { categories: sorted.map((d) => d.year.toString()), labels: { style: { fontSize: '12px' } } },
      yaxis: { labels: { style: { fontSize: '12px' }, formatter: (val: number) => `${val.toLocaleString()}` } },
      fill: { type: 'gradient' as const, gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } },
      tooltip: { y: { formatter: (val: number) => `${val.toLocaleString()} ${unit}` } },
      grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
      title: { text: `Tendencia — ${sorted[0].country}`, style: { fontSize: '16px', fontWeight: '800', fontFamily: 'Inter', color: '#0f172a' } },
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
