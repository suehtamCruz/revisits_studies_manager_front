import { Component, inject, input, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export interface PersonFormValue {
  name: string;
  age: number | null;
  day: string;
  address: string;
  details: string;
}

const WEEKDAYS = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

function todayWeekday(): string {
  const label = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(new Date());
  return label.charAt(0).toUpperCase() + label.slice(1);
}

@Component({
  selector: 'app-person-form-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './person-form-modal.html',
  styleUrl: './person-form-modal.scss'
})
export class PersonFormModal {
  readonly open = model(false);
  readonly title = input.required<string>();
  readonly dayLabel = input.required<string>();
  readonly submitLabel = input.required<string>();
  readonly saved = output<PersonFormValue>();

  private readonly fb = inject(FormBuilder);

  protected readonly weekdays = WEEKDAYS;

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    age: [null as number | null],
    day: [todayWeekday()],
    address: [''],
    details: [''],
  });

  protected close(): void {
    this.open.set(false);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.saved.emit({
      name: value.name ?? '',
      age: value.age ?? null,
      day: value.day ?? '',
      address: value.address ?? '',
      details: value.details ?? '',
    });
    this.form.reset({ name: '', age: null, day: todayWeekday(), address: '', details: '' });
    this.close();
  }
}
