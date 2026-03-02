import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface VenteJournaliere {
  date: string;
  montant: number;
  nombreVentes: number;
}

export interface ProduitPopulaire {
  _id?: string;
  nom: string;
  categorie: string;
  ventes: number;
  revenu: number;
  tendance: 'up' | 'down' | 'stable';
}

export interface StatistiquesVentes {
  ventesTotales: {
    quantite: number;
    montant: number;
  };
  ventesAujourdhui: {
    quantite: number;
    montant: number;
  };
  ventesJournalieres: VenteJournaliere[];
  produitsPopulaires: ProduitPopulaire[];
  nombreClients: number;
  nouveauxClients: number;
  tauxConversion: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/statistiques`;

  getVentesStats(): Observable<ApiResponse<StatistiquesVentes>> {
    return this.http.get<ApiResponse<StatistiquesVentes>>(`${this.apiUrl}/ventes`).pipe(
      catchError(error => {
        console.error('Erreur récupération statistiques:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion'
        });
      })
    );
  }
}