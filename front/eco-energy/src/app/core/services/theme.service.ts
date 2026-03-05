import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly STORAGE_KEY = 'eco_energy_theme';

    /** Signal holding the current theme: 'light' or 'dark' */
    readonly darkMode = signal<boolean>(this.loadStoredTheme());

    constructor() {
        // Effect to sync the theme class on <html> and persist to localStorage
        effect(() => {
            const isDark = this.darkMode();
            const htmlEl = document.documentElement;

            if (isDark) {
                htmlEl.classList.add('dark');
            } else {
                htmlEl.classList.remove('dark');
            }

            localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
        });
    }

    toggle(): void {
        this.darkMode.update((v) => !v);
    }

    private loadStoredTheme(): boolean {
        if (typeof window === 'undefined') return false;
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) return stored === 'dark';
        // Default to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
}
