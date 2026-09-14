import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RisService } from 'src/app/services/ris/ris.service';
import { LiveStatusResponse } from 'src/app/models/ris.models';

@Component({
  selector: 'app-live-status',
  templateUrl: './live-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LiveStatusComponent {
  private ris = inject(RisService);
  private cdr = inject(ChangeDetectorRef);

  trainNo = '';
  loading = false;
  result?: LiveStatusResponse;
  error?: string;
  submitted = false;

  get valid(): boolean {
    return /^\d{4,6}$/.test(this.trainNo.trim());
  }

  search(): void {
    this.submitted = true;
    if (!this.valid) {
      return;
    }
    this.loading = true;
    this.result = undefined;
    this.error = undefined;
    this.ris.getLiveStatus(this.trainNo.trim()).subscribe({
      next: (res) => {
        if (res?.errormsg && !res.stations) {
          this.error = res.errormsg;
        } else {
          this.result = res;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Could not fetch live status. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  get delayed(): boolean {
    return (this.result?.totalLateMins ?? 0) > 0;
  }

  stationState(s: { isItQueriedStation?: boolean; departureTime?: string }): string {
    if (s.isItQueriedStation) {
      return 'current';
    }
    return 'done';
  }
}
