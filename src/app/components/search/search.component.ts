import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';
import { AutocompleteService } from 'src/app/services/autocomplete.service';
import { AutocompleteResponse, Station } from 'src/app/models/train.models';

type FieldKey = 'from' | 'to';

interface StoredSearch {
  frominputObject: Station;
  toinputObject: Station;
  dateOfTravel: string;
}

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SearchComponent implements OnInit, OnDestroy {
  private autocompleteService = inject(AutocompleteService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);


  frominputValue = '';
  toinputValue = '';
  dateOfTravel = '';
  frominputObject?: Station;
  toinputObject?: Station;

  fromsuggestions: Station[] = [];
  tosuggestions: Station[] = [];
  fromLoading = false;
  toLoading = false;
  minDate?: string;

  // Set to true after the user presses Search with an invalid form,
  // so we can surface inline "please pick a station from the list" hints.
  submitted = false;

  // Debounced query streams per field: typing pushes the raw query here, and a
  // single switchMap'd HTTP call resolves (so keystrokes don't each fire a
  // request and stale responses can't overwrite fresher ones).
  private fromQuery$ = new Subject<string>();
  private toQuery$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  objectSaved?: StoredSearch;
  key = 'USER_SEARCH';

  constructor() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    this.dateOfTravel = `${year}-${month}-${day}`;
    this.minDate = this.dateOfTravel;
  }

  ngOnInit(): void {
    this.wireQueryStream(this.fromQuery$, 'from');
    this.wireQueryStream(this.toQuery$, 'to');

    this.objectSaved = this.getStoredObject();
    if (this.objectSaved?.frominputObject && this.objectSaved?.toinputObject) {
      this.frominputValue = this.objectSaved.frominputObject.stationName;
      this.toinputValue = this.objectSaved.toinputObject.stationName;
      this.frominputObject = this.objectSaved.frominputObject;
      this.toinputObject = this.objectSaved.toinputObject;
      this.dateOfTravel = this.minDate && this.objectSaved.dateOfTravel < this.minDate
        ? this.minDate
        : this.objectSaved.dateOfTravel;
    }
  }

  /** Subscribe a debounced query stream and push results into the right field. */
  private wireQueryStream(source$: Subject<string>, key: FieldKey): void {
    source$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        filter((q) => q.length > 1),
        switchMap((q) => this.autocompleteService.getSuggestions(q)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data: AutocompleteResponse) => {
          const results = data?.results ?? [];
          if (key === 'from') {
            this.fromsuggestions = results;
            this.fromLoading = false;
          } else {
            this.tosuggestions = results;
            this.toLoading = false;
          }
          this.cdr.markForCheck();
        },
        error: () => {
          if (key === 'from') {
            this.fromLoading = false;
          } else {
            this.toLoading = false;
          }
          this.cdr.markForCheck();
        }
      });
  }

  onInput(key: FieldKey): void {
    // Typing invalidates any previously picked station for that field:
    // the code is only trustworthy when it came from a chosen suggestion.
    if (key === 'from') {
      this.frominputObject = undefined;
    } else {
      this.toinputObject = undefined;
    }
    const input = (key === 'from' ? this.frominputValue : this.toinputValue).trim();
    if (input.length > 1) {
      if (key === 'from') {
        this.fromLoading = true;
      } else {
        this.toLoading = true;
      }
      (key === 'from' ? this.fromQuery$ : this.toQuery$).next(input);
    } else {
      this.fromsuggestions = [];
      this.tosuggestions = [];
      this.fromLoading = false;
      this.toLoading = false;
    }
  }

  onSelectSuggestion(suggestion: Station, key: FieldKey): void {
    if (key === 'from') {
      this.frominputValue = suggestion.stationName;
      this.frominputObject = suggestion;
    } else {
      this.toinputValue = suggestion.stationName;
      this.toinputObject = suggestion;
    }
    this.fromsuggestions = [];  // Clear suggestions
    this.tosuggestions = [];
    this.fromLoading = false;
    this.toLoading = false;
  }

  /** A station field is valid only when a suggestion object with a code was picked. */
  get fromValid(): boolean {
    return !!this.frominputObject?.stationCode;
  }

  get toValid(): boolean {
    return !!this.toinputObject?.stationCode;
  }

  /** Source and destination must be different stations. */
  get sameStation(): boolean {
    return this.fromValid && this.toValid &&
      this.frominputObject!.stationCode === this.toinputObject!.stationCode;
  }

  get isValid(): boolean {
    return this.fromValid && this.toValid && !this.sameStation && this.dateOfTravel !== '';
  }

  onClickSearch() {
    this.submitted = true;
    if (!this.isValid) {
      return;
    }
    this.storeObjectInLocalStorage();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate(['results'], {queryParams: {
      src: this.frominputObject!.stationCode,
      dst: this.toinputObject!.stationCode,
      doj: this.getFormattedDate(this.dateOfTravel)
    }});
  }

  getFormattedDate(date: string) {
    return date.split('-').join('');
  }

  storeObjectInLocalStorage() {
    if (!this.frominputObject || !this.toinputObject) {
      return;
    }
    this.objectSaved = {
      frominputObject: this.frominputObject,
      toinputObject: this.toinputObject,
      dateOfTravel: this.dateOfTravel,
    };
    try {
      localStorage.setItem(this.key, JSON.stringify(this.objectSaved));
    } catch {
      /* storage unavailable (private mode / quota) — non-fatal */
    }
  }

  getStoredObject(): StoredSearch | undefined {
    try {
      const objectString = localStorage.getItem(this.key);
      if (!objectString) {
        return undefined;
      }
      const parsed = JSON.parse(objectString) as StoredSearch;
      // Only trust a well-formed entry — an old/corrupt shape must not crash init.
      if (parsed?.frominputObject?.stationCode && parsed?.toinputObject?.stationCode) {
        return parsed;
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  switchStations() {
    [this.frominputValue, this.toinputValue] = [this.toinputValue, this.frominputValue];
    [this.frominputObject, this.toinputObject] = [this.toinputObject, this.frominputObject];
  }

  /** Local YYYY-MM-DD for a date N days from today. */
  private dateNDaysOut(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() + n);
    const y = d.getFullYear();
    const m = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${y}-${m}-${day}`;
  }

  get isToday(): boolean {
    return this.dateOfTravel === this.dateNDaysOut(0);
  }

  get isTomorrow(): boolean {
    return this.dateOfTravel === this.dateNDaysOut(1);
  }

  setToday(): void {
    this.dateOfTravel = this.dateNDaysOut(0);
    this.onClickSearch();
  }

  setTomorrow(): void {
    this.dateOfTravel = this.dateNDaysOut(1);
    this.onClickSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
