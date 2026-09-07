import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private static readonly STORAGE_KEY = 'railgo-theme';

  /** Reactive current theme. */
  readonly theme = signal<ThemeMode>('light');

  /** Read stored/system preference and apply it. Call once at app start. */
  init(): void {
    const stored = this.readStored();
    const initial: ThemeMode = stored ?? (this.prefersDark() ? 'dark' : 'light');
    this.apply(initial);

    // React to OS-level changes only when the user hasn't set an explicit choice.
    if (!stored && typeof window !== 'undefined' && window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          if (!this.readStored()) {
            this.apply(e.matches ? 'dark' : 'light');
          }
        });
    }
  }

  toggle(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(mode: ThemeMode): void {
    this.apply(mode);
    try {
      localStorage.setItem(ThemeService.STORAGE_KEY, mode);
    } catch {
      /* storage unavailable (private mode) — non-fatal */
    }
  }

  private apply(mode: ThemeMode): void {
    this.theme.set(mode);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', mode === 'dark' ? '#0b1120' : '#4f46e5');
      }
    }
  }

  private readStored(): ThemeMode | null {
    try {
      const v = localStorage.getItem(ThemeService.STORAGE_KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch {
      return null;
    }
  }

  private prefersDark(): boolean {
    return (
      typeof window !== 'undefined' &&
      !!window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }
}
