// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable, inject } from '@angular/core';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProduitService {
  
//     private http = inject(HttpClient);
//     private apiUrl = 'http://localhost:5000/api/produits';
  
//     private getHeaders(): HttpHeaders {
//       const token = localStorage.getItem('token');
//       return new HttpHeaders({
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODM4N2ZmMjVkMDhkMmNiMDg4YWQwNyIsImVtYWlsIjoiaWZhbGlhbmFAdGVzdC5jb20iLCJ0eXBlX3VzZXIiOiJBRE1JTiIsImlhdCI6MTc3MDIyNzcxMSwiZXhwIjoxNzcwMzE0MTExfQ.HB2p5MpCzHu40yPPPFNlMfnjcdY1gXgOaybcuT5zfTk`
//       });
//     }
  
//     // GET produit par boutiques
//     getProductsBoutique(boutiqueId: string): Observable<any> {
//       return this.http.get(`${this.apiUrl}/boutique/${boutiqueId}`, { headers: this.getHeaders() });
//     }


//   constructor() { }
// }

// import { Injectable, inject } from '@angular/core';
// import { HttpClient,  HttpHeaders } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';
// import { environment } from '../../environments/environment';

// export interface Produit {
//   _id: string;
//   boutique: string;
//   categorie: string | Categorie;
//   nom_produit: string;
//   description: string;
//   prix: number;
//   prix_promotionnel?: number;
//   quantite_stock: number;
//   seuil_alerte_stock: number;
//   images: string[];
//   est_actif: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface Categorie {
//   _id: string;
//   nom: string;
//   description?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface Stock {
//   _id: string;
//   produit: string | Produit;
//   emplacement: string;
//   quantite: number;
//   date_derniere_entree?: string;
//   date_deriere_sortie?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface CreateProduitDto {
//   categorie: string;
//   nom_produit: string;
//   description: string;
//   prix: number;
//   prix_promotionnel?: number;
//   quantite_stock: number;
//   seuil_alerte_stock: number;
//   images: string[];
// }

// export interface UpdateStockDto {
//   emplacement: string;
//   quantite: number;
//   operation: 'entree' | 'sortie';
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message?: string;
//   data?: T;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class ProduitService {
//   private http = inject(HttpClient);
//   private apiUrl = `${environment.apiUrl}/produits`;
//   private categoriesUrl = `${environment.apiUrl}/categories`;
//   private stocksUrl = `${environment.apiUrl}/stocks`;

//   // ========== PRODUITS ==========
//   getProduitsBoutique(): Observable<ApiResponse<Produit[]>> {
//     return this.http.get<ApiResponse<Produit[]>>(`${this.apiUrl}/boutique`).pipe(
//       catchError(error => {
//         console.error('Erreur récupération produits:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur de connexion',
//           data: []
//         });
//       })
//     );
//   }


  
//     private getHeaders(): HttpHeaders {
//       const token = localStorage.getItem('token');
//       return new HttpHeaders({
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODM4N2ZmMjVkMDhkMmNiMDg4YWQwNyIsImVtYWlsIjoiaWZhbGlhbmFAdGVzdC5jb20iLCJ0eXBlX3VzZXIiOiJBRE1JTiIsImlhdCI6MTc3MDIyNzcxMSwiZXhwIjoxNzcwMzE0MTExfQ.HB2p5MpCzHu40yPPPFNlMfnjcdY1gXgOaybcuT5zfTk`
//       });
//     }
//       getProductsBoutique(boutiqueId: string): Observable<any> {
//       return this.http.get(`${this.apiUrl}/boutique/${boutiqueId}`, { headers: this.getHeaders() });
//     }

//   createProduit(produitData: CreateProduitDto): Observable<ApiResponse<Produit>> {
//     return this.http.post<ApiResponse<Produit>>(this.apiUrl, produitData).pipe(
//       catchError(error => {
//         console.error('Erreur création produit:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur lors de la création'
//         });
//       })
//     );
//   }

//   updateProduit(id: string, produitData: Partial<CreateProduitDto>): Observable<ApiResponse<Produit>> {
//     return this.http.put<ApiResponse<Produit>>(`${this.apiUrl}/${id}`, produitData).pipe(
//       catchError(error => {
//         console.error('Erreur mise à jour produit:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur lors de la mise à jour'
//         });
//       })
//     );
//   }

//   deleteProduit(id: string): Observable<ApiResponse<void>> {
//     return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
//       catchError(error => {
//         console.error('Erreur suppression produit:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur lors de la suppression'
//         });
//       })
//     );
//   }

//   toggleProduitStatus(id: string, estActif: boolean): Observable<ApiResponse<Produit>> {
//     return this.http.patch<ApiResponse<Produit>>(`${this.apiUrl}/${id}/status`, { est_actif: estActif }).pipe(
//       catchError(error => {
//         console.error('Erreur changement statut produit:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur lors du changement de statut'
//         });
//       })
//     );
//   }

//   // ========== CATÉGORIES ==========
//   getCategories(): Observable<ApiResponse<Categorie[]>> {
//     return this.http.get<ApiResponse<Categorie[]>>(this.categoriesUrl).pipe(
//       catchError(error => {
//         console.error('Erreur récupération catégories:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur de connexion',
//           data: []
//         });
//       })
//     );
//   }

//   createCategorie(categorieData: { nom: string; description?: string }): Observable<ApiResponse<Categorie>> {
//     return this.http.post<ApiResponse<Categorie>>(this.categoriesUrl, categorieData).pipe(
//       catchError(error => {
//         console.error('Erreur création catégorie:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur lors de la création'
//         });
//       })
//     );
//   }

//   // ========== STOCKS ==========
//   getStocksProduit(produitId: string): Observable<ApiResponse<Stock[]>> {
//     return this.http.get<ApiResponse<Stock[]>>(`${this.stocksUrl}/produit/${produitId}`).pipe(
//       catchError(error => {
//         console.error('Erreur récupération stocks:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur de connexion',
//           data: []
//         });
//       })
//     );
//   }

//   updateStock(stockId: string, stockData: UpdateStockDto): Observable<ApiResponse<Stock>> {
//     return this.http.put<ApiResponse<Stock>>(`${this.stocksUrl}/${stockId}`, stockData).pipe(
//       catchError(error => {
//         console.error('Erreur mise à jour stock:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur lors de la mise à jour'
//         });
//       })
//     );
//   }

//   addStock(produitId: string, stockData: Omit<UpdateStockDto, 'operation'>): Observable<ApiResponse<Stock>> {
//     return this.http.post<ApiResponse<Stock>>(`${this.stocksUrl}/produit/${produitId}`, stockData).pipe(
//       catchError(error => {
//         console.error('Erreur ajout stock:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur lors de l\'ajout'
//         });
//       })
//     );
//   }

//   // ========== UTILITAIRES ==========
//   getProduitImage(images: string[]): string {
//     if (images && images.length > 0) {
//       // Si l'image commence par /, c'est une URL relative
//       return images[0].startsWith('/') ? images[0] : `/${images[0]}`;
//     }
//     return '/assets/images/default-product.png';
//   }

//   formatPrice(prix: number): string {
//     return prix.toLocaleString('fr-FR', {
//       style: 'currency',
//       currency: 'EUR',
//       minimumFractionDigits: 2
//     });
//   }

//   calculateReduction(prix: number, prixPromo?: number): number {
//     if (!prixPromo || prix <= 0) return 0;
//     return Math.round(((prix - prixPromo) / prix) * 100);
//   }
// }

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Produit {
  _id: string;
  boutique: string;
  categorie: string | Categorie;
  nom_produit: string;
  description: string;
  prix: number;
  prix_promotionnel?: number;
  quantite_stock: number;
  seuil_alerte_stock: number;
  images: string[];
  est_actif: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Categorie {
  _id: string;
  nom: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Stock {
  _id: string;
  produit: string | Produit | { _id: string; nom_produit: string };
  emplacement: string | Emplacement | { _id: string; nom: string; description?: string };
  quantite: number;
  date_derniere_entree?: string;
  date_deriere_sortie?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Emplacement {
  _id: string;
  nom: string;
  description?: string;
  boutique: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProduitDto {
  categorie: string;
  nom_produit: string;
  description: string;
  prix: number;
  prix_promotionnel?: number;
  quantite_stock: number;
  seuil_alerte_stock: number;
  images: string[];
}

export interface UpdateStockDto {
  emplacement: string;
  quantite: number;
  operation: 'entree' | 'sortie';
}

export interface AddStockDto {
  emplacement: string;
  quantite: number;
  operation?: 'entree' | 'sortie';
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/produits`;
  private categoriesUrl = `${environment.apiUrl}/categories`;
  private stocksUrl = `${environment.apiUrl}/stocks`;
  private emplacementsUrl = `${environment.apiUrl}/emplacements`;


  // ========== PRODUITS ==========
  getProduitsBoutique(): Observable<ApiResponse<Produit[]>> {
    return this.http.get<ApiResponse<Produit[]>>(`${this.apiUrl}/boutique`).pipe(
      map(response => ({
        ...response,
        data: response.data?.map(produit => ({
          ...produit,
          categorie: typeof produit.categorie === 'string' ? { _id: produit.categorie, nom: '' } : produit.categorie
        }))
      })),
      catchError(error => {
        console.error('Erreur récupération produits:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion',
          data: []
        });
      })
    );
  }

 
  createProduit(produitData: Partial<CreateProduitDto>): Observable<ApiResponse<Produit>> {
    return this.http.post<ApiResponse<Produit>>(this.apiUrl, produitData).pipe(
      catchError(error => {
        console.error('Erreur création produit:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors de la création'
        });
      })
    );
  }

  updateProduit(id: string, produitData: Partial<CreateProduitDto>): Observable<ApiResponse<Produit>> {
    return this.http.put<ApiResponse<Produit>>(`${this.apiUrl}/${id}`, produitData).pipe(
      catchError(error => {
        console.error('Erreur mise à jour produit:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors de la mise à jour'
        });
      })
    );
  }

  deleteProduit(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Erreur suppression produit:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors de la suppression'
        });
      })
    );
  }

  toggleProduitStatus(id: string, estActif: boolean): Observable<ApiResponse<Produit>> {
    return this.http.patch<ApiResponse<Produit>>(`${this.apiUrl}/${id}/status`, { est_actif: estActif }).pipe(
      catchError(error => {
        console.error('Erreur changement statut produit:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors du changement de statut'
        });
      })
    );
  }

  // ========== CATÉGORIES ==========
  getCategories(): Observable<ApiResponse<Categorie[]>> {
    return this.http.get<ApiResponse<Categorie[]>>(this.categoriesUrl).pipe(
      catchError(error => {
        console.error('Erreur récupération catégories:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion',
          data: []
        });
      })
    );
  }

  // ========== EMPLACEMENTS ==========
  getEmplacements(): Observable<ApiResponse<Emplacement[]>> {
    return this.http.get<ApiResponse<Emplacement[]>>(this.emplacementsUrl).pipe(
      catchError(error => {
        console.error('Erreur récupération emplacements:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion',
          data: []
        });
      })
    );
  }

  // ========== STOCKS ==========
  getStocksProduit(produitId: string): Observable<ApiResponse<Stock[]>> {
    return this.http.get<ApiResponse<Stock[]>>(`${this.stocksUrl}/produit/${produitId}`).pipe(
      catchError(error => {
        console.error('Erreur récupération stocks:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion',
          data: []
        });
      })
    );
  }

  updateStock(stockId: string, stockData: UpdateStockDto): Observable<ApiResponse<Stock>> {
    return this.http.put<ApiResponse<Stock>>(`${this.stocksUrl}/${stockId}`, stockData).pipe(
      catchError(error => {
        console.error('Erreur mise à jour stock:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors de la mise à jour'
        });
      })
    );
  }

  addStock(produitId: string, stockData: AddStockDto): Observable<ApiResponse<Stock>> {
    return this.http.post<ApiResponse<Stock>>(`${this.stocksUrl}/produit/${produitId}`, stockData).pipe(
      catchError(error => {
        console.error('Erreur ajout stock:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors de l\'ajout'
        });
      })
    );
  }

  deleteStock(stockId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.stocksUrl}/${stockId}`).pipe(
      catchError(error => {
        console.error('Erreur suppression stock:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors de la suppression'
        });
      })
    );
  }

  // ========== UTILITAIRES ==========
  getProduitImage(images: string[]): string {
    if (images && images.length > 0) {
      // Si l'image commence par /, c'est une URL relative
      return images[0].startsWith('/') ? images[0] : `/${images[0]}`;
    }
    return '/assets/images/default-product.png';
  }

  formatPrice(prix: number): string {
    return prix.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    });
  }

  calculateReduction(prix: number, prixPromo?: number): number {
    if (!prixPromo || prix <= 0) return 0;
    return Math.round(((prix - prixPromo) / prix) * 100);
  }

  getStockStatus(quantite: number, seuil: number): string {
    if (quantite === 0) return 'rupture';
    if (quantite <= seuil) return 'alerte';
    return 'normal';
  }

  getStockStatusColor(quantite: number, seuil: number): string {
    const status = this.getStockStatus(quantite, seuil);
    switch(status) {
      case 'rupture': return '#ff6b6b';
      case 'alerte': return '#ffd93d';
      default: return '#32bcae';
    }
  }

  getStockStatusText(quantite: number, seuil: number): string {
    const status = this.getStockStatus(quantite, seuil);
    switch(status) {
      case 'rupture': return 'Rupture';
      case 'alerte': return 'Stock faible';
      default: return 'En stock';
    }
  }

  // Méthodes helper pour extraire les noms des objets populés
  getProduitNom(stock: Stock): string {
    if (typeof stock.produit === 'string') {
      return stock.produit;
    }
    if ('nom_produit' in stock.produit) {
      return stock.produit.nom_produit;
    }
    return 'Produit inconnu';
  }

  getEmplacementNom(stock: Stock): string {
    if (typeof stock.emplacement === 'string') {
      return stock.emplacement;
    }
    if ('nom' in stock.emplacement) {
      return stock.emplacement.nom;
    }
    return 'Emplacement inconnu';
  }

  // Nouvelle méthode pour le type-safe
  isProduitObject(obj: any): obj is Produit {
    return obj && typeof obj === 'object' && 'nom_produit' in obj && 'prix' in obj;
  }

  isEmplacementObject(obj: any): obj is Emplacement {
    return obj && typeof obj === 'object' && 'nom' in obj && 'boutique' in obj;
  }
}