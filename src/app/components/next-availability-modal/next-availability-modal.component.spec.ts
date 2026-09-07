import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { NextAvailabilityModalComponent } from './next-availability-modal.component';

describe('NextAvailabilityModalComponent', () => {
  let component: NextAvailabilityModalComponent;
  let fixture: ComponentFixture<NextAvailabilityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NextAvailabilityModalComponent],
      imports: [HttpClientTestingModule],
      providers: [NgbActiveModal],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextAvailabilityModalComponent);
    component = fixture.componentInstance;
    component.train = {
      trainNumber: '12630',
      fromStationCode: 'TSR',
      toStationCode: 'TDS',
      availableClasses: ['SL', '3A']
    };
    component.doj = '20260911';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
