import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Menu],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  readonly userName = input('teste');

  protected readonly menuOpen = signal(false);
}
