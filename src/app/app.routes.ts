import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'accueil', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'boutiques', loadComponent: () => import('./pages/boutiques/boutiques.component').then(m => m.BoutiquesComponent) },
      { path: 'promotions', loadComponent: () => import('./pages/promotions/promotions.component').then(m => m.PromotionsComponent) },
      { path: 'forums', loadComponent: () => import('./pages/forums/forums.component').then(m => m.ForumsComponent) },
      { path: 'events', loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent) },
      { path: '', redirectTo: 'accueil', pathMatch: 'full' }
    ]
  }
];
