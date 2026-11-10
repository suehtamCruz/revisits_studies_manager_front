import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Menu],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private readonly auth = inject(AuthService);

  readonly userName = input<string | undefined>(undefined);

  protected readonly displayName = computed(
    () => this.userName() ?? this.auth.userName() ?? 'Usuário',
  );

  protected readonly menuOpen = signal(false);

  protected logout(): void {
    this.auth.logout();
  }
}
