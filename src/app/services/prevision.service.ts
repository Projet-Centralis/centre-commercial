import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Prevision {
  _id: string;
  boutique: string;
  date_prevision: Date;
  montant_prevu: number;
  probabilite: number;
  produit_concerne?: any;
  type_prevision: 'journaliere' | 'hebdomadaire' | 'mensuelle' | 'saisonniere';
  facteurs?: any;
  statut: 'en_cours' | 'atteint' | 'depasse' | 'non_atteint';
  createdAt?: string;
  updatedAt?: string;
}

export interface ChiffreAffaires {
  actuel: {
    aujourdhui: number;
    semaine: number;
    mois: number;
    annee: number;
    total: number;
  };
  prevision: {
    "30jours": number;
    croissance: number;
  };
  objectifs: {
    journalier: number;
    hebdomadaire: number;
    mensuel: number;
  };
}

export interface PrevisionGeneree {
  previsions: Array<{
    date: Date;
    montant: number;
    probabilite: number;
    type: string;
    methode: string;
    detail?: number[];
  }>;
  produitsPrometteurs: Array<{
    produitId: string;
    nom: string;
    prix: number;
    ventesPrevues: number;
    tendance: string;
    croissance: number;
  }>;
  statistiques: {
    joursAnalyse: number;
    moyenneJournaliere: number;
    meilleurJour: {
      date: string;
      montant: number;
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class PrevisionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/previsions`;

  // Récupérer toutes les prévisions
  getPrevisions(): Observable<ApiResponse<Prevision[]>> {
    return this.http.get<ApiResponse<Prevision[]>>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Erreur récupération prévisions:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion'
        });
      })
    );
  }

  // Récupérer la prévision du jour
  getPrevisionAujourdhui(): Observable<ApiResponse<Prevision>> {
    return this.http.get<ApiResponse<Prevision>>(`${this.apiUrl}/aujourdhui`).pipe(
      catchError(error => {
        console.error('Erreur récupération prévision jour:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion'
        });
      })
    );
  }

  // Récupérer les prévisions de la semaine
  getPrevisionsSemaine(): Observable<ApiResponse<Prevision[]>> {
    return this.http.get<ApiResponse<Prevision[]>>(`${this.apiUrl}/semaine`).pipe(
      catchError(error => {
        console.error('Erreur récupération prévisions semaine:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion'
        });
      })
    );
  }

  // Générer des prévisions automatiques
  genererPrevisions(): Observable<ApiResponse<PrevisionGeneree>> {
    return this.http.get<ApiResponse<PrevisionGeneree>>(`${this.apiUrl}/generer`).pipe(
      catchError(error => {
        console.error('Erreur génération prévisions:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion'
        });
      })
    );
  }

  // Récupérer le chiffre d'affaires avec prévisions
  getChiffreAffaires(): Observable<ApiResponse<ChiffreAffaires>> {
    return this.http.get<ApiResponse<ChiffreAffaires>>(`${this.apiUrl}/chiffre-affaires`).pipe(
      catchError(error => {
        console.error('Erreur récupération chiffre affaires:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion'
        });
      })
    );
  }

  // Créer une prévision manuelle
  createPrevision(previsionData: Partial<Prevision>): Observable<ApiResponse<Prevision>> {
    return this.http.post<ApiResponse<Prevision>>(this.apiUrl, previsionData).pipe(
      catchError(error => {
        console.error('Erreur création prévision:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors de la création'
        });
      })
    );
  }

  // Mettre à jour une prévision
  updatePrevision(id: string, previsionData: Partial<Prevision>): Observable<ApiResponse<Prevision>> {
    return this.http.put<ApiResponse<Prevision>>(`${this.apiUrl}/${id}`, previsionData).pipe(
      catchError(error => {
        console.error('Erreur mise à jour prévision:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors de la mise à jour'
        });
      })
    );
  }

  // Supprimer une prévision
  deletePrevision(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Erreur suppression prévision:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors de la suppression'
        });
      })
    );
  }

  // Méthodes utilitaires
  formatMontant(montant: number): string {
    return montant.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    });
  }

  getProbabiliteColor(probabilite: number): string {
    if (probabilite >= 80) return '#32bcae';
    if (probabilite >= 50) return '#ffd93d';
    return '#ff6b6b';
  }

  getStatutText(statut: string): string {
    switch(statut) {
      case 'en_cours': return 'En cours';
      case 'atteint': return 'Atteint';
      case 'depasse': return 'Dépassé';
      case 'non_atteint': return 'Non atteint';
      default: return statut;
    }
  }

  getStatutColor(statut: string): string {
    switch(statut) {
      case 'en_cours': return '#ffd93d';
      case 'atteint': return '#32bcae';
      case 'depasse': return '#32bcae';
      case 'non_atteint': return '#ff6b6b';
      default: return '#13514b';
    }
  }
}