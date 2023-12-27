import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextAvailabilityModalComponent } from './next-availability-modal.component';

describe('NextAvailabilityModalComponent', () => {
  let component: NextAvailabilityModalComponent;
  let fixture: ComponentFixture<NextAvailabilityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextAvailabilityModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextAvailabilityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
