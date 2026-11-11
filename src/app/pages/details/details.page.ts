import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatTooltip } from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { Header } from '../../shared/header/header';
import { PersonFormModal, PersonFormValue } from '../../shared/person-form-modal/person-form-modal';
import { RevisitsStudiesService } from '../../core/revisits-studies.service';
import { ToastService } from '../../core/toast.service';
import { RevisitAndStudy, RevisitAndStudyRequest, weekdayLabel } from '../../core/models';

@Component({
  selector: 'app-details',
  imports: [Header, PersonFormModal, MatTooltip],
  templateUrl: './details.page.html',
  styleUrl: './details.page.scss'
})
export class DetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(RevisitsStudiesService);
  private readonly location = inject(Location);
  private readonly toast = inject(ToastService);

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
      lastVisit: record.lastVisit,
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
        error: (err) => {
          this.notFound.set(true);
          this.toast.apiError(err, 'Não foi possível carregar o registro.');
        },
      });
  }

  protected goBack(): void {
    this.location.back();
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(value));
  }

  protected onSaved(person: PersonFormValue): void {
    const record = this.item();
    if (!record) {
      return;
    }

    const changes: Partial<RevisitAndStudyRequest> = {};
    if (person.name !== record.name) {
      changes.name = person.name;
    }
    if ((person.age ?? undefined) !== record.age) {
      changes.age = person.age;
    }
    if (person.dayOfWeek !== record.dayOfWeek) {
      changes.dayOfWeek = person.dayOfWeek;
    }
    if (person.address !== record.address) {
      changes.address = person.address;
    }
    if (person.details !== (record.details ?? '')) {
      changes.details = person.details;
    }
    if (person.lastVisit?.slice(0, 10) !== record.lastVisit?.slice(0, 10)) {
      changes.lastVisit = person.lastVisit;
    }

    if (Object.keys(changes).length === 0) {
      return;
    }

    this.api.update(record.id, changes).subscribe({
      next: (updated) => {
        this.item.set(updated);
        this.toast.success('Alterações salvas com sucesso.');
      },
      error: (err) => this.toast.apiError(err, 'Não foi possível salvar as alterações.'),
    });
  }

  protected async confirmDelete(): Promise<void> {
    const record = this.item();
    if (!record) {
      return;
    }

    const isStudy = record.type === 'Study';
    const result = await Swal.fire({
      title: isStudy ? 'Excluir estudo?' : 'Excluir revisita?',
      text: 'Essa ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#6e3536',
    });

    if (!result.isConfirmed) {
      return;
    }

    this.api.delete(record.id).subscribe({
      next: () => {
        this.toast.success(isStudy ? 'Estudo excluído com sucesso.' : 'Revisita excluída com sucesso.');
        this.location.back();
      },
      error: (err) => this.toast.apiError(err, 'Não foi possível excluir o registro.'),
    });
  }
}
