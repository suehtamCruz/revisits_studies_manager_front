import { Injectable, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class UpdateService {
  private readonly swUpdate = inject(SwUpdate, { optional: true });

  init(): void {
    const swUpdate = this.swUpdate;
    if (!swUpdate?.isEnabled) {
      return;
    }

    swUpdate.versionUpdates.subscribe((event) => {
      if (event.type === 'VERSION_READY') {
        void this.promptUpdate();
      }
    });

    swUpdate.unrecoverable.subscribe(() => document.location.reload());

    this.checkForUpdate();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkForUpdate();
      }
    });
  }

  private checkForUpdate(): void {
    this.swUpdate?.checkForUpdate().catch(() => undefined);
  }

  private async promptUpdate(): Promise<void> {
    const result = await Swal.fire({
      toast: true,
      position: 'bottom',
      icon: 'info',
      title: 'Nova versão disponível',
      showConfirmButton: true,
      confirmButtonText: 'Atualizar',
      confirmButtonColor: '#5b3a88',
    });

    if (result.isConfirmed) {
      await this.swUpdate?.activateUpdate();
      document.location.reload();
    }
  }
}
