import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'estudos',
    loadComponent: () => import('./pages/studies/studies.page').then((m) => m.StudiesPage),
  },
  {
    path: 'revisitas',
    loadComponent: () => import('./pages/revisits/revisits.page').then((m) => m.RevisitsPage),
  },
  { path: '**', redirectTo: 'auth' },
];
