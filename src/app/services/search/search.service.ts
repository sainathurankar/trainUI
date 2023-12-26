import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchInput, TrainUpdateInput } from './search-input';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  getSearchResults(searchInput: SearchInput, update: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`${environment.apiUrl}/search?update=${update}`, searchInput, {
      headers,
    });
  }

  getTrainUpdate(trainUpdateInput: TrainUpdateInput): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`${environment.apiUrl}/search/trainUpdate`, trainUpdateInput, {
      headers,
    });
  }
}
