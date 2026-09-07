import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchInput } from 'src/app/services/search/search-input';
import { SearchService } from 'src/app/services/search/search.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Helper } from 'src/app/common/helper';

type SortKey = 'departure' | 'arrival' | 'duration' | 'price' | 'availability';
type AvailFilter = 'all' | 'available' | 'rac' | 'waitlist';

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ResultComponent implements OnInit {
  private searchService = inject(SearchService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  src = '';
  dst = '';
  doj = '';
  searchResponse: any;
  loading = true;
  error = false;
  modifySearch = false;

  // --- Filter & sort state ---
  showFilters = false;
  sortKey: SortKey = 'departure';
  availFilter: AvailFilter = 'all';
  classFilter = 'all';
  availableClassOptions: string[] = [];

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
      },
      error: () => {
        this.loading = false;
        this.error = true;
        this.toast.error('Could not fetch train results. Please try again.');
      }
    });
  }

  retry() {
    this.getSearchResults();
  }

  /** Real (non-alternate) trains from the raw response. */
  private baseTrains(): any[] {
    return (this.searchResponse?.trains || []).filter((t: any) => !t?.isAlternate);
  }

  private computeClassOptions(): void {
    const set = new Set<string>();
    for (const t of this.baseTrains()) {
      for (const c of (t.availableClasses || [])) {
        set.add(c);
      }
    }
    this.availableClassOptions = Array.from(set).sort();
  }

  /** Trains after filtering + sorting — bound by the template. */
  get displayTrains(): any[] {
    let trains = this.baseTrains();

    // Class filter: keep trains that offer the chosen class
    if (this.classFilter !== 'all') {
      trains = trains.filter((t) => (t.availableClasses || []).includes(this.classFilter));
    }

    // Availability filter: keep trains with at least one class in the chosen bucket
    if (this.availFilter !== 'all') {
      trains = trains.filter((t) =>
        (t.availabilitiesList || []).some(
          (a: any) => Helper.availabilityRank(a.status) === this.availFilter
        )
      );
    }

    // Sorting (stable copy)
    const sorted = [...trains];
    switch (this.sortKey) {
      case 'departure':
        sorted.sort((a, b) => Helper.timeToMinutes(a.departureTime) - Helper.timeToMinutes(b.departureTime));
        break;
      case 'arrival':
        sorted.sort((a, b) => Helper.timeToMinutes(a.arrivalTime) - Helper.timeToMinutes(b.arrivalTime));
        break;
      case 'duration':
        sorted.sort((a, b) => Helper.durationToMinutes(a.duration) - Helper.durationToMinutes(b.duration));
        break;
      case 'price':
        sorted.sort((a, b) => Helper.minFare(a.availabilitiesList) - Helper.minFare(b.availabilitiesList));
        break;
      case 'availability':
        sorted.sort((a, b) => Helper.bestAvailabilityScore(b.availabilitiesList) - Helper.bestAvailabilityScore(a.availabilitiesList));
        break;
    }
    return sorted;
  }

  get totalCount(): number {
    return this.baseTrains().length;
  }

  get filteredCount(): number {
    return this.displayTrains.length;
  }

  get hasActiveFilters(): boolean {
    return this.availFilter !== 'all' || this.classFilter !== 'all' || this.sortKey !== 'departure';
  }

  setSort(key: SortKey): void {
    this.sortKey = key;
  }

  setAvailFilter(f: AvailFilter): void {
    this.availFilter = f;
  }

  clearFilters(): void {
    this.sortKey = 'departure';
    this.availFilter = 'all';
    this.classFilter = 'all';
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}
