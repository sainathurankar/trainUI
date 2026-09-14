import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RisService } from 'src/app/services/ris/ris.service';
import { PnrStatusResponse } from 'src/app/models/ris.models';
import {
  RecentEntry,
  RecentSearchesService,
} from 'src/app/services/recent-searches/recent-searches.service';
import { ShareService } from 'src/app/services/share/share.service';

@Component({
  selector: 'app-pnr-status',
  templateUrl: './pnr-status.component.html',
  styleUrls: ['./pnr-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PnrStatusComponent implements OnInit {
  private ris = inject(RisService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recentSvc = inject(RecentSearchesService);
  private shareSvc = inject(ShareService);

  pnr = '';
  loading = false;
  result?: PnrStatusResponse;
  error?: string;
  submitted = false;
  editing = false;
  recent: RecentEntry[] = [];

  ngOnInit(): void {
    this.recent = this.recentSvc.get('pnr');
    const p = this.route.snapshot.queryParamMap.get('pnr');
    if (p) {
      this.pnr = p;
      this.search(false);
    }
  }

  get valid(): boolean {
    return /^\d{10}$/.test(this.pnr.trim());
  }

  search(updateUrl = true): void {
    this.submitted = true;
    if (!this.valid) {
      return;
    }
    const pnr = this.pnr.trim();
    if (updateUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { pnr },
        replaceUrl: true,
      });
    }
    this.loading = true;
    this.result = undefined;
    this.error = undefined;
    this.ris.getPnrStatus(pnr).subscribe({
      next: (res) => {
        if (res?.errormsg) {
          this.error = res.detailedmsg || res.errormsg;
        } else {
          this.result = res;
          this.editing = false;
          this.recentSvc.add('pnr', {
            value: pnr,
            label: res.trainName || res.trainNumber,
            ts: Date.now(),
          });
          this.recent = this.recentSvc.get('pnr');
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Could not fetch PNR status. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  pickRecent(e: RecentEntry): void {
    this.pnr = e.value;
    this.search();
  }

  clearRecent(): void {
    this.recentSvc.clear('pnr');
    this.recent = [];
  }

  toggleEdit(): void {
    this.editing = true;
  }

  share(): void {
    void this.shareSvc.share('PNR Status — RailGo');
  }

  isConfirmed(status?: string): boolean {
    return !!status && status.toUpperCase().startsWith('CNF');
  }

  /** '20260925' -> '25 Sep 2026'; passes through anything else. */
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
}
