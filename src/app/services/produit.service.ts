import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:5000/api/produits';

  private getHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // GET produit par boutiques
  getProductsBoutique(boutiqueId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/boutique/${boutiqueId}`, { headers: this.getHeaders() });
  }


  constructor() { }
}
