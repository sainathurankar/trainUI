import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  CoachPositionResponse,
  LiveStatusResponse,
  PnrStatusResponse,
  TrainScheduleResponse,
} from 'src/app/models/ris.models';

/**
 * Rail information services: PNR status, live running status, train schedule
 * and coach position. Talks to the backend /ris/* endpoints (which proxy the
 * redBus RIS host). Honours environment.mock like SearchService.
 */
@Injectable({
  providedIn: 'root',
})
export class RisService {
  private http = inject(HttpClient);

  getPnrStatus(pnr: string, mobile?: string): Observable<PnrStatusResponse> {
    if (environment.mock) {
      return this.http
        .get<PnrStatusResponse>('assets/mockjson/ris-pnr.json')
        .pipe(delay(800));
    }
    const query = mobile ? `?mobile=${encodeURIComponent(mobile)}` : '';
    return this.http.get<PnrStatusResponse>(
      `${environment.apiUrl}/ris/pnr/${encodeURIComponent(pnr)}${query}`
    );
  }

  getTrainSchedule(trainNo: string): Observable<TrainScheduleResponse> {
    if (environment.mock) {
      return this.http
        .get<TrainScheduleResponse>('assets/mockjson/ris-schedule.json')
        .pipe(delay(800));
    }
    return this.http.get<TrainScheduleResponse>(
      `${environment.apiUrl}/ris/schedule/${encodeURIComponent(trainNo)}`
    );
  }

  getLiveStatus(trainNo: string): Observable<LiveStatusResponse> {
    if (environment.mock) {
      return this.http
        .get<LiveStatusResponse>('assets/mockjson/ris-live.json')
        .pipe(delay(800));
    }
    return this.http.get<LiveStatusResponse>(
      `${environment.apiUrl}/ris/live/${encodeURIComponent(trainNo)}`
    );
  }

  getCoachPosition(trainNo: string, stn: string): Observable<CoachPositionResponse> {
    if (environment.mock) {
      return this.http
        .get<CoachPositionResponse>('assets/mockjson/ris-coach.json')
        .pipe(delay(800));
    }
    return this.http.get<CoachPositionResponse>(
      `${environment.apiUrl}/ris/coach/${encodeURIComponent(trainNo)}?stn=${encodeURIComponent(stn)}`
    );
  }
}
