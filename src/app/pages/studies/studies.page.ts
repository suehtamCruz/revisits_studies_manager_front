import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';
import { PersonFormModal, PersonFormValue } from '../../shared/person-form-modal/person-form-modal';
import { RevisitsStudiesService } from '../../core/revisits-studies.service';
import { RevisitAndStudy, weekdayLabel } from '../../core/models';

@Component({
  selector: 'app-studies',
  imports: [Header, PersonFormModal, RouterLink],
  templateUrl: './studies.page.html',
  styleUrl: './studies.page.scss'
})
export class StudiesPage {
  private readonly api = inject(RevisitsStudiesService);

  protected readonly modalOpen = signal(false);
  protected readonly studies = signal<RevisitAndStudy[]>([]);
  protected readonly weekdayLabel = weekdayLabel;

  constructor() {
    this.api
      .list({ type: 'Study' })
      .pipe(takeUntilDestroyed())
      .subscribe((list) => this.studies.set(list));
  }

  protected onSaved(person: PersonFormValue): void {
    this.api
      .create({ ...person, age: person.age ?? undefined, type: 'Study' })
      .subscribe((created) => this.studies.update((list) => [...list, created]));
  }
}
