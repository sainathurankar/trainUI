import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: number;
  text: string;
  type: ToastType;
  delay: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private seq = 0;

  show(text: string, type: ToastType = 'info', delay = 4000): void {
    const toast: Toast = { id: ++this.seq, text, type, delay };
    this.toasts.update((list) => [...list, toast]);
    if (delay > 0 && typeof window !== 'undefined') {
      window.setTimeout(() => this.remove(toast.id), delay);
    }
  }

  success(text: string, delay = 4000): void {
    this.show(text, 'success', delay);
  }

  info(text: string, delay = 4000): void {
    this.show(text, 'info', delay);
  }

  warning(text: string, delay = 5000): void {
    this.show(text, 'warning', delay);
  }

  error(text: string, delay = 6000): void {
    this.show(text, 'error', delay);
  }

  remove(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
