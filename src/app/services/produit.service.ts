import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5000/api/produits';
  
    private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('token');
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODM4N2ZmMjVkMDhkMmNiMDg4YWQwNyIsImVtYWlsIjoiaWZhbGlhbmFAdGVzdC5jb20iLCJ0eXBlX3VzZXIiOiJBRE1JTiIsImlhdCI6MTc3MDIyNzcxMSwiZXhwIjoxNzcwMzE0MTExfQ.HB2p5MpCzHu40yPPPFNlMfnjcdY1gXgOaybcuT5zfTk`
      });
    }
  
    // GET produit par boutiques
    getProductsBoutique(boutiqueId: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/boutique/${boutiqueId}`, { headers: this.getHeaders() });
    }


  constructor() { }
}
