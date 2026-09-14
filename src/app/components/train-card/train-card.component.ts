import {
  Component, Input, ChangeDetectionStrategy, ViewChild, ElementRef,
  AfterViewInit, OnDestroy, ChangeDetectorRef, inject
} from '@angular/core';
import { Helper } from 'src/app/common/helper';
import { Train } from 'src/app/models/train.models';

@Component({
    selector: 'app-train-card',
    templateUrl: './train-card.component.html',
    styleUrls: ['./train-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TrainCardComponent implements AfterViewInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);

  helper = Helper;

  @Input() train!: Train;

  @Input() doj?: string;

  @Input() showNextAvail = true;

  @ViewChild('fareTrack') fareTrack?: ElementRef<HTMLElement>;

  /** Whether the fare row overflows (so the carousel arrows are worth showing). */
  overflowing = false;
  /** Scroll position flags to enable/disable the arrows. */
  atStart = true;
  atEnd = false;

  private ro?: ResizeObserver;

  ngAfterViewInit(): void {
    const el = this.fareTrack?.nativeElement;
    if (!el) return;
    this.updateScrollState();
    // Recompute when the box row resizes (responsive / data change).
    this.ro = new ResizeObserver(() => this.updateScrollState());
    this.ro.observe(el);
  }

  ngOnDestroy(): void {
    this.ro?.disconnect();
  }

  /** Scroll the fare track by roughly one viewport of boxes. */
  scrollFares(dir: -1 | 1): void {
    const el = this.fareTrack?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: 'smooth' });
  }

  onFareScroll(): void {
    this.updateScrollState();
  }

  private updateScrollState(): void {
    const el = this.fareTrack?.nativeElement;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    this.overflowing = max > 4;
    this.atStart = el.scrollLeft <= 2;
    this.atEnd = el.scrollLeft >= max - 2;
    this.cdr.markForCheck();
  }
}
