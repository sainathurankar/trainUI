import { Component, HostListener, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HeaderComponent {
  private router = inject(Router);


  scrolled = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 12;
  }

  navigateToHome() {
    this.router.navigateByUrl('');
  }

}
