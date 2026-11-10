import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { Header } from '../../shared/header/header';
import { RevisitsStudiesService } from '../../core/revisits-studies.service';
import { RevisitAndStudy, weekdayLabel } from '../../core/models';

@Component({
  selector: 'app-details',
  imports: [Header, RouterLink],
  templateUrl: './details.page.html',
  styleUrl: './details.page.scss'
})
export class DetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(RevisitsStudiesService);

  protected readonly item = signal<RevisitAndStudy | null>(null);
  protected readonly notFound = signal(false);
  protected readonly weekdayLabel = weekdayLabel;

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
}
