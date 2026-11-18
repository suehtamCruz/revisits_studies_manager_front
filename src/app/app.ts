import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UpdateService } from './core/update.service';
import { Spinner } from './shared/spinner/spinner';
import { Toast } from './shared/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Spinner, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly update = inject(UpdateService);

  constructor() {
    this.update.init();
  }
}
