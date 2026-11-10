import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../core/auth.service';

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
  private readonly auth = inject(AuthService);

  protected readonly mode = signal<AuthMode>('login');
  protected readonly error = signal('');
  protected readonly showPassword = signal(false);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected readonly registerForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected setMode(mode: AuthMode): void {
    this.mode.set(mode);
    this.error.set('');
  }

  protected togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  protected submit(): void {
    const isLogin = this.mode() === 'login';
    const form = isLogin ? this.loginForm : this.registerForm;

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    this.error.set('');

    const request$ = isLogin
      ? this.auth.login(this.loginForm.getRawValue())
      : this.auth.register(this.registerForm.getRawValue()).pipe(
          switchMap(() => {
            const { email, password } = this.registerForm.getRawValue();
            return this.auth.login({ email, password });
          }),
        );

    request$.subscribe({
      next: () => this.router.navigate(['/home']),
      error: () =>
        this.error.set(
          isLogin ? 'E-mail ou senha inválidos.' : 'Não foi possível concluir o cadastro.',
        ),
    });
  }
}
