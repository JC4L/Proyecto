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
    <aside class="flex flex-col h-full w-64 dark:bg-bg-dark bg-bg-light text-bg-dark dark:text-white transition-theme">
      <!-- Brand -->
      <div class="flex items-center gap-3 px-6 border-b dark:border-slate-800  border-bg-dark/10 h-16 bg-white dark:bg-surface-dark theme transition-theme">
        <div class="p-1 bg-primary rounded-[12px] flex items-center justify-center">
          <span class="material-symbols-outlined text-bg-dark font-bold text-xl">bolt</span>
        </div>
        <div>
          <h1 class="text-lg font-extrabold tracking-tight leading-tight">EcoEnergy</h1>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto border-r dark:border-slate-800  border-slate-200 transition-theme">
        @for (item of navItems(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-primary/50 dark:bg-primary/15 border-primary/30"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-bg-dark/70 dark:text-white/70 hover:bg-bg-dark/10 dark:hover:bg-white/10 hover:text-bg-dark dark:hover:text-white border border-transparent transition-smooth group"
          >
            <span class="material-symbols-outlined text-[20px] group-hover:scale-110 transition-smooth">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Footer -->
      <div class="p-4 border-r border-t dark:border-slate-800  border-slate-200 transition-theme">
        <a
          routerLink="/about-us"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-bg-dark/70 dark:text-white/70 hover:bg-bg-dark/10 dark:hover:bg-white/10 hover:text-bg-dark dark:hover:text-white border border-transparent transition-smooth group"
        >
          <span class="material-symbols-outlined text-[20px]">people</span>
          <span>Sobre nosotros</span>
        </a>
      </div>
    </aside>
  `,
  styles: `:host { display: contents; }`,
})
export class SidebarComponent {
  readonly themeService = inject(ThemeService);

  readonly navItems = signal<NavItem[]>([
    { icon: 'dashboard', label: 'Panel General', route: '/dashboard' },
    { icon: 'factory', label: 'Producción Total', route: '/total-production' },
    { icon: 'bolt', label: 'Renovable %', route: '/percent-electrical' },
    { icon: 'trending_up', label: 'Tendencia', route: '/trend' },
    { icon: 'public', label: 'Top Países', route: '/top-countries' },
    { icon: 'pie_chart', label: 'Participación', route: '/participation' },
  ]);
}
