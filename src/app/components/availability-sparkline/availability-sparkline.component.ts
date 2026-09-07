import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Helper } from 'src/app/common/helper';

interface SparkPoint {
  x: number;
  y: number;
  rank: string;
  status: string;
  date: string;
  seats: string;
}

@Component({
  selector: 'app-availability-sparkline',
  templateUrl: './availability-sparkline.component.html',
  styleUrls: ['./availability-sparkline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AvailabilitySparklineComponent {
  // SVG viewBox dimensions
  readonly width = 240;
  readonly height = 44;
  private readonly pad = 6;

  points: SparkPoint[] = [];
  linePath = '';
  areaPath = '';
  trendLabel = '';
  trendClass = '';

  @Input() set series(list: { status?: string; seats?: string; availablityDate?: string }[] | null) {
    this.build(list || []);
  }

  private build(list: { status?: string; seats?: string; availablityDate?: string }[]): void {
    if (!list.length) {
      this.points = [];
      this.linePath = '';
      this.areaPath = '';
      return;
    }

    const scores = list.map((a) => Helper.availabilityScore(a.status || '', a.seats));
    const max = Math.max(...scores, 1);
    const min = Math.min(...scores, 0);
    const range = max - min || 1;
    const innerW = this.width - this.pad * 2;
    const innerH = this.height - this.pad * 2;
    const step = list.length > 1 ? innerW / (list.length - 1) : 0;

    this.points = list.map((a, i) => {
      const score = scores[i];
      const norm = (score - min) / range; // 0..1
      return {
        x: this.pad + i * step,
        y: this.pad + innerH - norm * innerH,
        rank: Helper.availabilityRank(a.status || ''),
        status: a.status || '',
        date: a.availablityDate || '',
        seats: a.seats || '',
      };
    });

    this.linePath = this.points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');

    const first = this.points[0];
    const last = this.points[this.points.length - 1];
    this.areaPath =
      `M${first.x.toFixed(1)},${(this.height - this.pad).toFixed(1)} ` +
      this.points.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
      ` L${last.x.toFixed(1)},${(this.height - this.pad).toFixed(1)} Z`;

    this.computeTrend(scores);
  }

  private computeTrend(scores: number[]): void {
    if (scores.length < 2) {
      this.trendLabel = '';
      this.trendClass = '';
      return;
    }
    const half = Math.floor(scores.length / 2);
    const avg = (arr: number[]) => arr.reduce((s, x) => s + x, 0) / (arr.length || 1);
    const firstHalf = avg(scores.slice(0, half));
    const secondHalf = avg(scores.slice(half));
    const diff = secondHalf - firstHalf;
    if (Math.abs(diff) < 20) {
      this.trendLabel = 'Stable';
      this.trendClass = 'trend-stable';
    } else if (diff > 0) {
      this.trendLabel = 'Improving';
      this.trendClass = 'trend-up';
    } else {
      this.trendLabel = 'Filling up';
      this.trendClass = 'trend-down';
    }
  }

  dotClass(rank: string): string {
    switch (rank) {
      case 'available':
        return 'dot-available';
      case 'rac':
        return 'dot-rac';
      case 'waitlist':
        return 'dot-waitlist';
      default:
        return 'dot-unavailable';
    }
  }
}
