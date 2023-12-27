import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NextAvailabilityModalComponent } from '../next-availability-modal/next-availability-modal.component';

@Component({
  selector: 'app-next-availabilty',
  templateUrl: './next-availabilty.component.html',
  styleUrls: ['./next-availabilty.component.scss']
})
export class NextAvailabiltyComponent {

  @Input() train: any;
  @Input() doj: any;

  constructor(private modalService: NgbModal) { }

  handleButtonClick() {
    const modalRef = this.modalService.open(NextAvailabilityModalComponent, {
      centered: true,
      size: 'fullscreen',
      scrollable: true
    });
    modalRef.componentInstance.train = this.train;
    modalRef.componentInstance.doj = this.doj;
  }
}
