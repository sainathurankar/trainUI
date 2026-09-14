import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RisService } from 'src/app/services/ris/ris.service';
import { CoachPositionResponse } from 'src/app/models/ris.models';

@Component({
  selector: 'app-coach-position',
  templateUrl: './coach-position.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CoachPositionComponent {
  private ris = inject(RisService);
  private cdr = inject(ChangeDetectorRef);

  trainNo = '';
  stn = '';
  loading = false;
  result?: CoachPositionResponse;
  error?: string;
  submitted = false;

  get valid(): boolean {
    return /^\d{4,6}$/.test(this.trainNo.trim()) && this.stn.trim().length >= 2;
  }

  search(): void {
    this.submitted = true;
    if (!this.valid) {
      return;
    }
    this.loading = true;
    this.result = undefined;
    this.error = undefined;
    this.ris.getCoachPosition(this.trainNo.trim(), this.stn.trim().toUpperCase()).subscribe({
      next: (res) => {
        if (res?.errormsg && !res.coachPosition) {
          this.error = res.errormsg;
        } else {
          this.result = res;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Could not fetch coach position. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  coachLabel(code: string): string {
    const map: Record<string, string> = {
      L: 'Loco',
      LPR: 'Guard',
      PC: 'Pantry',
      EOG: 'Power',
      VP: 'Parcel',
    };
    return map[code] || code;
  }
}
