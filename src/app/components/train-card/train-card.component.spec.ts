import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TrainCardComponent } from './train-card.component';

describe('TrainCardComponent', () => {
  let component: TrainCardComponent;
  let fixture: ComponentFixture<TrainCardComponent>;

  const mockTrain = {
    trainNumber: '12630',
    trainName: 'TEST EXPRESS',
    availableClasses: ['SL', '3A'],
    runningDays: 'YYYYYYY',
    srcName: 'Test Source',
    srcCode: 'TSR',
    destName: 'Test Dest',
    destCode: 'TDS',
    departureTime: '10:00',
    arrivalTime: '18:00',
    duration: '08:00',
    avlDayList: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainCardComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainCardComponent);
    component = fixture.componentInstance;
    component.train = mockTrain;
    component.doj = '20260911';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
