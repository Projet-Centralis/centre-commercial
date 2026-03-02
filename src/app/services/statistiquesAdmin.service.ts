import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

/* =========================
   TOP VENTES
========================= */
export interface TopVente {
  _id: string;
  totalQuantite: number;
  totalCA: number;
  boutiqueId: string;
  nom_boutique: string;
  email: string;
}

/* =========================
   LOYERS IMPAYÉS
========================= */
export interface LoyerImpaye {
  _id: string; // boutique id
  totalImpaye: number;
  nombreMoisImpayes: number;
  moisPlusAncien: string;
  dernierMoisImpaye: string;
}

/* =========================
   CA GLOBAL
========================= */
export interface CAGlobal {
  _id: null;
  caTotal: number;
  nombreVentes: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatistiquesAdminService {

  private http = inject(HttpClient);

  private apiUrlAdmin = `${environment.apiUrl}/stat_admin`;


  /* =========================
     TOP VENTES
  ========================= */
  getTopVentes(): Observable<ApiResponse<TopVente[]>> {
    return this.http
      .get<ApiResponse<TopVente[]>>(
        `${this.apiUrlAdmin}/top-ventes`
      )
      .pipe(
        catchError(error => {
          console.error('Erreur top ventes:', error);
          return of({
            success: false,
            message: 'Impossible de récupérer les top ventes'
          });
        })
      );
  }

  /* =========================
     LOYERS IMPAYÉS
  ========================= */
  getLoyersImpayes(): Observable<ApiResponse<LoyerImpaye[]>> {
    return this.http
      .get<ApiResponse<LoyerImpaye[]>>(
        `${this.apiUrlAdmin}/loyers-impayes`
      )
      .pipe(
        catchError(error => {
          console.error('Erreur loyers impayés:', error);
          return of({
            success: false,
            message: 'Impossible de récupérer les loyers impayés'
          });
        })
      );
  }

  /* =========================
     CA GLOBAL
  ========================= */
  getCAGlobal(): Observable<ApiResponse<CAGlobal>> {
    return this.http
      .get<ApiResponse<CAGlobal>>(
        `${this.apiUrlAdmin}/ca-global`
      )
      .pipe(
        catchError(error => {
          console.error('Erreur CA global:', error);
          return of({
            success: false,
            message: 'Impossible de récupérer le CA global'
          });
        })
      );
  }
}