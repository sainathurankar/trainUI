import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-availability-card',
  templateUrl: './availability-card.component.html',
  styleUrls: ['./availability-card.component.scss']
})
export class AvailabilityCardComponent {

  @Input() avail: any;

  constructor() { }

}
