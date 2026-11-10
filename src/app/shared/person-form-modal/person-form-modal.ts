import { Component, inject, input, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WEEKDAY_LABELS } from '../../core/models';

export interface PersonFormValue {
  name: string;
  age: number | null;
  dayOfWeek: number;
  address: string;
  details: string;
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

  protected readonly weekdays = WEEKDAY_LABELS;

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    age: [null as number | null],
    dayOfWeek: [new Date().getDay()],
    address: ['', Validators.required],
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
      dayOfWeek: value.dayOfWeek ?? new Date().getDay(),
      address: value.address ?? '',
      details: value.details ?? '',
    });
    this.form.reset({
      name: '',
      age: null,
      dayOfWeek: new Date().getDay(),
      address: '',
      details: '',
    });
    this.close();
  }
}
