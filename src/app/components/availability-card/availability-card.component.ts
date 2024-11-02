import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Helper } from 'src/app/common/helper';
import { TrainUpdateInput } from 'src/app/services/search/search-input';
import { SearchService } from 'src/app/services/search/search.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-availability-card',
  templateUrl: './availability-card.component.html',
  styleUrls: ['./availability-card.component.scss'],
})
export class AvailabilityCardComponent implements OnInit, OnDestroy {
  @Input() avail: any;

  @Input() train: any;

  @Input() doj: any;

  @Input() updateStatus = true;

  updating = false;
  private destroy$ = new Subject<void>();

  constructor(private searchService: SearchService) {}
  ngOnInit(): void {
    const hours = 2; // specify the hours that need to be updated
    const currentTimeInMilliSeconds = new Date().getTime();
    if (this.updateStatus &&
      this.avail.lastUpdatedOnRaw <
        currentTimeInMilliSeconds - 3600000 * hours &&
      !environment.mock
    ) {
      this.update();
    }
  }

  getQuotaCardClass(status: string): { [key: string]: boolean } {
    return {
      'border-success':
        status === 'AVBL' || status === 'CURR_AVBL' || status === 'RAC',
      'border-warning': status?.indexOf('WL') > 0,
      'border-danger':
        status === 'REGRET' ||
        status === 'NOT AVAILABLE' ||
        status === 'CLASS NOT EXIST' ||
        status === 'TRAIN CANCELLED',
    };
  }

  getAvailabilityClass(status: string): { [key: string]: boolean } {
    return {
      'text-success':
        status === 'AVBL' || status === 'CURR_AVBL' || status === 'RAC',
      'text-warning': status?.indexOf('WL') > 0,
      'text-danger':
        status === 'REGRET' ||
        status === 'NOT AVAILABLE' ||
        status === 'CLASS NOT EXIST' ||
        status === 'TRAIN CANCELLED',
    };
  }

  update() {
    this.updating = true;
    const trainUpdateInput: TrainUpdateInput = {
      source: this.train.fromStationCode,
      destination: this.train.toStationCode,
      doj: this.doj,
      quota: this.avail.quota,
      trainNumber: this.train.trainNumber,
      class: this.avail.className,
    };

    this.searchService
      .getTrainUpdate(trainUpdateInput)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.avail = response;
        this.updating = false;
      });
  }

  navigateToBooking() {
    const link = Helper.buildRedBusHyperLink(
      this.train.fromStationCode,
      this.train.toStationCode,
      this.doj,
      this.train.trainNumber,
      this.avail.className,
      this.avail.quota,
      this.train.trainName,
      this.avail.availablityType
    );
    window.open(link, '_blank');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
