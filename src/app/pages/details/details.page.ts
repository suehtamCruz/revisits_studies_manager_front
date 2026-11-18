import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { Header } from '../../shared/header/header';
import { PersonFormModal, PersonFormValue } from '../../shared/person-form-modal/person-form-modal';
import { RevisitsStudiesService } from '../../core/revisits-studies.service';
import { ToastService } from '../../core/toast.service';
import {
  PagedResult,
  RevisitAndStudy,
  RevisitAndStudyRequest,
  Visit,
  weekdayLabel,
} from '../../core/models';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-details',
  imports: [Header, PersonFormModal, MatTooltip, ReactiveFormsModule],
  templateUrl: './details.page.html',
  styleUrl: './details.page.scss'
})
export class DetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(RevisitsStudiesService);
  private readonly location = inject(Location);
  private readonly toast = inject(ToastService);

  protected readonly item = signal<RevisitAndStudy | null>(null);
  protected readonly notFound = signal(false);
  protected readonly modalOpen = signal(false);
  protected readonly weekdayLabel = weekdayLabel;

  protected readonly visits = signal<Visit[]>([]);
  protected readonly visitsPage = signal(0);
  protected readonly visitsTotalPages = signal(0);
  protected readonly visitsLoading = signal(false);
  protected readonly hasMoreVisits = computed(
    () => this.visitsPage() < this.visitsTotalPages(),
  );

  protected readonly visitFormOpen = signal(false);
  protected readonly visitSubmitting = signal(false);

  private conversionPrompted = false;

  private readonly fb = inject(FormBuilder);

  protected readonly visitForm = this.fb.group({
    date: ['', Validators.required],
    details: ['', Validators.required],
  });

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
  take = signal(5);
  visitId = this.route.snapshot.paramMap.get('id');

  constructor() { 
  }

  ngOnInit(): void {
    this.loadItem();
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

  protected loadMoreVisits(): void {
    this.loadVisits(this.visitsPage() + 1);
  }

  protected toggleVisitForm(): void {
    this.visitFormOpen.update((open) => !open);
    if (this.visitFormOpen()) {
      this.visitForm.reset({
        date: '',
        details: '',
      });
    }
  }

  protected submitVisit(): void {
    const record = this.item();
    if (!record || this.visitForm.invalid) {
      this.visitForm.markAllAsTouched();
      return;
    }

    const value = this.visitForm.getRawValue();
    this.visitSubmitting.set(true);
    this.api
      .addVisit(record.id, {
        date: new Date(value.date ?? '').toISOString(),
        details: value.details ?? '',
      })
      .pipe(finalize(() => this.visitSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.visitFormOpen.set(false);
          this.toast.success('Visita registrada com sucesso.');
          this.loadVisits();
          this.loadItem();
        },
        error: (err) => {
          this.visitSubmitting.set(false);
          this.toast.apiError(err, 'Não foi possível registrar a visita.');
        },
      });
  }

  private loadItem(): void {
    this.api.getById(this.visitId!).subscribe({
      next: (item) => {
        this.item.set(item);
        this.loadVisits();
      },
      error: (err) => {
        this.notFound.set(true);
        this.toast.apiError(err, 'Não foi possível carregar o registro.');
      },
    });
  }

  private loadVisits(page = 1): void {
    const record = this.item();
    if (!record) {
      return;
    }

    this.visitsLoading.set(true);
    this.api.listVisits(record.id, page, this.take()).subscribe({
      next: (result) => {
        this.visits.update((list) => (page === 1 ? result.items : [...list, ...result.items]));
        this.visitsPage.set(result.page);
        this.visitsTotalPages.set(result.totalPages);
        this.visitsLoading.set(false);
        this.maybePromptConversion(result);
      },
      error: (err) => {
        this.visitsLoading.set(false);
        this.toast.apiError(err, 'Não foi possível carregar o histórico.');
      },
    });
  }

  private maybePromptConversion(result: PagedResult<Visit>): void {
    const record = this.item();
    if (this.conversionPrompted || record?.type !== 'Revisit' || result.total < 3) {
      return;
    }
    this.conversionPrompted = true;
    void this.promptConvertToStudy(record, result.total);
  }

  private async promptConvertToStudy(record: RevisitAndStudy, total: number): Promise<void> {
    const result = await Swal.fire({
      title: 'Transformar em estudo?',
      text: `Esta revisita já possui ${total} visitas registradas. Deseja transformá-la em um estudo?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, transformar',
      cancelButtonText: 'Agora não',
      confirmButtonColor: '#5b3a88',
    });

    if (!result.isConfirmed) {
      return;
    }

    this.api.changeType(record.id, 'Study').subscribe({
      next: (updated) => {
        this.item.set(updated ?? { ...record, type: 'Study' });
        this.toast.success('Revisita transformada em estudo.');
      },
      error: (err) => this.toast.apiError(err, 'Não foi possível converter o registro.'),
    });
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
