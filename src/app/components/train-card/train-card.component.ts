import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Helper } from 'src/app/common/helper';
import { Train } from 'src/app/models/train.models';

@Component({
    selector: 'app-train-card',
    templateUrl: './train-card.component.html',
    styleUrls: ['./train-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TrainCardComponent {
  helper = Helper;

  @Input() train!: Train;

  @Input() doj?: string;

  @Input() showNextAvail = true;
}
