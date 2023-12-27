import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Helper } from 'src/app/common/helper';

@Component({
  selector: 'app-train-card',
  templateUrl: './train-card.component.html',
  styleUrls: ['./train-card.component.scss']
})
export class TrainCardComponent {

  helper = Helper;
  
  @Input() train: any;

  @Input() doj?: string;

  constructor() { }
}
