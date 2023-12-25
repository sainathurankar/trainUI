import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchInput, TrainUpdateInput } from './search-input';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  getSearchResults(searchInput: SearchInput, update: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post('http://localhost:8080/api/search' + '?update='+ update, searchInput, {
      headers,
    });
  }

  getTrainUpdate(trainUpdateInput: TrainUpdateInput): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post('http://localhost:8080/api/search/trainUpdate', trainUpdateInput, {
      headers,
    });
  }
}
