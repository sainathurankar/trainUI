import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private http: HttpClient) { }

  getAPIStatus(): Observable<any> {

    if (environment.mock) {
      return this.http
        .get('assets/mockjson/status.json')
        .pipe(delay(2000));
    }

    return this.http.get(
      `${environment.apiUrl}/status`
    );
  }
}
