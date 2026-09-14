import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NextAvailabilityModalComponent } from '../next-availability-modal/next-availability-modal.component';
import { Train } from 'src/app/models/train.models';

@Component({
    selector: 'app-next-availabilty',
    templateUrl: './next-availabilty.component.html',
    styleUrls: ['./next-availabilty.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NextAvailabiltyComponent {
  private modalService = inject(NgbModal);


  @Input() train!: Train;
  @Input() doj!: string;

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
