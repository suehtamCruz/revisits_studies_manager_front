import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';
import { PersonFormModal, PersonFormValue } from '../../shared/person-form-modal/person-form-modal';
import { RevisitsStudiesService } from '../../core/revisits-studies.service';
import { ToastService } from '../../core/toast.service';
import { RevisitAndStudy, weekdayLabel } from '../../core/models';

@Component({
  selector: 'app-revisits',
  imports: [Header, PersonFormModal, RouterLink],
  templateUrl: './revisits.page.html',
  styleUrl: './revisits.page.scss'
})
export class RevisitsPage {
  private readonly api = inject(RevisitsStudiesService);
  private readonly toast = inject(ToastService);

  protected readonly modalOpen = signal(false);
  protected readonly revisits = signal<RevisitAndStudy[]>([]);
  protected readonly weekdayLabel = weekdayLabel;

  constructor() {
    this.api
      .list({ type: 'Revisit' })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (list) => this.revisits.set(list),
        error: (err) => this.toast.apiError(err, 'Não foi possível carregar as revisitas.'),
      });
  }

  protected onSaved(person: PersonFormValue): void {
    this.api
      .create({ ...person, age: person.age ?? undefined, type: 'Revisit' })
      .subscribe({
        next: (created) => {
          this.revisits.update((list) => [...list, created]);
          this.toast.success('Revisita criada com sucesso.');
        },
        error: (err) => this.toast.apiError(err, 'Não foi possível salvar a revisita.'),
      });
  }
}
