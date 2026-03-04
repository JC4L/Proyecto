import { Component, ChangeDetectionStrategy } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <header
      class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10"
    >
      <!-- Search Bar -->
      <div class="flex items-center flex-1 max-w-xl">
        <div class="relative w-full">
          <span
            class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            >search</span
          >
          <input
            type="text"
            placeholder="Buscar datos, países o reportes..."
            class="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-fast"
          />
        </div>
      </div>

      <!-- Right Section -->
      <div class="flex items-center gap-4">
        <!-- Notifications -->
        <button
          class="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-fast"
          aria-label="Notificaciones"
        >
          <span class="material-symbols-outlined">notifications</span>
        </button>

        <div class="h-8 w-px bg-slate-200"></div>

        <!-- User Info -->
        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <p class="text-xs font-bold text-slate-900">Usuario</p>
            <p class="text-[10px] text-slate-500">Analista de Energía</p>
          </div>
          <div
            class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30"
          >
            <span class="material-symbols-outlined text-primary">person</span>
          </div>
        </div>

        <!-- Logout -->
        <button
          (click)="onLogout()"
          class="p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-full transition-fast"
          aria-label="Cerrar sesión"
        >
          <span class="material-symbols-outlined">logout</span>
        </button>
      </div>
    </header>
  `,
    styles: `
    :host {
      display: contents;
    }
  `,
})
export class HeaderComponent {
    private readonly authService = inject(AuthService);

    onLogout(): void {
        this.authService.logout();
    }
}
