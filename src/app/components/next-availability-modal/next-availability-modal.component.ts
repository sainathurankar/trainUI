import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { timer } from 'rxjs';
import { delayWhen, retryWhen, take } from 'rxjs/operators';
import { Helper } from 'src/app/common/helper';
import { TrainUpdateInput } from 'src/app/services/search/search-input';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-next-availability-modal',
  templateUrl: './next-availability-modal.component.html',
  styleUrls: ['./next-availability-modal.component.scss'],
})
export class NextAvailabilityModalComponent implements OnInit {
  @Input() train: any;
  @Input() doj: any;

  availList: any[] = [];
  loading = false;
  loadingNext = false;

  tempDOJ: any;

  helper = Helper;

  selectedClass: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private searchService: SearchService
  ) {}
  ngOnInit(): void {
    this.updateSelectedClass(this.train.availableClasses[0]);
  }

  updateSelectedClass(cls: string) {
    this.selectedClass = cls;
    this.availList = [];
    this.tempDOJ = this.doj;
    this.getAvailability();
  }

  getAvailability() {
    const trainUpdateInput: TrainUpdateInput = this.buildInput();
    const maxRetries = 5;

    this.loading = true;
    this.searchService
      .getNextAvailability(trainUpdateInput)
      .pipe(
        retryWhen((errors) =>
          errors.pipe(
            delayWhen(() => timer(1000)), // Delay for 1 second between retries
            take(maxRetries) // Maximum number of retries
          )
        )
      )
      .subscribe(
        (response) => {
          this.availList = response;
          this.loading = false;
        },
        (error) => {
          console.error('Error after maximum retries', error);
          this.loading = false;
        }
      );
  }

  closeModal() {
    this.activeModal.dismiss('Cross click');
  }

  loadNextAvail() {
    this.tempDOJ = this.helper.nextDayDate(
      this.availList[this.availList.length - 1].availablityDate
    );
    this.loading = true;
    this.searchService
      .getNextAvailability(this.buildInput())
      .subscribe((response) => {
        this.availList.push(...response);
        this.loading = false;
      });
  }

  buildInput(): TrainUpdateInput {
    return {
      source: this.train.fromStationCode,
      destination: this.train.toStationCode,
      doj: this.tempDOJ,
      quota: 'GN',
      trainNumber: this.train.trainNumber,
      class: this.selectedClass,
      numberOfDays: 6,
    };
  }
}
