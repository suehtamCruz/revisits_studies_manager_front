import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../shared/header/header';
import { PersonFormModal, PersonFormValue } from '../../shared/person-form-modal/person-form-modal';
import { RevisitsStudiesService } from '../../core/revisits-studies.service';
import { RevisitAndStudy, weekdayLabel } from '../../core/models';

@Component({
  selector: 'app-studies',
  imports: [Header, PersonFormModal],
  templateUrl: './studies.page.html',
  styleUrl: './studies.page.scss'
})
export class StudiesPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(RevisitsStudiesService);

  protected readonly modalOpen = signal(false);
  protected readonly studies = signal<RevisitAndStudy[]>([]);
  protected readonly weekdayLabel = weekdayLabel;

  constructor() {
    this.api
      .list({ type: 'Study' })
      .pipe(takeUntilDestroyed())
      .subscribe((list) => this.studies.set(list));

    this.route.queryParamMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        if (params.has('novo')) {
          this.modalOpen.set(true);
          this.router.navigate([], {
            queryParams: { novo: null },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        }
      });
  }

  protected onSaved(person: PersonFormValue): void {
    this.api
      .create({ ...person, age: person.age ?? undefined, type: 'Study' })
      .subscribe((created) => this.studies.update((list) => [...list, created]));
  }
}
