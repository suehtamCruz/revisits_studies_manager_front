import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Header } from '../../shared/header/header';
import { PersonFormModal, PersonFormValue } from '../../shared/person-form-modal/person-form-modal';
import { RevisitsStudiesService } from '../../core/revisits-studies.service';
import { RevisitAndStudy, weekdayLabel } from '../../core/models';

@Component({
  selector: 'app-revisits',
  imports: [Header, PersonFormModal],
  templateUrl: './revisits.page.html',
  styleUrl: './revisits.page.scss'
})
export class RevisitsPage {
  private readonly api = inject(RevisitsStudiesService);

  protected readonly modalOpen = signal(false);
  protected readonly revisits = signal<RevisitAndStudy[]>([]);
  protected readonly weekdayLabel = weekdayLabel;

  constructor() {
    this.api
      .list({ type: 'Revisit' })
      .pipe(takeUntilDestroyed())
      .subscribe((list) => this.revisits.set(list));
  }

  protected onSaved(person: PersonFormValue): void {
    this.api
      .create({ ...person, age: person.age ?? undefined, type: 'Revisit' })
      .subscribe((created) => this.revisits.update((list) => [...list, created]));
  }
}
