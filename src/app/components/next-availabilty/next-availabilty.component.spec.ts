import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextAvailabiltyComponent } from './next-availabilty.component';

describe('NextAvailabiltyComponent', () => {
  let component: NextAvailabiltyComponent;
  let fixture: ComponentFixture<NextAvailabiltyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextAvailabiltyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextAvailabiltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
