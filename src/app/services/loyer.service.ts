import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ContratLoyer {
  _id: string;
  boutique: any;
  montant_mensuel: number;
  jour_echeance: number;
  date_debut: Date;
  date_fin: Date;
  is_active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaiementLoyer {
  _id: string;
  contrat: string | ContratLoyer;
  boutique: string | any;
  mois: Date;
  montant_du: number;
  montant_paye: number;
  statut: 'paye' | 'en_attente' | 'retard' | 'annule';
  createdAt?: string;
  updatedAt?: string;
}

export interface StatistiquesLoyer {
  contratActif: ContratLoyer | null;
  totalPaye: number;
  totalAttente: number;
  paiementsEnRetard: number;
  historiqueMensuel: Array<{
    _id: { annee: number; mois: number };
    total: number;
    nombre: number;
  }>;
}

export interface EcheanceLoyer {
  contrat: string;
  boutique: any;
  montant: number;
  date_echeance: Date;
  jours_restants: number;
  statut: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class LoyerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/loyers`;

  // ========== CONTRATS ==========
  getContrats(): Observable<ApiResponse<ContratLoyer[]>> {
    return this.http.get<ApiResponse<ContratLoyer[]>>(`${this.apiUrl}/contrats`).pipe(
      catchError(error => {
        console.error('Erreur récupération contrats:', error);
        return of({ success: false, message: error.error?.message || 'Erreur de connexion' });
      })
    );
  }

  getContratActif(): Observable<ApiResponse<ContratLoyer>> {
    return this.http.get<ApiResponse<ContratLoyer>>(`${this.apiUrl}/contrat/actif`).pipe(
      catchError(error => {
        console.error('Erreur récupération contrat actif:', error);
        return of({ success: false, message: error.error?.message || 'Erreur de connexion' });
      })
    );
  }

  getContrat(id: string): Observable<ApiResponse<ContratLoyer>> {
    return this.http.get<ApiResponse<ContratLoyer>>(`${this.apiUrl}/contrats/${id}`).pipe(
      catchError(error => {
        console.error('Erreur récupération contrat:', error);
        return of({ success: false, message: error.error?.message || 'Erreur de connexion' });
      })
    );
  }

  createContrat(contratData: Partial<ContratLoyer>): Observable<ApiResponse<ContratLoyer>> {
    return this.http.post<ApiResponse<ContratLoyer>>(`${this.apiUrl}/contrats`, contratData).pipe(
      catchError(error => {
        console.error('Erreur création contrat:', error);
        return of({ success: false, message: error.error?.message || 'Erreur lors de la création' });
      })
    );
  }

  updateContrat(id: string, contratData: Partial<ContratLoyer>): Observable<ApiResponse<ContratLoyer>> {
    return this.http.put<ApiResponse<ContratLoyer>>(`${this.apiUrl}/contrats/${id}`, contratData).pipe(
      catchError(error => {
        console.error('Erreur mise à jour contrat:', error);
        return of({ success: false, message: error.error?.message || 'Erreur lors de la mise à jour' });
      })
    );
  }

  deleteContrat(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/contrats/${id}`).pipe(
      catchError(error => {
        console.error('Erreur suppression contrat:', error);
        return of({ success: false, message: error.error?.message || 'Erreur lors de la suppression' });
      })
    );
  }

  // ========== PAIEMENTS ==========
  getPaiements(): Observable<ApiResponse<PaiementLoyer[]>> {
    return this.http.get<ApiResponse<PaiementLoyer[]>>(`${this.apiUrl}/paiements`).pipe(
      catchError(error => {
        console.error('Erreur récupération paiements:', error);
        return of({ success: false, message: error.error?.message || 'Erreur de connexion' });
      })
    );
  }

  getPaiementsContrat(contratId: string): Observable<ApiResponse<PaiementLoyer[]>> {
    return this.http.get<ApiResponse<PaiementLoyer[]>>(`${this.apiUrl}/paiements/contrat/${contratId}`).pipe(
      catchError(error => {
        console.error('Erreur récupération paiements contrat:', error);
        return of({ success: false, message: error.error?.message || 'Erreur de connexion' });
      })
    );
  }

  getPaiement(id: string): Observable<ApiResponse<PaiementLoyer>> {
    return this.http.get<ApiResponse<PaiementLoyer>>(`${this.apiUrl}/paiements/${id}`).pipe(
      catchError(error => {
        console.error('Erreur récupération paiement:', error);
        return of({ success: false, message: error.error?.message || 'Erreur de connexion' });
      })
    );
  }

  createPaiement(paiementData: Partial<PaiementLoyer>): Observable<ApiResponse<PaiementLoyer>> {
    return this.http.post<ApiResponse<PaiementLoyer>>(`${this.apiUrl}/paiements`, paiementData).pipe(
      catchError(error => {
        console.error('Erreur création paiement:', error);
        return of({ success: false, message: error.error?.message || 'Erreur lors de la création' });
      })
    );
  }

  updatePaiement(id: string, paiementData: Partial<PaiementLoyer>): Observable<ApiResponse<PaiementLoyer>> {
    return this.http.put<ApiResponse<PaiementLoyer>>(`${this.apiUrl}/paiements/${id}`, paiementData).pipe(
      catchError(error => {
        console.error('Erreur mise à jour paiement:', error);
        return of({ success: false, message: error.error?.message || 'Erreur lors de la mise à jour' });
      })
    );
  }

  deletePaiement(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/paiements/${id}`).pipe(
      catchError(error => {
        console.error('Erreur suppression paiement:', error);
        return of({ success: false, message: error.error?.message || 'Erreur lors de la suppression' });
      })
    );
  }

  // ========== STATISTIQUES ==========
  getStatistiques(): Observable<ApiResponse<StatistiquesLoyer>> {
    return this.http.get<ApiResponse<StatistiquesLoyer>>(`${this.apiUrl}/statistiques`).pipe(
      catchError(error => {
        console.error('Erreur récupération statistiques:', error);
        return of({ success: false, message: error.error?.message || 'Erreur de connexion' });
      })
    );
  }

  // ========== ÉCHÉANCES ==========
  getEcheances(): Observable<ApiResponse<EcheanceLoyer[]>> {
    return this.http.get<ApiResponse<EcheanceLoyer[]>>(`${this.apiUrl}/echeances`).pipe(
      catchError(error => {
        console.error('Erreur récupération échéances:', error);
        return of({ success: false, message: error.error?.message || 'Erreur de connexion' });
      })
    );
  }

  // ========== FACTURES ==========
  telechargerFacture(paiementId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/facture/${paiementId}`, {
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error('Erreur téléchargement facture:', error);
        throw error;
      })
    );
  }

  // Ajoutez ces méthodes dans la classe LoyerService

// ========== ROUTES ADMIN ==========
getAdminContrats(): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/admin/contrats`).pipe(
    catchError(error => {
      console.error('Erreur récupération contrats admin:', error);
      return of({ success: false, message: error.error?.message || 'Erreur de connexion' });
    })
  );
}

getAdminBoutiqueDetails(boutiqueId: string): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(`${this.apiUrl}/admin/boutique/${boutiqueId}`).pipe(
    catchError(error => {
      console.error('Erreur récupération détails boutique:', error);
      return of({ success: false, message: error.error?.message || 'Erreur de connexion' });
    })
  );
}

validerPaiement(paiementId: string): Observable<ApiResponse<PaiementLoyer>> {
  return this.http.put<ApiResponse<PaiementLoyer>>(`${this.apiUrl}/paiements/${paiementId}/valider`, {}).pipe(
    catchError(error => {
      console.error('Erreur validation paiement:', error);
      return of({ success: false, message: error.error?.message || 'Erreur lors de la validation' });
    })
  );
}

createPaiementAdmin(paiementData: any): Observable<ApiResponse<PaiementLoyer>> {
  return this.http.post<ApiResponse<PaiementLoyer>>(`${this.apiUrl}/admin/paiements`, paiementData).pipe(
    catchError(error => {
      console.error('Erreur création paiement admin:', error);
      return of({ success: false, message: error.error?.message || 'Erreur lors de la création' });
    })
  );
}

// ========== NOUVELLES MÉTHODES POUR LES BOUTIQUES ==========
getTotalAnnuel(contrat: ContratLoyer, paiements: PaiementLoyer[]): number {
  if (!contrat) return 0;
  return contrat.montant_mensuel * 12;
}

getMoisRestants(contrat: ContratLoyer, paiements: PaiementLoyer[]): number {
  if (!contrat) return 0;
  
  const dateDebut = new Date(contrat.date_debut);
  const dateFin = new Date(contrat.date_fin);
  const aujourdhui = new Date();
  
  // Mois total du contrat
  const moisTotal = (dateFin.getFullYear() - dateDebut.getFullYear()) * 12 + 
                    (dateFin.getMonth() - dateDebut.getMonth());
  
  // Mois déjà payés
  const moisPayes = paiements.filter(p => p.statut === 'paye').length;
  
  return Math.max(0, moisTotal - moisPayes);
}

getMoisPayes(contrat: ContratLoyer, paiements: PaiementLoyer[]): number {
  return paiements.filter(p => p.statut === 'paye').length;
}

getProgressionContrat(contrat: ContratLoyer, paiements: PaiementLoyer[]): number {
  if (!contrat) return 0;
  
  const dateDebut = new Date(contrat.date_debut);
  const dateFin = new Date(contrat.date_fin);
  
  const moisTotal = (dateFin.getFullYear() - dateDebut.getFullYear()) * 12 + 
                    (dateFin.getMonth() - dateDebut.getMonth());
  
  const moisPayes = this.getMoisPayes(contrat, paiements);
  
  return moisTotal > 0 ? Math.round((moisPayes / moisTotal) * 100) : 0;
}

  // ========== UTILITAIRES ==========
  getStatutText(statut: string): string {
    switch(statut) {
      case 'paye': return 'Payé';
      case 'en_attente': return 'En attente';
      case 'retard': return 'En retard';
      case 'annule': return 'Annulé';
      default: return statut;
    }
  }


  getStatutColor(statut: string): string {
    switch(statut) {
      case 'paye': return '#32bcae';
      case 'en_attente': return '#ffd93d';
      case 'retard': return '#ff6b6b';
      case 'annule': return '#13514b';
      default: return '#666';
    }
  }

  formatMontant(montant: number): string {
    return montant.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    });
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatMois(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  }
}