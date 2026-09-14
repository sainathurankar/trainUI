import { Injectable } from '@angular/core';

/** A stored recent lookup for a RIS page (train number, PNR, coach station…). */
export interface RecentEntry {
  /** Primary value shown as the chip label (train number or PNR). */
  value: string;
  /** Optional secondary text (train name, station code). */
  label?: string;
  /** Optional extra param (e.g. coach station code). */
  extra?: string;
  /** Epoch ms of the lookup, newest first. */
  ts: number;
}

type RecentKind = 'pnr' | 'live' | 'schedule' | 'coach';

/**
 * Keeps the last 5 lookups per RIS page in localStorage so the user can
 * re-run a recent search with one tap. Fails silently when storage is
 * unavailable (private mode / SSR).
 */
@Injectable({ providedIn: 'root' })
export class RecentSearchesService {
  private readonly MAX = 5;
  private readonly PREFIX = 'ris_recent_';

  get(kind: RecentKind): RecentEntry[] {
    try {
      const raw = localStorage.getItem(this.PREFIX + kind);
      if (!raw) {
        return [];
      }
      const list = JSON.parse(raw) as RecentEntry[];
      return Array.isArray(list) ? list.slice(0, this.MAX) : [];
    } catch {
      return [];
    }
  }

  add(kind: RecentKind, entry: RecentEntry): void {
    try {
      const key = (e: RecentEntry) => `${e.value}|${e.extra ?? ''}`;
      const existing = this.get(kind).filter((e) => key(e) !== key(entry));
      const next = [{ ...entry, ts: Date.now() }, ...existing].slice(0, this.MAX);
      localStorage.setItem(this.PREFIX + kind, JSON.stringify(next));
    } catch {
      /* storage unavailable — recent history is best-effort */
    }
  }

  clear(kind: RecentKind): void {
    try {
      localStorage.removeItem(this.PREFIX + kind);
    } catch {
      /* no-op */
    }
  }
}
