import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'travel',
    loadComponent: () => import('./features/travel/travel.component').then(m => m.TravelComponent),
    canActivate: [authGuard]
  },
  {
    path: 'travel/new',
    loadComponent: () => import('./features/travel/travel-form.component').then(m => m.TravelFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'travel/edit/:id',
    loadComponent: () => import('./features/travel/travel-form.component').then(m => m.TravelFormComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
