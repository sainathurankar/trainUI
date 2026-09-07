import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AutocompleteService } from './autocomplete.service';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('AutocompleteService', () => {
  let service: AutocompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(AutocompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
