import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
    label: string;
    icon: string;
    route: string;
}

@Component({
    selector: 'app-sidebar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterLinkActive],
    template: `
    <aside class="w-72 bg-white border-r border-slate-200 flex flex-col h-full">
      <!-- Brand -->
      <div class="p-6 flex items-center gap-3">
        <div class="bg-primary p-2 rounded-lg flex items-center justify-center">
          <span class="material-symbols-outlined text-bg-dark">bolt</span>
        </div>
        <div>
          <h1 class="text-lg font-bold leading-tight text-slate-900">EcoEnergy</h1>
          <p class="text-xs text-slate-500">Gestión de Recursos</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        @for (item of navItems(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-primary/20 text-slate-900 border-r-4 border-primary font-semibold"
            class="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-primary/10 transition-fast"
          >
            <span class="material-symbols-outlined">{{ item.icon }}</span>
            <span class="text-sm font-medium">{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-200">
        <a
          class="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 hover:bg-primary/10 transition-fast cursor-pointer"
        >
          <span class="material-symbols-outlined">settings</span>
          <span class="text-sm font-medium">Ajustes</span>
        </a>
      </div>
    </aside>
  `,
    styles: `
    :host {
      display: contents;
    }
  `,
})
export class SidebarComponent {
    readonly navItems = signal<NavItem[]>([
        { label: 'Panel de Control', icon: 'dashboard', route: '/dashboard' },
        { label: 'Producción Total', icon: 'factory', route: '/total-production' },
        { label: '% Renovable', icon: 'eco', route: '/percent-electrical' },
        { label: 'Tendencias', icon: 'trending_up', route: '/trend' },
        { label: 'Principales Países', icon: 'public', route: '/top-countries' },
        { label: 'Participación Global', icon: 'pie_chart', route: '/participation' },
    ]);
}
