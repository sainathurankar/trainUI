import { Component, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class HeaderComponent {
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private cdr = inject(ChangeDetectorRef);

  theme = this.themeService.theme;

  scrolled = false;
  /** True on the home/search landing route. Other pages hide the top bar on mobile. */
  isHome = true;

  constructor() {
    this.isHome = this.computeIsHome(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const next = this.computeIsHome(e.urlAfterRedirects);
        if (next !== this.isHome) {
          this.isHome = next;
          this.cdr.markForCheck();
        }
      });
  }

  private computeIsHome(url: string): boolean {
    const path = (url.split('?')[0] || '').replace(/\/+$/, '');
    return path === '' || path === '/home';
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const next = window.scrollY > 12;
    if (next !== this.scrolled) {
      this.scrolled = next;
      this.cdr.markForCheck();
    }
  }

  navigateToHome() {
    this.router.navigateByUrl('');
  }

  toggleTheme() {
    this.themeService.toggle();
  }
}
