import { Component, inject, model } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  private readonly auth = inject(AuthService);

  readonly open = model(false);

  protected close(): void {
    this.open.set(false);
  }

  protected logout(): void {
    this.auth.logout();
    this.close();
  }
}
