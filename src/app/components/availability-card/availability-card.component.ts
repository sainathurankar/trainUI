import { Component, Input, OnInit } from '@angular/core';
import { TrainUpdateInput } from 'src/app/services/search/search-input';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-availability-card',
  templateUrl: './availability-card.component.html',
  styleUrls: ['./availability-card.component.scss'],
})
export class AvailabilityCardComponent {
  @Input() avail: any;

  @Input() train: any;

  @Input() doj: any;

  updating = false;

  constructor(private searchService: SearchService) {}

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

  update() {
    this.updating = true;
    const trainUpdateInput: TrainUpdateInput =
    {
      source: this.train.fromStationCode,
      destination: this.train.toStationCode,
      doj: this.doj,
      quota: this.avail.quota,
      trainNumber: this.train.trainNumber,
      class: this.avail.className
    };

    this.searchService.getTrainUpdate(trainUpdateInput).subscribe((response) => {
      this.avail = response;
      this.updating = false;
    })
  }
}
