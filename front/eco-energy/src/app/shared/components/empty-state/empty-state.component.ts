import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
    selector: 'app-empty-state',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div class="p-4 bg-slate-100 rounded-full mb-4">
        <span class="material-symbols-outlined text-4xl text-slate-400">{{ icon() }}</span>
      </div>
      <h3 class="text-lg font-bold text-slate-700 mb-2">{{ title() }}</h3>
      <p class="text-sm text-slate-500 max-w-sm">{{ description() }}</p>
    </div>
  `,
})
export class EmptyStateComponent {
    readonly icon = input<string>('search_off');
    readonly title = input<string>('Sin resultados');
    readonly description = input<string>('No se encontraron datos para los filtros seleccionados. Intente con otros parámetros.');
}
