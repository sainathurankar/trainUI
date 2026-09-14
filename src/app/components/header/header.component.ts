import { Component, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
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
