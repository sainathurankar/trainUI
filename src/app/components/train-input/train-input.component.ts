import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';
import { RisService } from 'src/app/services/ris/ris.service';
import { TrainSuggestion } from 'src/app/models/ris.models';

/**
 * Reusable train-number autocomplete field. Debounced suggestions by number
 * or name; picking one (or Enter) emits `search`. Two-way bindable via `value`.
 */
@Component({
  selector: 'app-train-input',
  templateUrl: './train-input.component.html',
  styleUrls: ['./train-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TrainInputComponent implements OnInit, OnDestroy {
  private ris = inject(RisService);
  private cdr = inject(ChangeDetectorRef);

  @Input() value = '';
  @Input() inputId = 'trainInput';
  @Input() placeholder = 'e.g. 12951';
  @Output() valueChange = new EventEmitter<string>();
  /** Fired when the user commits a train (Enter or picking a suggestion). */
  @Output() committed = new EventEmitter<void>();

  suggestions: TrainSuggestion[] = [];
  loading = false;
  open = false;

  private query$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.query$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        filter((q) => q.length > 0),
        switchMap((q) => this.ris.searchTrains(q)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this.suggestions = res?.results ?? [];
          this.loading = false;
          this.open = true;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInput(): void {
    const q = this.value.trim();
    this.valueChange.emit(this.value);
    if (q.length > 0) {
      this.loading = true;
      this.open = true;
      this.query$.next(q);
    } else {
      this.suggestions = [];
      this.loading = false;
      this.open = false;
    }
  }

  pick(s: TrainSuggestion): void {
    this.value = s.trainNumber;
    this.valueChange.emit(this.value);
    this.suggestions = [];
    this.open = false;
    this.committed.emit();
  }

  onEnter(): void {
    this.open = false;
    this.committed.emit();
  }

  close(): void {
    // Delay so a suggestion click registers before blur hides the list.
    setTimeout(() => {
      this.open = false;
      this.cdr.markForCheck();
    }, 150);
  }
}
