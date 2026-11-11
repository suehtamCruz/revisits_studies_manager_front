import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Spinner } from './shared/spinner/spinner';
import { Toast } from './shared/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Spinner, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
