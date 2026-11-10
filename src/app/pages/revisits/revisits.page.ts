import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../shared/header/header';
import { PersonFormModal, PersonFormValue } from '../../shared/person-form-modal/person-form-modal';

@Component({
  selector: 'app-revisits',
  imports: [Header, PersonFormModal],
  templateUrl: './revisits.page.html',
  styleUrl: './revisits.page.scss'
})
export class RevisitsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly modalOpen = signal(false);
  protected readonly revisits = signal<PersonFormValue[]>([]);

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
    this.revisits.update((list) => [...list, person]);
  }
}
