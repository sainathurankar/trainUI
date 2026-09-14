import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RecentEntry } from 'src/app/services/recent-searches/recent-searches.service';

/** Renders the last-5 recent lookups as clickable chips. */
@Component({
  selector: 'app-recent-chips',
  templateUrl: './recent-chips.component.html',
  styleUrls: ['./recent-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class RecentChipsComponent {
  @Input() entries: RecentEntry[] = [];
  @Output() pick = new EventEmitter<RecentEntry>();
  @Output() clear = new EventEmitter<void>();
}
