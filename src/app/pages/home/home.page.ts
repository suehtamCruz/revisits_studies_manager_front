import { Component, computed, signal } from '@angular/core';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-home',
  imports: [Header],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {
  protected readonly userName = signal('teste');
  protected readonly studiesToday = signal(0);
  protected readonly revisitsToday = signal(0);

  private readonly today = new Date();

  protected readonly weekday = computed(() => {
    const label = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(this.today);
    return label.charAt(0).toUpperCase() + label.slice(1);
  });

  protected readonly dateLabel = computed(() =>
    new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(this.today)
  );
}
