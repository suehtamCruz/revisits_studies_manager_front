import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Header } from '../../shared/header/header';
import { PersonFormModal, PersonFormValue } from '../../shared/person-form-modal/person-form-modal';
import { RevisitsStudiesService } from '../../core/revisits-studies.service';
import { RevisitAndStudy, weekdayLabel } from '../../core/models';

@Component({
  selector: 'app-details',
  imports: [Header, PersonFormModal],
  templateUrl: './details.page.html',
  styleUrl: './details.page.scss'
})
export class DetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(RevisitsStudiesService);
  private readonly location = inject(Location);

  protected readonly item = signal<RevisitAndStudy | null>(null);
  protected readonly notFound = signal(false);
  protected readonly modalOpen = signal(false);
  protected readonly weekdayLabel = weekdayLabel;

  protected readonly isStudy = computed(() => this.item()?.type === 'Study');

  protected readonly initialFormValue = computed<PersonFormValue | null>(() => {
    const record = this.item();
    if (!record) {
      return null;
    }
    return {
      name: record.name,
      age: record.age ?? null,
      dayOfWeek: record.dayOfWeek ?? new Date().getDay(),
      address: record.address,
      details: record.details ?? '',
    };
  });

  constructor() {
    this.route.paramMap
      .pipe(
        switchMap((params) => this.api.getById(params.get('id') ?? '')),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (item) => this.item.set(item),
        error: () => this.notFound.set(true),
      });
  }

  protected goBack(): void {
    this.location.back();
  }

  protected onSaved(person: PersonFormValue): void {
    const record = this.item();
    if (!record) {
      return;
    }
    this.api
      .update(record.id, { ...person, age: person.age ?? undefined, type: record.type })
      .subscribe((updated) => this.item.set(updated));
  }
}
