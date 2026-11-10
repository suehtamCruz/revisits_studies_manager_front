import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Header } from '../../shared/header/header';
import { AuthService } from '../../core/auth.service';
import { RevisitsStudiesService } from '../../core/revisits-studies.service';
import { RevisitAndStudy } from '../../core/models';

@Component({
  selector: 'app-home',
  imports: [Header],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {
  private readonly auth = inject(AuthService);
  private readonly api = inject(RevisitsStudiesService);

  protected readonly userName = computed(() => this.auth.userName() ?? 'Usuário');
  protected readonly todayItems = signal<RevisitAndStudy[]>([]);

  protected readonly studiesToday = computed(() =>
    this.todayItems().filter((item) => item.type === 'Study'),
  );
  protected readonly revisitsToday = computed(() =>
    this.todayItems().filter((item) => item.type === 'Revisit'),
  );

  private readonly today = new Date();

  protected readonly weekday = computed(() => {
    const label = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(this.today);
    return label.charAt(0).toUpperCase() + label.slice(1);
  });

  protected readonly dateLabel = computed(() =>
    new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(this.today)
  );

  constructor() {
    this.api
      .list({ dayOfWeek: this.today.getDay() })
      .pipe(takeUntilDestroyed())
      .subscribe((list) => this.todayItems.set(list));
  }
}
