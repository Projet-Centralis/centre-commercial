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

// import { Routes } from '@angular/router';
// import { LayoutComponent } from './layout/layout.component';
// import { AuthComponent } from './auth/auth.component';
// import { authGuard } from '../guards/auth.guard';
// import { publicGuard } from '../guards/public.guard';

// export const routes: Routes = [
//   { 
//     path: '', 
//     redirectTo: 'auth', 
//     pathMatch: 'full' 
//   },
//   {
//     path: 'auth',
//     component: AuthComponent,
//     canActivate: [publicGuard]
//   },
//   {
//     path: '',
//     component: LayoutComponent,
//     canActivate: [authGuard],
//     children: [
//       { path: 'accueil', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
//       { path: 'boutique-dashboard', loadComponent: () => import('./pages/boutique-dashboard/boutique-dashboard.component').then(m => m.BoutiqueDashboardComponent) },
//       { path: 'boutiques', loadComponent: () => import('./pages/boutiques/boutiques.component').then(m => m.BoutiquesComponent) },
//       { path: 'promotions', loadComponent: () => import('./pages/promotions/promotions.component').then(m => m.PromotionsComponent) },
//       { path: 'forums', loadComponent: () => import('./pages/forums/forums.component').then(m => m.ForumsComponent) },
//       { path: 'events', loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent) },
//     ]
//   },
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
      // Route accueil pour les ACHETEURS
      { 
        path: 'accueil', 
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) 
      },
      
      // Routes pour les ACHETEURS
      { 
        path: 'boutiques', 
        loadComponent: () => import('./pages/boutiques/boutiques.component').then(m => m.BoutiquesComponent) 
      },
      { 
        path: 'promotions', 
        loadComponent: () => import('./pages/promotions/promotions.component').then(m => m.PromotionsComponent) 
      },
      { 
        path: 'forums', 
        loadComponent: () => import('./pages/forums/forums.component').then(m => m.ForumsComponent) 
      },
      { 
        path: 'events', 
        loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent) 
      },
      
      // Routes pour les BOUTIQUES (sous /boutique/)
      {
        path: 'boutique',
        children: [
          { 
            path: 'dashboard', 
            loadComponent: () => import('./pages/boutique-dashboard/boutique-dashboard.component').then(m => m.BoutiqueDashboardComponent) 
          },
          {
            path: 'events', 
            loadComponent: () => import('./pages/boutique-events/boutique-events.component').then(m => m.BoutiqueEventsComponent) 
          },
          {
            path: 'produits', 
            loadComponent: () => import('./pages/boutique-produits/boutique-produits.component').then(m => m.BoutiqueProduitsComponent) 
          },
          // ... autres routes boutique
          { 
            path: '', 
            redirectTo: 'dashboard', 
            pathMatch: 'full' 
          }
        ]
      },
      
      // Routes pour les ADMIN
      // {
      //   path: 'admin',
      //   children: [
      //     { 
      //       path: 'dashboard', 
      //       loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) 
      //     },
      //     { 
      //       path: '', 
      //       redirectTo: 'dashboard', 
      //       pathMatch: 'full' 
      //     }
      //   ]
      // },
    ]
  },
  { 
    path: '**', 
    redirectTo: 'auth' 
  }
];