import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface User {
  _id: string;
  email: string;
  type_user: 'ACHETEUR' | 'BOUTIQUE' | 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  type_user: 'ACHETEUR' | 'BOUTIQUE';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.clearStorage();
      }
    }
  }

  login(loginData: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            this.setAuthData(response.token, response.user);
          }
        }),
        catchError(this.handleError)
      );
  }

  register(registerData: RegisterData): Observable<RegisterResponse> {
    // Envoyer directement les données, pas besoin de conversion
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, registerData)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            this.setAuthData(response.token, response.user);
          }
        }),
        catchError(this.handleError)
      );
  }

  private setAuthData(token: string, user: User): void {
    // Stocker directement sans conversion
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    
    this.currentUserSubject.next(user);
  }

  logout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }

  private clearStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Vérifier si le token est expiré (basique)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserType(): 'ACHETEUR' | 'BOUTIQUE' | 'ADMIN' | null {
    return this.currentUserSubject.value?.type_user || null;
  }

  isAcheteur(): boolean {
    return this.getUserType() === 'ACHETEUR';
  }

  isBoutique(): boolean {
    return this.getUserType() === 'BOUTIQUE';
  }

  isAdmin(): boolean {
    return this.getUserType() === 'ADMIN';
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est en marche.';
    } else if (error.status === 401) {
      errorMessage = 'Email ou mot de passe incorrect';
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Données invalides';
    } else if (error.status === 500) {
      errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
    }

    return throwError(() => new Error(errorMessage));
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}