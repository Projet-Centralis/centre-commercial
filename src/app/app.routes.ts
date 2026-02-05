// import { Routes } from '@angular/router';
// import { LayoutComponent } from './layout/layout.component';

// export const routes: Routes = [
//   {
//     path: '',
//     component: LayoutComponent,
//     children: [
//       { path: 'accueil', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
//       { path: 'boutiques', loadComponent: () => import('./pages/boutiques/boutiques.component').then(m => m.BoutiquesComponent) },
//       { path: 'promotions', loadComponent: () => import('./pages/promotions/promotions.component').then(m => m.PromotionsComponent) },
//       { path: 'forums', loadComponent: () => import('./pages/forums/forums.component').then(m => m.ForumsComponent) },
//       { path: 'events', loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent) },
//       { path: '', redirectTo: 'accueil', pathMatch: 'full' }
//     ]
//   }
// ];


// import { Routes } from '@angular/router';
// import { LayoutComponent } from './layout/layout.component';
// import { AuthComponent } from './auth/auth.component';

// export const routes: Routes = [
//   // Route par défaut vers l'authentification
//   { 
//     path: '', 
//     redirectTo: 'auth', 
//     pathMatch: 'full' 
//   },
//   // Route d'authentification
//   {
//     path: 'auth',
//     component: AuthComponent
//   },
//   // Layout avec les pages protégées
//   {
//     path: '',
//     component: LayoutComponent,
//     children: [
//       { path: 'accueil', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
//       { path: 'boutiques', loadComponent: () => import('./pages/boutiques/boutiques.component').then(m => m.BoutiquesComponent) },
//       { path: 'promotions', loadComponent: () => import('./pages/promotions/promotions.component').then(m => m.PromotionsComponent) },
//       { path: 'forums', loadComponent: () => import('./pages/forums/forums.component').then(m => m.ForumsComponent) },
//       { path: 'events', loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent) },
//     ]
//   },
//   // Redirection pour les routes inconnues
//   { path: '**', redirectTo: 'auth' }
// ];

import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from '../guards/auth.guard';
import { publicGuard } from '../guards/public.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'auth', 
    pathMatch: 'full' 
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [publicGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'accueil', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'boutiques', loadComponent: () => import('./pages/boutiques/boutiques.component').then(m => m.BoutiquesComponent) },
      { path: 'promotions', loadComponent: () => import('./pages/promotions/promotions.component').then(m => m.PromotionsComponent) },
      { path: 'forums', loadComponent: () => import('./pages/forums/forums.component').then(m => m.ForumsComponent) },
      { path: 'events', loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent) },
    ]
  },
  { path: '**', redirectTo: 'auth' }
];