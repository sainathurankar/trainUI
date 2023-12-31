import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchInput, TrainUpdateInput } from './search-input';
import { environment } from 'src/environments/environment';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  getSearchResults(searchInput: SearchInput, update: string): Observable<any> {
    if (environment.mock) {
      return this.http
        .get('assets/mockjson/search-response.json')
        .pipe(delay(1000));
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(
      `${environment.apiUrl}/search?update=${update}`,
      searchInput,
      {
        headers,
      }
    );
  }

  getTrainUpdate(trainUpdateInput: TrainUpdateInput): Observable<any> {
    if (environment.mock) {
      return this.http
        .get('assets/mockjson/train-update.json')
        .pipe(delay(2000));
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(
      `${environment.apiUrl}/search/trainUpdate`,
      trainUpdateInput,
      {
        headers,
      }
    );
  }

  getNextAvailability(trainUpdateInput: TrainUpdateInput): Observable<any> {
    if (environment.mock) {
      return this.http
        .get('assets/mockjson/next-availability.json')
        .pipe(delay(2000));
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(
      `${environment.apiUrl}/v5/search/availabilityNearBy`,
      trainUpdateInput,
      {
        headers,
      }
    );
  }
}
