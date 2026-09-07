import { Component, HostListener, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HeaderComponent {
  private router = inject(Router);
  private themeService = inject(ThemeService);

  theme = this.themeService.theme;

  scrolled = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 12;
  }

  navigateToHome() {
    this.router.navigateByUrl('');
  }

  toggleTheme() {
    this.themeService.toggle();
  }
}
