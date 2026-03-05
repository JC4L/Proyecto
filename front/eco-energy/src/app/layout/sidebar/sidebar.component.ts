import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="flex flex-col h-full w-64 bg-bg-dark text-white transition-theme">
      <!-- Brand -->
      <div class="flex items-center gap-3 p-6 border-b border-white/10">
        <div class="p-2 bg-primary rounded-lg">
          <span class="material-symbols-outlined text-bg-dark font-bold text-xl">bolt</span>
        </div>
        <div>
          <h1 class="text-lg font-extrabold tracking-tight leading-tight">EcoEnergy</h1>
          <p class="text-[10px] text-white/50 font-medium tracking-wider uppercase">Analytics Platform</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        @for (item of navItems(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-primary/15 text-primary border-primary/30"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white border border-transparent transition-smooth group"
          >
            <span class="material-symbols-outlined text-[20px] group-hover:scale-110 transition-smooth">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-white/10">
        <a
          routerLink="/dashboard"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:bg-white/10 hover:text-white transition-smooth"
        >
          <span class="material-symbols-outlined text-[20px]">settings</span>
          <span>Configuración</span>
        </a>
      </div>
    </aside>
  `,
  styles: `:host { display: contents; }`,
})
export class SidebarComponent {
  readonly themeService = inject(ThemeService);

  readonly navItems = signal<NavItem[]>([
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'factory', label: 'Producción Total', route: '/total-production' },
    { icon: 'bolt', label: '% Renovable', route: '/percent-electrical' },
    { icon: 'trending_up', label: 'Tendencia', route: '/trend' },
    { icon: 'public', label: 'Top Países', route: '/top-countries' },
    { icon: 'pie_chart', label: 'Participación', route: '/participation' },
  ]);
}
