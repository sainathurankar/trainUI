import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchInput } from 'src/app/services/search/search-input';
import { SearchService } from 'src/app/services/search/search.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ShareService } from 'src/app/services/share/share.service';
import { Helper } from 'src/app/common/helper';
import { Offer, SearchResponse, Train } from 'src/app/models/train.models';

type SortKey = 'departure' | 'arrival' | 'duration' | 'price' | 'availability';
type AvailFilter = 'all' | 'available' | 'rac' | 'waitlist';
type DepWindow = 'all' | 'early' | 'morning' | 'afternoon' | 'night';

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ResultComponent implements OnInit {
  private searchService = inject(SearchService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private modal = inject(NgbModal);
  private shareSvc = inject(ShareService);

  src = '';
  dst = '';
  doj = '';
  searchResponse?: SearchResponse;
  loading = true;
  error = false;
  modifySearch = false;

  // --- Filter & sort state ---
  showFilters = false;
  sortKey: SortKey = 'departure';
  availFilter: AvailFilter = 'all';
  classFilter = 'all';
  depWindow: DepWindow = 'all';
  quotaFilter = 'all';
  availableClassOptions: string[] = [];
  availableQuotaOptions: string[] = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.src = params.src;
      this.dst = params.dst;
      this.doj = params.doj;
      this.getSearchResults();
    });
  }

  getSearchResults() {
    this.loading = true;
    this.error = false;
    const searchInput: SearchInput = {
      src: this.src,
      dst: this.dst,
      doj: this.doj,
    };
    this.searchService.getSearchResults(searchInput, "false").subscribe({
      next: (data) => {
        this.searchResponse = data;
        this.computeClassOptions();
        this.loading = false;
        const n = this.baseTrains().length;
        if (n > 0) {
          this.toast.success(`Found ${n} train${n === 1 ? '' : 's'} for your route`);
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.error = true;
        this.toast.error('Could not fetch train results. Please try again.');
        this.cdr.markForCheck();
      }
    });
  }

  retry() {
    this.getSearchResults();
  }

  /** Share this results page (deep link carries src/dst/doj). */
  share(): void {
    void this.shareSvc.share(`Trains ${this.src} → ${this.dst} — RailGo`);
  }

  /** Real (non-alternate) trains from the raw response. */
  private baseTrains(): Train[] {
    return (this.searchResponse?.trains || []).filter((t) => !t?.isAlternate);
  }

  private computeClassOptions(): void {
    const set = new Set<string>();
    const quotaSet = new Set<string>();
    for (const t of this.baseTrains()) {
      for (const c of (t.availableClasses || [])) {
        set.add(c);
      }
      for (const a of (t.availabilitiesList || [])) {
        if (a.quota) quotaSet.add(a.quota);
      }
    }
    this.availableClassOptions = Array.from(set).sort();
    this.availableQuotaOptions = Array.from(quotaSet).sort();
  }

  /** Trains after filtering + sorting — bound by the template. */
  get displayTrains(): Train[] {
    let trains = this.baseTrains();

    // Class filter: keep trains that offer the chosen class
    if (this.classFilter !== 'all') {
      trains = trains.filter((t) => (t.availableClasses || []).includes(this.classFilter));
    }

    // Availability filter: keep trains with at least one class in the chosen bucket
    if (this.availFilter !== 'all') {
      trains = trains.filter((t) =>
        (t.availabilitiesList || []).some(
          (a) => Helper.availabilityRank(a.status || '') === this.availFilter
        )
      );
    }

    // Feature 3: departure time-of-day window filter
    if (this.depWindow !== 'all') {
      trains = trains.filter((t) => Helper.departureWindow(t.departureTime || '') === this.depWindow);
    }

    // Feature 4: quota filter — keep trains offering the chosen quota
    if (this.quotaFilter !== 'all') {
      trains = trains.filter((t) =>
        (t.availabilitiesList || []).some((a) => a.quota === this.quotaFilter)
      );
    }

    // Sorting (stable copy)
    const sorted = [...trains];
    switch (this.sortKey) {
      case 'departure':
        sorted.sort((a, b) => Helper.timeToMinutes(a.departureTime || '') - Helper.timeToMinutes(b.departureTime || ''));
        break;
      case 'arrival':
        sorted.sort((a, b) => Helper.timeToMinutes(a.arrivalTime || '') - Helper.timeToMinutes(b.arrivalTime || ''));
        break;
      case 'duration':
        sorted.sort((a, b) => Helper.durationToMinutes(a.duration || '') - Helper.durationToMinutes(b.duration || ''));
        break;
      case 'price':
        sorted.sort((a, b) => Helper.minFare(a.availabilitiesList || []) - Helper.minFare(b.availabilitiesList || []));
        break;
      case 'availability':
        sorted.sort((a, b) => Helper.bestAvailabilityScore(b.availabilitiesList || []) - Helper.bestAvailabilityScore(a.availabilitiesList || []));
        break;
    }
    return sorted;
  }

  get totalCount(): number {
    return this.baseTrains().length;
  }

  /** Feature 5: the redBus-recommended train (if any). */
  get recommendation(): Train | null {
    return this.searchResponse?.recommendation || null;
  }

  get recommendationTags(): string[] {
    return this.searchResponse?.recommendationTags || [];
  }

  /** Feature 8: promotional offers strip. */
  get offers(): Offer[] {
    return this.searchResponse?.offers || [];
  }

  get filteredCount(): number {
    return this.displayTrains.length;
  }

  get hasActiveFilters(): boolean {
    return this.availFilter !== 'all' || this.classFilter !== 'all' || this.sortKey !== 'departure'
      || this.depWindow !== 'all' || this.quotaFilter !== 'all';
  }

  /** Count of non-default filters, for the icon badge. */
  get activeFilterCount(): number {
    let n = 0;
    if (this.availFilter !== 'all') n++;
    if (this.classFilter !== 'all') n++;
    if (this.sortKey !== 'departure') n++;
    if (this.depWindow !== 'all') n++;
    if (this.quotaFilter !== 'all') n++;
    return n;
  }

  setSort(key: SortKey): void {
    this.sortKey = key;
  }

  setAvailFilter(f: AvailFilter): void {
    this.availFilter = f;
  }

  setDepWindow(w: DepWindow): void {
    this.depWindow = w;
  }

  clearFilters(): void {
    this.sortKey = 'departure';
    this.availFilter = 'all';
    this.classFilter = 'all';
    this.depWindow = 'all';
    this.quotaFilter = 'all';
  }

  /** Open the filters & sort modal. */
  openFilters(content: TemplateRef<unknown>): void {
    this.modal.open(content, { centered: true, scrollable: true, size: 'lg' });
  }

  /** Open the modify-search modal; close it once a new search navigates away. */
  openModify(content: TemplateRef<unknown>): void {
    this.modal.open(content, { centered: true, scrollable: false, size: 'lg', windowClass: 'tu-modal-overflow' });
  }
}
