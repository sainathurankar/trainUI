import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SearchComponent } from './search.component';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SearchComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [RouterTestingModule, FormsModule],
    providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should swap source and destination values', () => {
    component.frominputValue = 'A';
    component.toinputValue = 'B';
    component.frominputObject = { stationCode: 'A' };
    component.toinputObject = { stationCode: 'B' };
    component.switchStations();
    expect(component.frominputValue).toBe('B');
    expect(component.toinputValue).toBe('A');
    expect(component.frominputObject.stationCode).toBe('B');
    expect(component.toinputObject.stationCode).toBe('A');
  });
});
