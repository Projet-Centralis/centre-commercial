import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Cloner la requête pour ajouter le header d'authentification
  let authReq = req;
  const token = authService.getToken();

  if (token && !isAuthRequest(req.url)) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Token expiré ou invalide
        authService.logout();
        router.navigate(['/auth']);
      }
      return throwError(() => error);
    })
  );
};

function isAuthRequest(url: string): boolean {
  return url.includes('/auth/');
}