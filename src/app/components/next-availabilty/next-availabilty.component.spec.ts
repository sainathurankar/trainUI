import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { NextAvailabiltyComponent } from './next-availabilty.component';

describe('NextAvailabiltyComponent', () => {
  let component: NextAvailabiltyComponent;
  let fixture: ComponentFixture<NextAvailabiltyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NextAvailabiltyComponent],
      providers: [{ provide: NgbModal, useValue: { open: () => ({ componentInstance: {} }) } }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextAvailabiltyComponent);
    component = fixture.componentInstance;
    component.train = { trainNumber: '12630', availableClasses: ['SL'] };
    component.doj = '20260911';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
