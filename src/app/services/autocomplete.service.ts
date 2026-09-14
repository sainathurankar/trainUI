import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AutocompleteResponse } from 'src/app/models/train.models';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  private http = inject(HttpClient);


  getSuggestions(query: string): Observable<AutocompleteResponse> {
    if (environment.mock) {
      return this.http.get<AutocompleteResponse>('assets/mockjson/auto-complete.json');
    }
    return this.http.get<AutocompleteResponse>(
      `${environment.apiUrl}/autocomplete?query=${encodeURIComponent(query)}`
    );
  }
}
