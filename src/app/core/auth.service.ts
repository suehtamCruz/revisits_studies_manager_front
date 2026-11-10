import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from './models';

const TOKEN_KEY = 'auth_token';
const NAME_KEY = 'auth_name';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/Auth`;

  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly userName = signal<string | null>(localStorage.getItem(NAME_KEY));

  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, body).pipe(
      tap((res) => this.setSession(res)),
    );
  }

  register(body: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, body);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NAME_KEY);
    this.token.set(null);
    this.userName.set(null);
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    this.token.set(res.token);

    const name = decodeJwtName(res.token);
    if (name) {
      localStorage.setItem(NAME_KEY, name);
      this.userName.set(name);
    }
  }
}

function decodeJwtName(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return (
      payload.name ??
      payload.unique_name ??
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
      null
    );
  } catch {
    return null;
  }
}
