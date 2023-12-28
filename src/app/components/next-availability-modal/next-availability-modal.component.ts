import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Helper } from 'src/app/common/helper';
import { TrainUpdateInput } from 'src/app/services/search/search-input';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-next-availability-modal',
  templateUrl: './next-availability-modal.component.html',
  styleUrls: ['./next-availability-modal.component.scss']
})
export class NextAvailabilityModalComponent implements OnInit{

  @Input() train: any; // Assuming you have a Train interface or class
  @Input() doj: any;

  nextAvailList: any;
  loading = true;

  helper = Helper;

  constructor(public activeModal: NgbActiveModal, private searchService: SearchService) { }
  ngOnInit(): void {
    this.getNextAvailability();
  }

  getNextAvailability() {
    const trainUpdateInput: TrainUpdateInput = {
      source: this.train.fromStationCode,
      destination: this.train.toStationCode,
      doj: this.doj,
      quota: 'GN',
      trainNumber: this.train.trainNumber,
      class: this.train.availableClasses[0],
      // numberOfDays: 2
    };
    this.searchService.getNextAvailability(trainUpdateInput).subscribe((resonse) => {
      this.nextAvailList = resonse;
      this.loading = false;
    })
  }

  closeModal() {
    this.activeModal.dismiss('Cross click');
  }
}
