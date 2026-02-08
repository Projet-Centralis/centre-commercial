import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:5000/api/boutiques';

  private getHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // GET ALL - Récupérer toutes les boutiques
  getAllBoutiques(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // ADD FAVORI - Ajouter une boutique aux favoris
  addFavori(boutiqueId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/favoris/${boutiqueId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // DELETE FAVORI - Retirer une boutique des favoris
  deleteFavori(boutiqueId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/favoris/${boutiqueId}`,
      { headers: this.getHeaders() }
    );
  }

  // GET USER FAVORI - Récupérer les favoris de l'utilisateur
  getUserFavoris(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/favoris`,
      { headers: this.getHeaders() }
    );
  }

  // GET NOMBRE FAVORIS BOUTIQUE - Récupérer le nombre de favoris d'une boutique
  getNombreFavorisBoutique(boutiqueId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/favoris/count/${boutiqueId}`,
      { headers: this.getHeaders() }
    );
  }
}
