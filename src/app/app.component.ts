import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { StatusService } from './services/status/status.service';
import { ThemeService } from './services/theme/theme.service';
import { LoggerService } from './services/logger/logger.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AppComponent implements OnInit {
  private statusService = inject(StatusService);
  private themeService = inject(ThemeService);
  private logger = inject(LoggerService);
  private cdr = inject(ChangeDetectorRef);


  title = 'trainUI';
  apiLoading = false;
  showAppReadyMessage = false;
  failed = false;

  ngOnInit(): void {
    this.themeService.init();
    this.checkAPIStatus();
  }

  checkAPIStatus() {
    this.apiLoading = true;
    this.statusService.getAPIStatus().subscribe({
      next: (response) => {
        this.logger.log('API status: ', response);
        this.apiLoading = false;
        this.showAppReadyMessage = true;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.showAppReadyMessage = false;
          this.cdr.markForCheck();
        }, 1000);
      },
      error: (error) => {
        this.logger.error('API error: ', error);
        this.apiLoading = false;
        this.failed = true;
        this.cdr.markForCheck();
      }
    });
  }
}
