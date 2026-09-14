import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RisService } from 'src/app/services/ris/ris.service';
import { PnrStatusResponse } from 'src/app/models/ris.models';

@Component({
  selector: 'app-pnr-status',
  templateUrl: './pnr-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PnrStatusComponent {
  private ris = inject(RisService);
  private cdr = inject(ChangeDetectorRef);

  pnr = '';
  loading = false;
  result?: PnrStatusResponse;
  error?: string;
  submitted = false;

  get valid(): boolean {
    return /^\d{10}$/.test(this.pnr.trim());
  }

  search(): void {
    this.submitted = true;
    if (!this.valid) {
      return;
    }
    this.loading = true;
    this.result = undefined;
    this.error = undefined;
    this.ris.getPnrStatus(this.pnr.trim()).subscribe({
      next: (res) => {
        if (res?.errormsg) {
          this.error = res.detailedmsg || res.errormsg;
        } else {
          this.result = res;
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

  isConfirmed(status?: string): boolean {
    return !!status && status.toUpperCase().startsWith('CNF');
  }
}
