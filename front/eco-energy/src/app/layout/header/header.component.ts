import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="h-16 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-theme"
    >
      <!-- Left: Hamburger (mobile) + Search -->
      <div class="flex items-center gap-3 flex-1 max-w-xl">
        <!-- Mobile hamburger -->
        <button
          (click)="onToggleSidebar()"
          class="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-fast"
          aria-label="Menú de navegación"
        >
          <span class="material-symbols-outlined">menu</span>
        </button>

        <!-- Search -->
        <div class="relative w-full hidden sm:block">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="Buscar datos, países o reportes..."
            class="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 outline-none transition-fast"
          />
        </div>
      </div>

      <!-- Right Section -->
      <div class="flex items-center gap-2 md:gap-4">
        <!-- Dark mode toggle -->
        <button
          (click)="toggleTheme()"
          class="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-fast"
          [attr.aria-label]="themeService.darkMode() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
        >
          <span class="material-symbols-outlined">
            {{ themeService.darkMode() ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>

        <!-- Notifications -->
        <button
          class="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-fast"
          aria-label="Notificaciones"
        >
          <span class="material-symbols-outlined">notifications</span>
        </button>

        <div class="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

        <!-- User -->
        <div class="flex items-center gap-3 hidden sm:flex">
          <div class="text-right">
            <p class="text-xs font-bold text-slate-900 dark:text-slate-100">{{ userKey }}</p>
          </div>
          <div class="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
            <span class="material-symbols-outlined text-primary text-[20px]">person</span>
          </div>
        </div>

        <!-- Logout -->
        <button
          (click)="onLogout()"
          class="p-2 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-full transition-fast"
          aria-label="Cerrar sesión"
        >
          <span class="material-symbols-outlined">logout</span>
        </button>
      </div>
    </header>
  `,
  styles: `:host { display: contents; }`,
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);

  readonly userKey = localStorage.getItem('eco_energy_user');

  /** Emits to parent layout via a callback */
  private sidebarToggleFn: (() => void) | null = null;

  registerSidebarToggle(fn: () => void): void {
    this.sidebarToggleFn = fn;
  }

  onToggleSidebar(): void {
    this.sidebarToggleFn?.();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
