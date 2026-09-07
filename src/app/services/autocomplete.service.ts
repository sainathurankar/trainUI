import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  private http = inject(HttpClient);


  getSuggestions(query: string): Observable<any> {
    if (environment.mock) {
      return this.http.get('assets/mockjson/auto-complete.json');
    }
    return this.http.get(`${environment.apiUrl}/autocomplete?query=${query}`);
  }
}
