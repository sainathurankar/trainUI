import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NextAvailabilityModalComponent } from '../next-availability-modal/next-availability-modal.component';

@Component({
    selector: 'app-next-availabilty',
    templateUrl: './next-availabilty.component.html',
    styleUrls: ['./next-availabilty.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NextAvailabiltyComponent {
  private modalService = inject(NgbModal);


  @Input() train: any;
  @Input() doj: any;

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
