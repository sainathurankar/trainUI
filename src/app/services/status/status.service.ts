import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { delay } from 'rxjs/operators';
import { ApiStatus } from 'src/app/models/train.models';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private http = inject(HttpClient);


  getAPIStatus(): Observable<ApiStatus> {

    if (environment.mock) {
      return this.http
        .get<ApiStatus>('assets/mockjson/status.json')
        .pipe(delay(2000));
    }

    return this.http.get<ApiStatus>(
      `${environment.apiUrl}/status`
    );
  }
}
