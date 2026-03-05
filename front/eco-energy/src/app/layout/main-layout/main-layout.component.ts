import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-bg-light dark:bg-bg-dark transition-theme">
      <!-- Desktop Sidebar -->
      <div class="hidden md:block flex-shrink-0">
        <app-sidebar />
      </div>

      <!-- Mobile Sidebar Overlay -->
      @if (mobileSidebarOpen()) {
        <div class="sidebar-overlay md:hidden" (click)="closeMobileSidebar()"></div>
        <div class="sidebar-mobile md:hidden w-64">
          <app-sidebar />
        </div>
      }

      <!-- Main -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />

        <main class="flex-1 overflow-y-auto p-4 md:p-8">
          <router-outlet />
        </main>

        <!-- Footer -->
        <footer class="h-10 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs text-slate-400 dark:text-slate-600 px-4 transition-theme">
          <span>© 2026 EcoEnergy Analytics — Talento Tech</span>
        </footer>
      </div>
    </div>
  `,
  styles: `:host { display: contents; }`,
})
export class MainLayoutComponent implements AfterViewInit {
  readonly themeService = inject(ThemeService);
  readonly mobileSidebarOpen = signal(false);

  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  ngAfterViewInit(): void {
    this.headerComponent.registerSidebarToggle(() => this.toggleMobileSidebar());
  }

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen.update((v) => !v);
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen.set(false);
  }
}
