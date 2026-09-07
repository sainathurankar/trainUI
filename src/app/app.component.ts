import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { StatusService } from './services/status/status.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent implements OnInit {
  private statusService = inject(StatusService);


  title = 'trainUI';
  apiLoading = false;
  showAppReadyMessage = false;
  failed = false;

  // Runs before the first change-detection pass so toggling apiLoading here
  // doesn't trigger NG0100 ExpressionChangedAfterItHasBeenCheckedError.
  ngOnInit(): void {
    this.checkAPIStatus();
  }

  checkAPIStatus() {
    this.apiLoading = true;
    this.statusService.getAPIStatus().subscribe(
      (response) => {
        console.log("API status: ", response);
        this.apiLoading = false;
        this.showAppReadyMessage = true;
        setTimeout(() => {
          this.showAppReadyMessage = false;
        }, 1000);
      },
      (error) => {
        console.error("API error: ", error);
        this.apiLoading = false;
        this.failed = true;
      }
    );
  }
}
