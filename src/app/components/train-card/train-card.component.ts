import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-train-card',
  templateUrl: './train-card.component.html',
  styleUrls: ['./train-card.component.scss']
})
export class TrainCardComponent {

  @Input() train: any;

  @Input() doj?: string;

  constructor() { }
}
