import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AvailabilityCardComponent } from './availability-card.component';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('AvailabilityCardComponent', () => {
  let component: AvailabilityCardComponent;
  let fixture: ComponentFixture<AvailabilityCardComponent>;

  const mockAvail = {
    className: 'SL',
    quota: 'GN',
    status: 'AVBL',
    availablityStatus: '172',
    availablityType: 'AVBL',
    totalFare: 395,
    lastUpdatedOnRaw: new Date().getTime()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AvailabilityCardComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [],
    providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityCardComponent);
    component = fixture.componentInstance;
    component.avail = mockAvail;
    component.train = { trainNumber: '12630', fromStationCode: 'TSR', toStationCode: 'TDS' };
    component.doj = '20260911';
    component.updateStatus = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map availability status to the correct card border class', () => {
    expect(component.getQuotaCardClass('AVBL')['border-success']).toBeTrue();
    expect(component.getQuotaCardClass('GNWL10')['border-warning']).toBeTrue();
    expect(component.getQuotaCardClass('REGRET')['border-danger']).toBeTrue();
  });
});
