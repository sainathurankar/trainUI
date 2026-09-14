import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RisService } from 'src/app/services/ris/ris.service';
import { LiveStatusResponse, LiveStation } from 'src/app/models/ris.models';
import {
  RecentEntry,
  RecentSearchesService,
} from 'src/app/services/recent-searches/recent-searches.service';
import { ShareService } from 'src/app/services/share/share.service';

@Component({
  selector: 'app-live-status',
  templateUrl: './live-status.component.html',
  styleUrls: ['./live-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LiveStatusComponent implements OnInit {
  private ris = inject(RisService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recentSvc = inject(RecentSearchesService);
  private shareSvc = inject(ShareService);

  trainNo = '';
  loading = false;
  result?: LiveStatusResponse;
  error?: string;
  submitted = false;
  editing = false;
  recent: RecentEntry[] = [];

  ngOnInit(): void {
    this.recent = this.recentSvc.get('live');
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
    this.ris.getLiveStatus(trainNo).subscribe({
      next: (res) => {
        if (res?.errormsg && !res.stations) {
          this.error = res.errormsg;
        } else {
          this.result = res;
          this.editing = false;
          this.recentSvc.add('live', {
            value: trainNo,
            label: res.trainName,
            ts: Date.now(),
          });
          this.recent = this.recentSvc.get('live');
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

  pickRecent(e: RecentEntry): void {
    this.trainNo = e.value;
    this.search();
  }

  clearRecent(): void {
    this.recentSvc.clear('live');
    this.recent = [];
  }

  toggleEdit(): void {
    this.editing = true;
  }

  share(): void {
    void this.shareSvc.share('Live Train Status — RailGo');
  }

  get delayed(): boolean {
    return (this.result?.totalLateMins ?? 0) > 0;
  }

  /**
   * Journey state for a station's dot:
   *  - 'done'    train has already departed this stop
   *  - 'current' train is standing at / just approaching this stop
   *  - 'upcoming' not yet reached
   */
  stationState(s: LiveStation): string {
    if (s.hasDeparted) {
      return 'done';
    }
    if (s.hasArrived) {
      return 'current';
    }
    // Not arrived yet: the immediate next stop is the live position when the
    // train is running between stations.
    const code = this.result?.upcomingStationCode || this.result?.currentlyAtCode;
    if (code && s.stationCode === code) {
      return 'current';
    }
    return 'upcoming';
  }

  /** True when this station is the train's live position (drives the moving icon). */
  isHere(s: LiveStation): boolean {
    return this.stationState(s) === 'current';
  }

  /** '20260914' -> '14 Sep 2026'; passes through anything else. */
  fmtDate(d?: string): string {
    if (!d || !/^\d{8}$/.test(d)) {
      return d || '—';
    }
    const y = d.slice(0, 4);
    const m = +d.slice(4, 6);
    const day = d.slice(6, 8);
    const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${mon[m - 1] ?? m} ${y}`;
  }

  /** 'PLATFORM 6' -> '6'; leaves anything else untouched. */
  pf(p?: string): string {
    if (!p) {
      return '';
    }
    return p.replace(/^platform\s*/i, '').trim();
  }
}
