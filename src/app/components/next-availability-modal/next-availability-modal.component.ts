import { Component, Input, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { retry, takeUntil } from 'rxjs/operators';
import { Helper } from 'src/app/common/helper';
import { TrainUpdateInput } from 'src/app/services/search/search-input';
import { Availability, Train } from 'src/app/models/train.models';
import { SearchService } from 'src/app/services/search/search.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
    selector: 'app-next-availability-modal',
    templateUrl: './next-availability-modal.component.html',
    styleUrls: ['./next-availability-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NextAvailabilityModalComponent implements OnInit, OnDestroy {
  activeModal = inject(NgbActiveModal);
  private searchService = inject(SearchService);
  private logger = inject(LoggerService);
  private cdr = inject(ChangeDetectorRef);

  @Input() train!: Train;
  @Input() doj!: string;

  availList: Availability[] = [];
  loading = false;
  private destroy$ = new Subject<void>();
  helper = Helper;

  private static readonly MAX_RETRIES = 5;
  private static readonly RETRY_DELAY_MS = 1000;

  tempDOJ = '';

  selectedClass = '';

  ngOnInit(): void {
    this.updateSelectedClass(this.train.availableClasses?.[0] ?? '');
  }

  updateSelectedClass(cls: string) {
    this.selectedClass = cls;
    this.availList = [];
    this.tempDOJ = this.doj;
    this.getAvailability();
  }

  getAvailability() {
    const trainUpdateInput: TrainUpdateInput = this.buildInput();

    this.loading = true;
    this.searchService
      .getNextAvailability(trainUpdateInput)
      .pipe(
        retry({
          count: NextAvailabilityModalComponent.MAX_RETRIES,
          delay: NextAvailabilityModalComponent.RETRY_DELAY_MS,
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response: Availability[]) => {
          this.availList = response;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.logger.error('Error in getAvailability:', error);
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  closeModal() {
    this.activeModal.dismiss('Cross click');
  }

  loadNextAvail() {
    this.tempDOJ = Helper.nextDayDate(
      this.availList[this.availList.length - 1].availablityDate ?? ''
    );
    this.loading = true;
    this.searchService
      .getNextAvailability(this.buildInput())
      .pipe(
        retry({
          count: NextAvailabilityModalComponent.MAX_RETRIES,
          delay: NextAvailabilityModalComponent.RETRY_DELAY_MS,
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response: Availability[]) => {
          this.availList.push(...response);
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.logger.error('Error in loadNextAvail:', error);
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  buildInput(): TrainUpdateInput {
    return {
      source: this.train.fromStationCode ?? '',
      destination: this.train.toStationCode ?? '',
      doj: this.tempDOJ,
      quota: 'GN',
      trainNumber: this.train.trainNumber ?? '',
      class: this.selectedClass,
      numberOfDays: 14,
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
