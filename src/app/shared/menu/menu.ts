import { Component, model } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  readonly open = model(false);

  protected close(): void {
    this.open.set(false);
  }
}
