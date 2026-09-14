import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RisService } from 'src/app/services/ris/ris.service';
import { TrainScheduleResponse } from 'src/app/models/ris.models';
import {
  RecentEntry,
  RecentSearchesService,
} from 'src/app/services/recent-searches/recent-searches.service';
import { ShareService } from 'src/app/services/share/share.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ScheduleComponent implements OnInit {
  private ris = inject(RisService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recentSvc = inject(RecentSearchesService);
  private shareSvc = inject(ShareService);

  trainNo = '';
  loading = false;
  result?: TrainScheduleResponse;
  error?: string;
  submitted = false;
  editing = false;
  recent: RecentEntry[] = [];

  ngOnInit(): void {
    this.recent = this.recentSvc.get('schedule');
    const t = this.route.snapshot.queryParamMap.get('trainNo');
    if (t) {
      this.trainNo = t;
      this.search(false);
    }
  }

  get valid(): boolean {
    return /^\d{4,6}$/.test(this.trainNo.trim());
  }

  search(updateUrl = true): void {
    this.submitted = true;
    if (!this.valid) {
      return;
    }
    const trainNo = this.trainNo.trim();
    if (updateUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { trainNo },
        replaceUrl: true,
      });
    }
    this.loading = true;
    this.result = undefined;
    this.error = undefined;
    this.ris.getTrainSchedule(trainNo).subscribe({
      next: (res) => {
        if (res?.errormsg && !res.Schedule) {
          this.error = res.errormsg;
        } else {
          this.result = res;
          this.editing = false;
          this.recentSvc.add('schedule', {
            value: trainNo,
            label: res.TrainName,
            ts: Date.now(),
          });
          this.recent = this.recentSvc.get('schedule');
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

  pickRecent(e: RecentEntry): void {
    this.trainNo = e.value;
    this.search();
  }

  clearRecent(): void {
    this.recentSvc.clear('schedule');
    this.recent = [];
  }

  toggleEdit(): void {
    this.editing = true;
  }

  share(): void {
    void this.shareSvc.share('Train Schedule — RailGo');
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
