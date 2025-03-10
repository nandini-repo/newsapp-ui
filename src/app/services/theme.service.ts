import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly STORAGE_KEY = 'theme_preference';
    private themeSubject = new BehaviorSubject<Theme>('light');

    constructor() {
        this.loadThemePreference();
    }

    private loadThemePreference(): void {
        const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
        if (stored) {
            this.setTheme(stored);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light');
        }
    }

    getTheme(): Observable<Theme> {
        return this.themeSubject.asObservable();
    }

    setTheme(theme: Theme): void {
        localStorage.setItem(this.STORAGE_KEY, theme);
        this.themeSubject.next(theme);
        document.documentElement.setAttribute('data-theme', theme);
    }

    toggleTheme(): void {
        const current = this.themeSubject.value;
        this.setTheme(current === 'light' ? 'dark' : 'light');
    }
} 