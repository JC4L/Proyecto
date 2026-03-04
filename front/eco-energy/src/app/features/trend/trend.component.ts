import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-trend',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="animate-fade-in">
      <h2 class="text-2xl font-black tracking-tight mb-1 text-slate-900">Tendencia Temporal</h2>
      <p class="text-slate-500 mb-6">Tendencia de un tipo de energía a lo largo del tiempo para una entidad.</p>
      <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <p class="text-slate-400 text-sm italic">Formulario de filtros, tabla y gráfico se implementarán en la siguiente fase.</p>
      </div>
    </div>
  `,
})
export class TrendComponent { }
