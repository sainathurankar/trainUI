import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);
  toasts = this.toastService.toasts;

  icon(type: string): string {
    switch (type) {
      case 'success':
        return 'fa-circle-check';
      case 'warning':
        return 'fa-triangle-exclamation';
      case 'error':
        return 'fa-circle-xmark';
      default:
        return 'fa-circle-info';
    }
  }

  dismiss(id: number): void {
    this.toastService.remove(id);
  }
}
