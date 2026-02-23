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
          {
            path: 'previsions', 
            loadComponent: () => import('./pages/boutique-prevision/boutique-prevision.component').then(m => m.BoutiquePrevisionComponent)
          },
          {
            path: 'loyers',
            loadComponent: () => import('./pages/boutique-loyer/boutique-loyer.component').then(m => m.BoutiqueLoyerComponent)
          },
    
          { 
            path: '', 
            redirectTo: 'dashboard', 
            pathMatch: 'full' 
          }
        ]
      }, // Routes pour les ADMIN
      {
        path: 'admin',
        children: [
           {
            path: 'loyers',
            loadComponent: () => import('./pages/admin-loyers/admin-loyers.component').then(m => m.AdminLoyersComponent)
          },
            {
            path: 'dashboard',
            loadComponent: () => import('./pages/dashboard-admin/dashboard-admin.component').then(m => m.DashboardAdminComponent)
          },
          { path: 'loyer', loadComponent: () => import('./pages/loyer-admin/loyer-admin.component').then(m => m.LoyerAdminComponent) },
          { path: 'events', loadComponent: () => import('./pages/events-admin/events-admin.component').then(m => m.EventsAdminComponent) },

          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          }
        ]
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];