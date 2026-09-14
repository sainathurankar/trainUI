import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ResultComponent } from './result.component';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ResultComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [],
    providers: [
        {
            provide: ActivatedRoute,
            useValue: { queryParams: of({ src: 'TSR', dst: 'TDS', doj: '20260911' }) }
        },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read the search params from the route', () => {
    expect(component.src).toBe('TSR');
    expect(component.dst).toBe('TDS');
    expect(component.doj).toBe('20260911');
  });

  describe('filtering & sorting (displayTrains)', () => {
    const mkTrain = (over: any) => ({
      trainNumber: '00000',
      departureTime: '06:00',
      arrivalTime: '12:00',
      duration: '06:00',
      availableClasses: ['SL'],
      availabilitiesList: [{ status: 'AVBL', seats: '10', quota: 'GN', fare: '500' }],
      ...over,
    });

    beforeEach(() => {
      (component as any).searchResponse = {
        trains: [
          mkTrain({ trainNumber: 'A', departureTime: '22:00', arrivalTime: '06:00', duration: '08:00',
                    availableClasses: ['SL'],
                    availabilitiesList: [{ status: 'GNWL', seats: '0', quota: 'GN', fare: '300' }] }),
          mkTrain({ trainNumber: 'B', departureTime: '06:00', arrivalTime: '12:00', duration: '06:00',
                    availableClasses: ['SL', '3A'],
                    availabilitiesList: [{ status: 'AVBL', seats: '40', quota: 'GN', fare: '800' }] }),
          mkTrain({ trainNumber: 'C', departureTime: '14:00', arrivalTime: '18:00', duration: '04:00',
                    availableClasses: ['3A'],
                    availabilitiesList: [{ status: 'RAC', seats: '5', quota: 'TQ', fare: '450' }] }),
          // alternate train must be excluded from base list
          mkTrain({ trainNumber: 'ALT', isAlternate: true }),
        ],
      };
    });

    it('excludes alternate trains from the base list', () => {
      expect(component.totalCount).toBe(3);
      expect(component.displayTrains.map((t) => t.trainNumber)).not.toContain('ALT');
    });

    it('sorts by departure time by default', () => {
      component.sortKey = 'departure';
      expect(component.displayTrains.map((t) => t.trainNumber)).toEqual(['B', 'C', 'A']);
    });

    it('sorts by duration', () => {
      component.setSort('duration');
      expect(component.displayTrains.map((t) => t.trainNumber)).toEqual(['C', 'B', 'A']);
    });

    it('sorts by price (cheapest first)', () => {
      component.setSort('price');
      expect(component.displayTrains.map((t) => t.trainNumber)).toEqual(['A', 'C', 'B']);
    });

    it('filters by availability bucket', () => {
      component.setAvailFilter('available');
      expect(component.displayTrains.map((t) => t.trainNumber)).toEqual(['B']);
    });

    it('filters by class', () => {
      component.classFilter = '3A';
      expect(component.displayTrains.map((t) => t.trainNumber).sort()).toEqual(['B', 'C']);
    });

    it('filters by departure window', () => {
      component.setDepWindow('night');
      expect(component.displayTrains.map((t) => t.trainNumber)).toEqual(['A']);
    });

    it('filters by quota', () => {
      component.quotaFilter = 'TQ';
      expect(component.displayTrains.map((t) => t.trainNumber)).toEqual(['C']);
    });

    it('tracks active filters and clears them', () => {
      component.setAvailFilter('available');
      component.setSort('price');
      expect(component.hasActiveFilters).toBe(true);
      component.clearFilters();
      expect(component.hasActiveFilters).toBe(false);
      expect(component.filteredCount).toBe(3);
    });

    it('computes distinct class and quota options', () => {
      (component as any).computeClassOptions();
      expect(component.availableClassOptions).toEqual(['3A', 'SL']);
      expect(component.availableQuotaOptions).toEqual(['GN', 'TQ']);
    });
  });
});
