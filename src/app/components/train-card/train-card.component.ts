import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Helper } from 'src/app/common/helper';

@Component({
    selector: 'app-train-card',
    templateUrl: './train-card.component.html',
    styleUrls: ['./train-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TrainCardComponent {
  helper = Helper;

  @Input() train: any;

  @Input() doj?: string;

  @Input() showNextAvail = true;
}
