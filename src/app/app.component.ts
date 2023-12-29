import { Component, OnInit } from '@angular/core';
import { StatusService } from './services/status/status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  title = 'trainUI';

  constructor(private statusService: StatusService) {}

  ngOnInit(): void {
    this.checkAPIStatus();
  }

  checkAPIStatus() {
    this.statusService.getAPIStatus().subscribe((response) => {
      window.alert("API is UP");
      console.log("API status: ", response);
    })
  }
}
