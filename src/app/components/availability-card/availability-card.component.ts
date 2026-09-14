import { Component, Input, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Helper } from 'src/app/common/helper';
import { TrainUpdateInput } from 'src/app/services/search/search-input';
import { Availability, Train } from 'src/app/models/train.models';
import { SearchService } from 'src/app/services/search/search.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-availability-card',
    templateUrl: './availability-card.component.html',
    styleUrls: ['./availability-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AvailabilityCardComponent implements OnInit, OnDestroy {
  private searchService = inject(SearchService);
  private cdr = inject(ChangeDetectorRef);

  readonly helper = Helper;

  @Input() avail!: Availability;

  @Input() train!: Train;

  @Input() doj!: string;

  @Input() updateStatus = true;

  updating = false;
  private destroy$ = new Subject<void>();
  ngOnInit(): void {
    const hours = 2; // specify the hours that need to be updated
    const currentTimeInMilliSeconds = new Date().getTime();
    if (this.updateStatus &&
      (this.avail.lastUpdatedOnRaw ?? 0) <
        currentTimeInMilliSeconds - 3600000 * hours &&
      !environment.mock
    ) {
      this.update();
    }
  }

  getQuotaCardClass(status: string | undefined): Record<string, boolean> {
    return {
      'border-success':
        status === 'AVBL' || status === 'CURR_AVBL' || status === 'RAC',
      'border-warning': (status?.indexOf('WL') ?? -1) > 0,
      'border-danger':
        status === 'REGRET' ||
        status === 'NOT AVAILABLE' ||
        status === 'CLASS NOT EXIST' ||
        status === 'TRAIN CANCELLED',
    };
  }

  getAvailabilityClass(status: string | undefined): Record<string, boolean> {
    return {
      'text-success':
        status === 'AVBL' || status === 'CURR_AVBL' || status === 'RAC',
      'text-warning': (status?.indexOf('WL') ?? -1) > 0,
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
      source: this.train.fromStationCode ?? '',
      destination: this.train.toStationCode ?? '',
      doj: this.doj,
      quota: this.avail.quota ?? '',
      trainNumber: this.train.trainNumber ?? '',
      class: this.avail.className ?? '',
    };

    this.searchService
      .getTrainUpdate(trainUpdateInput)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.avail = response;
        this.updating = false;
        this.cdr.markForCheck();
      });
  }

  navigateToBooking() {
    const link = Helper.buildRedBusHyperLink(
      this.train.fromStationCode ?? '',
      this.train.toStationCode ?? '',
      this.doj,
      this.train.trainNumber ?? '',
      this.avail.className ?? '',
      this.avail.quota ?? '',
      this.train.trainName ?? '',
      this.avail.availablityType ?? ''
    );
    window.open(link, '_blank');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
