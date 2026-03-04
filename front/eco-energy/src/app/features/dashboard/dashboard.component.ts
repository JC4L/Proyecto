import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="animate-fade-in">
      <div class="mb-8">
        <h2 class="text-3xl font-black tracking-tight mb-1 text-slate-900">Panel de Control</h2>
        <p class="text-slate-500">Bienvenido de nuevo. Aquí tienes el resumen global de producción energética.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-blue-50 rounded-lg text-blue-600">
              <span class="material-symbols-outlined">bolt</span>
            </div>
          </div>
          <p class="text-sm text-slate-500 font-medium">Producción Total</p>
          <h3 class="text-2xl font-black text-slate-900">— TWh</h3>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-green-50 rounded-lg text-primary">
              <span class="material-symbols-outlined">eco</span>
            </div>
          </div>
          <p class="text-sm text-slate-500 font-medium">Energía Renovable</p>
          <h3 class="text-2xl font-black text-slate-900">— %</h3>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-amber-50 rounded-lg text-amber-600">
              <span class="material-symbols-outlined">military_tech</span>
            </div>
          </div>
          <p class="text-sm text-slate-500 font-medium">Ranking Global</p>
          <h3 class="text-2xl font-black text-slate-900">—</h3>
        </div>
      </div>
      <p class="text-sm text-slate-400 italic">Los datos se cargarán dinámicamente al conectarse con el backend.</p>
    </div>
  `,
})
export class DashboardComponent { }
