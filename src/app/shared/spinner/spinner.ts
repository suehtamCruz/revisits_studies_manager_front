import { Component, inject } from '@angular/core';
import { LoadingService } from '../../core/loading.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss'
})
export class Spinner {
  protected readonly loading = inject(LoadingService);
}
