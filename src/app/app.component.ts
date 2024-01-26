import { AfterViewInit, Component } from '@angular/core';
import { StatusService } from './services/status/status.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  title = 'trainUI';
  apiLoading: boolean = false;
  showAppReadyMessage: boolean = false;
  failed: boolean = false;

  constructor(private statusService: StatusService) {}

  ngAfterViewInit(): void {
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
