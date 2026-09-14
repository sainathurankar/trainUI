import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RisService } from 'src/app/services/ris/ris.service';
import { CoachPositionResponse } from 'src/app/models/ris.models';
import {
  RecentEntry,
  RecentSearchesService,
} from 'src/app/services/recent-searches/recent-searches.service';
import { ShareService } from 'src/app/services/share/share.service';

@Component({
  selector: 'app-coach-position',
  templateUrl: './coach-position.component.html',
  styleUrls: ['./coach-position.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CoachPositionComponent implements OnInit {
  private ris = inject(RisService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recentSvc = inject(RecentSearchesService);
  private shareSvc = inject(ShareService);

  trainNo = '';
  stn = '';
  loading = false;
  result?: CoachPositionResponse;
  error?: string;
  submitted = false;
  editing = false;
  recent: RecentEntry[] = [];

  ngOnInit(): void {
    this.recent = this.recentSvc.get('coach');
    const q = this.route.snapshot.queryParamMap;
    const t = q.get('trainNo');
    const s = q.get('stn');
    if (t) {
      this.trainNo = t;
    }
    if (s) {
      this.stn = s.toUpperCase();
    }
    if (this.valid) {
      this.search(false);
    }
  }

  get valid(): boolean {
    return /^\d{4,6}$/.test(this.trainNo.trim()) && this.stn.trim().length >= 2;
  }

  search(updateUrl = true): void {
    this.submitted = true;
    if (!this.valid) {
      return;
    }
    const trainNo = this.trainNo.trim();
    const stn = this.stn.trim().toUpperCase();
    if (updateUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { trainNo, stn },
        replaceUrl: true,
      });
    }
    this.loading = true;
    this.result = undefined;
    this.error = undefined;
    this.ris.getCoachPosition(trainNo, stn).subscribe({
      next: (res) => {
        if (res?.errormsg && !res.coachPosition) {
          this.error = res.errormsg;
        } else {
          this.result = res;
          this.editing = false;
          this.recentSvc.add('coach', {
            value: trainNo,
            extra: stn,
            label: res.trainName,
            ts: Date.now(),
          });
          this.recent = this.recentSvc.get('coach');
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

  pickRecent(e: RecentEntry): void {
    this.trainNo = e.value;
    this.stn = e.extra ?? '';
    this.search();
  }

  clearRecent(): void {
    this.recentSvc.clear('coach');
    this.recent = [];
  }

  toggleEdit(): void {
    this.editing = true;
  }

  share(): void {
    void this.shareSvc.share('Coach Position — RailGo');
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
