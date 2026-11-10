import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.scss'
})
export class AuthPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly mode = signal<AuthMode>('login');

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected readonly registerForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected setMode(mode: AuthMode): void {
    this.mode.set(mode);
  }

  protected submit(): void {
    const form = this.mode() === 'login' ? this.loginForm : this.registerForm;

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.router.navigate(['/home']);
  }
}
