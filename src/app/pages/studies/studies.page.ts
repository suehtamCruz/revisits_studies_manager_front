import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../shared/header/header';
import { PersonFormModal, PersonFormValue } from '../../shared/person-form-modal/person-form-modal';

@Component({
  selector: 'app-studies',
  imports: [Header, PersonFormModal],
  templateUrl: './studies.page.html',
  styleUrl: './studies.page.scss'
})
export class StudiesPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly modalOpen = signal(false);
  protected readonly studies = signal<PersonFormValue[]>([]);

  constructor() {
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
    this.studies.update((list) => [...list, person]);
  }
}
