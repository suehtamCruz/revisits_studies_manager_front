import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'estudos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/studies/studies.page').then((m) => m.StudiesPage),
  },
  {
    path: 'revisitas',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/revisits/revisits.page').then((m) => m.RevisitsPage),
  },
  { path: '**', redirectTo: 'home' },
];
