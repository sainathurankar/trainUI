import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-availability-card',
  templateUrl: './availability-card.component.html',
  styleUrls: ['./availability-card.component.scss'],
})
export class AvailabilityCardComponent {
  @Input() avail: any;

  constructor() {}

  getQuotaCardClass(status: string): { [key: string]: boolean } {
    return {
      'border-success':
        status === 'Available' || status === 'CURR_AVBL' || status === 'RAC',
      'border-warning': status?.indexOf('WL') > 0,
      'border-danger':
        status === 'REGRET' ||
        status === 'NOT AVAILABLE' ||
        status === 'CLASS NOT EXIST',
    };
  }

  getAvailabilityClass(status: string): { [key: string]: boolean } {
    return {
      'text-success':
        status === 'Available' || status === 'CURR_AVBL' || status === 'RAC',
      'text-warning': status?.indexOf('WL') > 0,
      'text-danger':
        status === 'REGRET' ||
        status === 'NOT AVAILABLE' ||
        status === 'CLASS NOT EXIST',
    };
  }
}
