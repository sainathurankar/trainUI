import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchInput, TrainUpdateInput } from './search-input';
import { environment } from 'src/environments/environment';
import { delay } from 'rxjs/operators';
import { Availability, SearchResponse } from 'src/app/models/train.models';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private http = inject(HttpClient);

  private jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  getSearchResults(searchInput: SearchInput, update: string): Observable<SearchResponse> {
    if (environment.mock) {
      return this.http
        .get<SearchResponse>('assets/mockjson/search-response.json')
        .pipe(delay(1000));
    }
    return this.http.post<SearchResponse>(
      `${environment.apiUrl}/search?update=${update}`,
      searchInput,
      { headers: this.jsonHeaders }
    );
  }

  getTrainUpdate(trainUpdateInput: TrainUpdateInput): Observable<Availability> {
    if (environment.mock) {
      return this.http
        .get<Availability>('assets/mockjson/train-update.json')
        .pipe(delay(2000));
    }
    return this.http.post<Availability>(
      `${environment.apiUrl}/search/trainUpdate`,
      trainUpdateInput,
      { headers: this.jsonHeaders }
    );
  }

  getNextAvailability(trainUpdateInput: TrainUpdateInput): Observable<Availability[]> {
    if (environment.mock) {
      return this.http
        .get<Availability[]>('assets/mockjson/next-availability.json')
        .pipe(delay(2000));
    }
    return this.http.post<Availability[]>(
      `${environment.apiUrl}/v5/search/availabilityNearBy`,
      trainUpdateInput,
      { headers: this.jsonHeaders }
    );
  }
}
