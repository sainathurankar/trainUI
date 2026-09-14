import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Thin logging wrapper. In production builds `log`/`warn` are suppressed to keep
 * the console clean; `error` is always emitted so real failures remain visible
 * (and can be picked up by error-reporting tooling later).
 */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(...args: unknown[]): void {
    if (!environment.production) {
      console.log(...args);
    }
  }

  warn(...args: unknown[]): void {
    if (!environment.production) {
      console.warn(...args);
    }
  }

  error(...args: unknown[]): void {
    console.error(...args);
  }
}
