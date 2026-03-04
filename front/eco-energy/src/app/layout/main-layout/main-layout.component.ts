import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-main-layout',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, SidebarComponent, HeaderComponent],
    template: `
    <div class="flex min-h-screen w-full bg-bg-light">
      <!-- Sidebar (hidden on mobile) -->
      <div class="hidden md:flex">
        <app-sidebar />
      </div>

      <!-- Main Area -->
      <main class="flex-1 flex flex-col overflow-y-auto">
        <app-header />

        <!-- Page Content -->
        <div class="flex-1 p-6 md:p-8 animate-fade-in">
          <router-outlet />
        </div>

        <!-- Footer -->
        <footer
          class="mt-auto bg-white border-t border-slate-200 px-8 py-6"
        >
          <div class="flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">bolt</span>
              <span class="font-bold text-sm text-slate-800">EcoEnergy © 2024</span>
            </div>
            <div class="flex gap-8">
              <a href="#" class="text-xs text-slate-500 hover:text-primary transition-fast">Soporte</a>
              <a href="#" class="text-xs text-slate-500 hover:text-primary transition-fast">Privacidad</a>
              <a href="#" class="text-xs text-slate-500 hover:text-primary transition-fast">Contacto</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  `,
    styles: `
    :host {
      display: block;
      min-height: 100dvh;
    }
  `,
})
export class MainLayoutComponent { }
