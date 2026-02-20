// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';

// export interface Event {
//   _id: string;
//   boutique: string;
//   titre: string;
//   description: string;
//   date_debut: string;
//   date_fin: string;
//   statut: 'en attente' | 'valide' | 'rejete' | 'termine';
//   capacite_max: number;
//   participants?: number;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface CreateEventDto {
//   titre: string;
//   description: string;
//   date_debut: string;
//   date_fin: string;
//   capacite_max: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class EventService {
//   private http = inject(HttpClient);
//   private apiUrl = `${environment.apiUrl}`;

//   // Récupérer tous les événements (pour les acheteurs)
//   getAllEvents(): Observable<Event[]> {
//     return this.http.get<Event[]>(`${this.apiUrl}/events`);
//   }

//   // Récupérer les événements d'une boutique
//   getBoutiqueEvents(): Observable<Event[]> {
//     return this.http.get<Event[]>(`${this.apiUrl}/events`);
//   }

//   // Créer un nouvel événement
//   createEvent(eventData: CreateEventDto): Observable<Event> {
//     return this.http.post<Event>(`${this.apiUrl}/events`, eventData);
//   }

//   // Mettre à jour un événement
//   updateEvent(id: string, eventData: Partial<CreateEventDto>): Observable<Event> {
//     return this.http.put<Event>(`${this.apiUrl}/${id}`, eventData);
//   }

//   // Supprimer un événement
//   deleteEvent(id: string): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/${id}`);
//   }

//   // Valider un événement (admin)
//   validateEvent(id: string): Observable<Event> {
//     return this.http.put<Event>(`${this.apiUrl}/${id}/valider`, {});
//   }

//   // Récupérer les participants d'un événement
//   getEventParticipants(id: string): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/${id}/participants`);
//   }
// }

import { Injectable, inject } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


export interface Event {
  _id: string;
  boutique: {
    _id: string;
    nom_boutique: string;
    logo?: string;
    description?: string;
  };
  user: {
    _id: string;
    email: string;
  };
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
  statut: 'en attente' | 'valide' | 'rejete' | 'termine';
  capacite_max: number;
  participants?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventDto {
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
  capacite_max: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/events`;

  // Récupérer tous les événements (pour les acheteurs)
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }
  private getHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // Récupérer les événements d'une boutique
  getBoutiqueEvents(): Observable<ApiResponse<Event[]>> {
    return this.http.get<ApiResponse<Event[]>>(`${this.apiUrl}/boutique`).pipe(
      tap(response => console.log('Réponse événements boutique:', response)),
      catchError(error => {
        console.error('Erreur récupération événements boutique:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion au serveur',
          data: []
        });
      })
    );
  }

  // Créer un nouvel événement
  createEvent(eventData: CreateEventDto): Observable<ApiResponse<Event>> {
    return this.http.post<ApiResponse<Event>>(this.apiUrl, eventData).pipe(
      tap(response => console.log('Réponse création événement:', response)),
      catchError(error => {
        console.error('Erreur création événement:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors de la création'
        });
      })
    );
  }

  // Mettre à jour un événement
  updateEvent(id: string, eventData: Partial<CreateEventDto>): Observable<ApiResponse<Event>> {
    return this.http.put<ApiResponse<Event>>(`${this.apiUrl}/${id}`, eventData).pipe(
      catchError(error => {
        console.error('Erreur mise à jour événement:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors de la mise à jour'
        });
      })
    );
  }

  // Supprimer un événement
  deleteEvent(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Erreur suppression événement:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors de la suppression'
        });
      })
    );
  }

  // Valider un événement (admin)
  validateEvent(id: string): Observable<ApiResponse<Event>> {
    return this.http.put<ApiResponse<Event>>(`${this.apiUrl}/${id}/valider`, {}).pipe(
      catchError(error => {
        console.error('Erreur validation événement:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors de la validation'
        });
      })
    );
  }
   // Rejeter un événement (admin)
  rejeterEvent(id: string): Observable<ApiResponse<Event>> {
    return this.http.put<ApiResponse<Event>>(`${this.apiUrl}/${id}/rejeter`, {}).pipe(
      catchError(error => {
        console.error('Erreur rejet événement:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors du rejet'
        });
      })
    );
  }
  // Récupérer tous les événements valides
  getEventsValide(): Observable<any> {
    return this.http.get(`${this.apiUrl}/events_valide`, {
      headers: this.getHeaders()
    });
  }
  getEventsNonValide(): Observable<any> {
    return this.http.get(`${this.apiUrl}/non_valide`, {
      headers: this.getHeaders()
    });
  }
  // Récupérer les événements de l'utilisateur
  getMyEvents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-events`, {
      headers: this.getHeaders()
    });
  }
   // Récupérer les événements de l'utilisateur
  getcapaciterestante(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/capacite-restante`, {
      headers: this.getHeaders()
    });
  }
  // Participer à un événement
  registerToEvent(eventId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${eventId}/register`,
      {},
      { headers: this.getHeaders() }
    );
  }
}