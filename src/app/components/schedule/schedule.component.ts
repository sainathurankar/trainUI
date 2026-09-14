import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RisService } from 'src/app/services/ris/ris.service';
import { TrainScheduleResponse } from 'src/app/models/ris.models';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ScheduleComponent {
  private ris = inject(RisService);
  private cdr = inject(ChangeDetectorRef);

  trainNo = '';
  loading = false;
  result?: TrainScheduleResponse;
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
    this.ris.getTrainSchedule(this.trainNo.trim()).subscribe({
      next: (res) => {
        if (res?.errormsg && !res.Schedule) {
          this.error = res.errormsg;
        } else {
          this.result = res;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Could not fetch the schedule. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  get runDays(): string[] {
    const d = this.result?.DaysOfRun;
    if (!d) {
      return [];
    }
    return Object.keys(d).filter((k) => d[k]);
  }

  formatDuration(mins?: number): string {
    if (!mins) {
      return '—';
    }
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  }
}
