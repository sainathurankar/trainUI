import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {

  constructor(private http: HttpClient) { }

  getSuggestions(query: string): Observable<any> {
    return this.http.get('http://localhost:8080/api/autocomplete?query=' + query);
  }
}
