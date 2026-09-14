import { Injectable, inject } from '@angular/core';
import { ToastService } from '../toast/toast.service';

/**
 * Shares the current page. Uses the native Web Share sheet on supporting
 * devices (mobile), otherwise copies the URL to the clipboard and toasts.
 */
@Injectable({ providedIn: 'root' })
export class ShareService {
  private toast = inject(ToastService);

  async share(title: string, url?: string): Promise<void> {
    const link = url ?? (typeof window !== 'undefined' ? window.location.href : '');
    if (!link) {
      return;
    }
    const nav = typeof navigator !== 'undefined' ? (navigator as Navigator) : undefined;

    if (nav && typeof nav.share === 'function') {
      try {
        await nav.share({ title, url: link });
        return;
      } catch (err) {
        // AbortError = user dismissed the sheet; don't fall back or toast.
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      if (nav?.clipboard?.writeText) {
        await nav.clipboard.writeText(link);
      } else {
        this.legacyCopy(link);
      }
      this.toast.success('Link copied to clipboard');
    } catch {
      this.toast.info(link);
    }
  }

  private legacyCopy(text: string): void {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}
