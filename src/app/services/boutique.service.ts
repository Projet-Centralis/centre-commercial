import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/boutiques';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODM4N2ZmMjVkMDhkMmNiMDg4YWQwNyIsImVtYWlsIjoiaWZhbGlhbmFAdGVzdC5jb20iLCJ0eXBlX3VzZXIiOiJBRE1JTiIsImlhdCI6MTc3MDIyNzcxMSwiZXhwIjoxNzcwMzE0MTExfQ.HB2p5MpCzHu40yPPPFNlMfnjcdY1gXgOaybcuT5zfTk`
    });
  }

  // GET ALL - Récupérer toutes les boutiques
  getAllBoutiques(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
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