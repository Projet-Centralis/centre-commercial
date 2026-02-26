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

// import { Injectable, inject } from '@angular/core';
// import { HttpClient,HttpHeaders  } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';
// import { environment } from '../../environments/environment';
// import { AuthService } from './auth.service';


// export interface Event {
//   _id: string;
//   boutique: {
//     _id: string;
//     nom_boutique: string;
//     logo?: string;
//     description?: string;
//   };
//   user: {
//     _id: string;
//     email: string;
//   };
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

// export interface ApiResponse<T> {
//   success: boolean;
//   message?: string;
//   data?: T;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class EventService {
//   private http = inject(HttpClient);
//   private authService = inject(AuthService);
//   private apiUrl = `${environment.apiUrl}/events`;

//   // Récupérer tous les événements (pour les acheteurs)
//   getAllEvents(): Observable<Event[]> {
//     return this.http.get<Event[]>(this.apiUrl);
//   }
//   private getHeaders(): HttpHeaders {
//     return this.authService.getAuthHeaders();
//   }

//   // Récupérer les événements d'une boutique
//   getBoutiqueEvents(): Observable<ApiResponse<Event[]>> {
//     return this.http.get<ApiResponse<Event[]>>(`${this.apiUrl}/boutique`).pipe(
//       tap(response => console.log('Réponse événements boutique:', response)),
//       catchError(error => {
//         console.error('Erreur récupération événements boutique:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur de connexion au serveur',
//           data: []
//         });
//       })
//     );
//   }

//   // Créer un nouvel événement
//   createEvent(eventData: CreateEventDto): Observable<ApiResponse<Event>> {
//     return this.http.post<ApiResponse<Event>>(this.apiUrl, eventData).pipe(
//       tap(response => console.log('Réponse création événement:', response)),
//       catchError(error => {
//         console.error('Erreur création événement:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur lors de la création'
//         });
//       })
//     );
//   }

//   // Mettre à jour un événement
//   updateEvent(id: string, eventData: Partial<CreateEventDto>): Observable<ApiResponse<Event>> {
//     return this.http.put<ApiResponse<Event>>(`${this.apiUrl}/${id}`, eventData).pipe(
//       catchError(error => {
//         console.error('Erreur mise à jour événement:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur lors de la mise à jour'
//         });
//       })
//     );
//   }

//   // Supprimer un événement
//   deleteEvent(id: string): Observable<ApiResponse<void>> {
//     return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
//       catchError(error => {
//         console.error('Erreur suppression événement:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur lors de la suppression'
//         });
//       })
//     );
//   }

//   // Valider un événement (admin)
//   validateEvent(id: string): Observable<ApiResponse<Event>> {
//     return this.http.put<ApiResponse<Event>>(`${this.apiUrl}/${id}/valider`, {}).pipe(
//       catchError(error => {
//         console.error('Erreur validation événement:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur lors de la validation'
//         });
//       })
//     );
//   }
//    // Rejeter un événement (admin)
//   rejeterEvent(id: string): Observable<ApiResponse<Event>> {
//     return this.http.put<ApiResponse<Event>>(`${this.apiUrl}/${id}/rejeter`, {}).pipe(
//       catchError(error => {
//         console.error('Erreur rejet événement:', error);
//         return of({
//           success: false,
//           message: error.error?.message || 'Erreur lors du rejet'
//         });
//       })
//     );
//   }
//   // Récupérer tous les événements valides
//   getEventsValide(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/events_valide`, {
//       headers: this.getHeaders()
//     });
//   }
//   getEventsNonValide(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/non_valide`, {
//       headers: this.getHeaders()
//     });
//   }
//   // Récupérer les événements de l'utilisateur
//   getMyEvents(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/my-events`, {
//       headers: this.getHeaders()
//     });
//   }
//    // Récupérer les événements de l'utilisateur
//   getcapaciterestante(id: string): Observable<any> {
//     return this.http.get(`${this.apiUrl}/${id}/capacite-restante`, {
//       headers: this.getHeaders()
//     });
//   }
//   // Participer à un événement
//   registerToEvent(eventId: string): Observable<any> {
//     return this.http.post(
//       `${this.apiUrl}/${eventId}/register`,
//       {},
//       { headers: this.getHeaders() }
//     );
//   }
// }

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Event {
  _id: string;
  boutique: any;
  createdBy?: any;
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
  statut: 'en_attente' | 'valide' | 'rejete' | 'termine';
  capacite_max: number;
  participants?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventDetails {
  event: Event;
  statistiques: {
    nombre_inscrits: number;
    places_restantes: number;
    taux_remplissage: number;
  };
  participants: Array<{
    _id: string;
    email: string;
    date_inscription: string;
  }>;
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

  private getHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  getEventsNonValide(): Observable<Event[]> {
  return this.http.get<ApiResponse<Event[]>>(`${this.apiUrl}/non_valide`, {
    headers: this.getHeaders()
  }).pipe(
    map(response => response.data || []), // Extrait le tableau de la réponse
    catchError(error => {
      console.error('Erreur récupération événements non validés:', error);
      return of([]);
    })
  );
}

getEventsValide(): Observable<Event[]> {
  return this.http.get<ApiResponse<Event[]>>(`${this.apiUrl}/events_valide`, {
    headers: this.getHeaders()
  }).pipe(
    map(response => response.data || []), // Extrait le tableau de la réponse
    catchError(error => {
      console.error('Erreur récupération événements validés:', error);
      return of([]);
    })
  );
}

validateEvent(id: string): Observable<ApiResponse<Event>> {
  return this.http.put<ApiResponse<Event>>(`${this.apiUrl}/${id}/valider`, {}, {
    headers: this.getHeaders()
  }).pipe(
    catchError(error => {
      console.error('Erreur validation événement:', error);
      return of({ success: false, message: error.error?.message || 'Erreur lors de la validation' });
    })
  );
}

rejeterEvent(id: string): Observable<ApiResponse<Event>> {
  return this.http.put<ApiResponse<Event>>(`${this.apiUrl}/${id}/rejeter`, {}, {
    headers: this.getHeaders()
  }).pipe(
    catchError(error => {
      console.error('Erreur rejet événement:', error);
      return of({ success: false, message: error.error?.message || 'Erreur lors du rejet' });
    })
  );
}

  // ========== POUR LES ACHETEURS (PUBLIC) ==========
  
  // Récupérer tous les événements validés (public)
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Erreur récupération événements:', error);
        return of([]);
      })
    );
  }

  // // Récupérer tous les événements validés (route spécifique)
  // getEventsValide(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/events_valide`, {
  //     headers: this.getHeaders()
  //   }).pipe(
  //     catchError(error => {
  //       console.error('Erreur récupération événements validés:', error);
  //       return of({ success: false, data: [] });
  //     })
  //   );
  // }

  // // Récupérer les événements non validés (pour admin)
  // getEventsNonValide(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/non_valide`, {
  //     headers: this.getHeaders()
  //   }).pipe(
  //     catchError(error => {
  //       console.error('Erreur récupération événements non validés:', error);
  //       return of({ success: false, data: [] });
  //     })
  //   );
  // }

  // Récupérer la capacité restante d'un événement
  getcapaciterestante(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/capacite-restante`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur récupération capacité restante:', error);
        return of({ capacite_restante: 0 });
      })
    );
  }

  // Récupérer les événements de l'utilisateur connecté (ses inscriptions)
  getMyEvents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-events`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur récupération mes événements:', error);
        return of({ success: false, data: [] });
      })
    );
  }

  // Récupérer les événements auxquels l'utilisateur est inscrit
  getMyRegisteredEvents(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/mes-inscriptions`).pipe(
      catchError(error => {
        console.error('Erreur récupération inscriptions:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion'
        });
      })
    );
  }

  // Vérifier si l'utilisateur est inscrit à un événement
  checkRegistration(eventId: string): Observable<boolean> {
    return this.getMyRegisteredEvents().pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data.some((item: any) => item.event._id === eventId);
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  // ========== POUR LES BOUTIQUES ==========
  
  // Récupérer les événements de la boutique connectée
  getBoutiqueEvents(): Observable<ApiResponse<Event[]>> {
    return this.http.get<ApiResponse<Event[]>>(`${this.apiUrl}/boutique`).pipe(
      map((response: any) => {
        if (response.data) {
          return {
            success: true,
            data: response.data
          };
        }
        return response;
      }),
      catchError(error => {
        console.error('Erreur récupération événements:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion'
        });
      })
    );
  }

  // Récupérer les événements de la boutique avec participants
  getBoutiqueEventsWithParticipants(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/boutique/avec-participants`).pipe(
      catchError(error => {
        console.error('Erreur récupération événements avec participants:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion'
        });
      })
    );
  }

  // Créer un événement
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

  // ========== POUR LES DÉTAILS ==========
  
  // Récupérer les détails d'un événement avec participants
  getEventDetails(id: string): Observable<ApiResponse<EventDetails>> {
    return this.http.get<ApiResponse<EventDetails>>(`${this.apiUrl}/${id}/details`).pipe(
      catchError(error => {
        console.error('Erreur récupération détails événement:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion'
        });
      })
    );
  }

  // Récupérer les participants d'un événement (ancienne méthode)
  getEventParticipants(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/participants`).pipe(
      catchError(error => {
        console.error('Erreur récupération participants:', error);
        return of([]);
      })
    );
  }

  // ========== POUR LES INSCRIPTIONS ==========
  
  // S'inscrire à un événement
  registerToEvent(eventId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${eventId}/register`,
      {},
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Erreur inscription événement:', error);
        return of({ success: false, message: error.error?.message || "Erreur lors de l'inscription" });
      })
    );
  }

  // Se désinscrire d'un événement
  unregisterFromEvent(eventId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${eventId}/unregister`).pipe(
      catchError(error => {
        console.error('Erreur désinscription:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors de la désinscription'
        });
      })
    );
  }

  // ========== POUR L'ADMIN ==========
  
  // Récupérer tous les événements pour l'admin
  getAllEventsForAdmin(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/admin/tous`).pipe(
      catchError(error => {
        console.error('Erreur récupération tous événements:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur de connexion'
        });
      })
    );
  }

  // Valider un événement (admin)
  // validateEvent(id: string): Observable<ApiResponse<Event>> {
  //   return this.http.put<ApiResponse<Event>>(`${this.apiUrl}/${id}/valider`, {}).pipe(
  //     catchError(error => {
  //       console.error('Erreur validation événement:', error);
  //       return of({
  //         success: false,
  //         message: error.error?.message || 'Erreur lors de la validation'
  //       });
  //     })
  //   );
  // }

  // Rejeter un événement (admin)
  rejectEvent(id: string): Observable<ApiResponse<Event>> {
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

  // Ancienne méthode pour compatibilité
  // rejeterEvent(id: string): Observable<ApiResponse<Event>> {
  //   return this.rejectEvent(id);
  // }

  // ========== UTILITAIRES ==========
  
  getStatusColor(statut: string): string {
    switch(statut) {
      case 'valide': return '#32bcae';
      case 'en_attente': return '#ffd93d';
      case 'rejete': return '#ff6b6b';
      case 'termine': return '#13514b';
      default: return '#666666';
    }
  }

  getStatusText(statut: string): string {
    switch(statut) {
      case 'valide': return 'Validé';
      case 'en_attente': return 'En attente';
      case 'rejete': return 'Rejeté';
      case 'termine': return 'Terminé';
      default: return statut;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  getProgressPercentage(participants: number, capaciteMax: number): number {
    if (!participants || capaciteMax <= 0) return 0;
    return Math.min((participants / capaciteMax) * 100, 100);
  }

  getProgressColor(percentage: number): string {
    if (percentage >= 90) return '#ff6b6b';
    if (percentage >= 70) return '#ffd93d';
    return '#32bcae';
  }
}