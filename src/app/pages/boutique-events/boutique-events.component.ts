// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { EventService, Event, CreateEventDto } from '../../services/event.service';

// @Component({
//   selector: 'app-boutique-events',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './boutique-events.component.html',
//   styleUrls: ['./boutique-events.component.css']
// })
// export class BoutiqueEventsComponent implements OnInit {
//   // États
//   events: Event[] = [];
//   filteredEvents: Event[] = [];
//   loading = false;
//   errorMessage = '';
  
//   // Filtres
//   searchTerm = '';
//   statusFilter = 'all'; // 'all', 'en attente', 'valide', 'rejete', 'termine'
//   sortBy = 'date'; // 'date', 'titre', 'statut', 'participants'
  
//   // Modal de création/édition
//   showEventModal = false;
//   isEditing = false;
//   currentEvent: Event | null = null;
  
//   // Formulaire
//   eventForm: CreateEventDto = {
//     titre: '',
//     description: '',
//     date_debut: '',
//     date_fin: '',
//     capacite_max: 50
//   };

//   constructor(private eventService: EventService) {}

//   ngOnInit(): void {
//     this.loadEvents();
//   }

//   getPendingEventsCount(): number {
//   return this.events.filter(e => e.statut === 'en attente').length;
// }

// getValidEventsCount(): number {
//   return this.events.filter(e => e.statut === 'valide').length;
// }

// getTotalParticipants(): number {
//   return this.events.reduce((sum, e) => sum + (e.participants || 0), 0);
// }

//   loadEvents(): void {
//     this.loading = true;
//     this.errorMessage = '';
    
//     this.eventService.getBoutiqueEvents().subscribe({
//       next: (events) => {
//         this.events = events;
//         this.applyFilters();
//         this.loading = false;
//       },
//       error: (error) => {
//         this.errorMessage = 'Erreur lors du chargement des événements';
//         console.error(error);
//         this.loading = false;
//       }
//     });
//   }

//   applyFilters(): void {
//     let filtered = [...this.events];
    
//     // Filtre par recherche
//     if (this.searchTerm.trim()) {
//       const search = this.searchTerm.toLowerCase();
//       filtered = filtered.filter(event =>
//         event.titre.toLowerCase().includes(search) ||
//         event.description.toLowerCase().includes(search)
//       );
//     }
    
//     // Filtre par statut
//     if (this.statusFilter !== 'all') {
//       filtered = filtered.filter(event => event.statut === this.statusFilter);
//     }
    
//     // Tri
//     switch(this.sortBy) {
//       case 'date':
//         filtered.sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime());
//         break;
//       case 'titre':
//         filtered.sort((a, b) => a.titre.localeCompare(b.titre));
//         break;
//       case 'statut':
//         filtered.sort((a, b) => a.statut.localeCompare(b.statut));
//         break;
//       case 'participants':
//         filtered.sort((a, b) => (b.participants || 0) - (a.participants || 0));
//         break;
//     }
    
//     this.filteredEvents = filtered;
//   }

//   onSearch(): void {
//     this.applyFilters();
//   }

//   clearSearch(): void {
//     this.searchTerm = '';
//     this.applyFilters();
//   }

//   openCreateModal(): void {
//     this.isEditing = false;
//     this.currentEvent = null;
//     this.eventForm = {
//       titre: '',
//       description: '',
//       date_debut: this.getDefaultStartDate(),
//       date_fin: this.getDefaultEndDate(),
//       capacite_max: 50
//     };
//     this.showEventModal = true;
//   }

//   openEditModal(event: Event): void {
//     this.isEditing = true;
//     this.currentEvent = event;
//     this.eventForm = {
//       titre: event.titre,
//       description: event.description,
//       date_debut: this.formatDateForInput(event.date_debut),
//       date_fin: this.formatDateForInput(event.date_fin),
//       capacite_max: event.capacite_max
//     };
//     this.showEventModal = true;
//   }

//   closeModal(): void {
//     this.showEventModal = false;
//     this.eventForm = {
//       titre: '',
//       description: '',
//       date_debut: '',
//       date_fin: '',
//       capacite_max: 50
//     };
//   }

//   submitEvent(): void {
//     if (!this.validateForm()) {
//       return;
//     }
    
//     this.loading = true;
    
//     if (this.isEditing && this.currentEvent) {
//       this.eventService.updateEvent(this.currentEvent._id, this.eventForm).subscribe({
//         next: () => {
//           this.loadEvents();
//           this.closeModal();
//         },
//         error: (error) => {
//           this.errorMessage = 'Erreur lors de la mise à jour de l\'événement';
//           console.error(error);
//           this.loading = false;
//         }
//       });
//     } else {
//       this.eventService.createEvent(this.eventForm).subscribe({
//         next: () => {
//           this.loadEvents();
//           this.closeModal();
//         },
//         error: (error) => {
//           this.errorMessage = 'Erreur lors de la création de l\'événement';
//           console.error(error);
//           this.loading = false;
//         }
//       });
//     }
//   }

//   deleteEvent(event: Event): void {
//     if (confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.titre}" ?`)) {
//       this.loading = true;
//       this.eventService.deleteEvent(event._id).subscribe({
//         next: () => {
//           this.loadEvents();
//         },
//         error: (error) => {
//           this.errorMessage = 'Erreur lors de la suppression de l\'événement';
//           console.error(error);
//           this.loading = false;
//         }
//       });
//     }
//   }

//   getDefaultStartDate(): string {
//     const now = new Date();
//     now.setHours(now.getHours() + 1);
//     return this.formatDateForInput(now.toISOString());
//   }

//   getDefaultEndDate(): string {
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     tomorrow.setHours(tomorrow.getHours() + 2);
//     return this.formatDateForInput(tomorrow.toISOString());
//   }

//   formatDateForInput(dateString: string): string {
//     const date = new Date(dateString);
//     return date.toISOString().slice(0, 16);
//   }

//   formatDisplayDate(dateString: string): string {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('fr-FR', {
//       weekday: 'short',
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   }

//   getTimeRemaining(dateString: string): string {
//     const eventDate = new Date(dateString);
//     const now = new Date();
//     const diffMs = eventDate.getTime() - now.getTime();
    
//     if (diffMs < 0) return 'Terminé';
    
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//     const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
//     if (diffDays > 0) {
//       return `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
//     } else if (diffHours > 0) {
//       return `Dans ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
//     } else {
//       return 'Bientôt';
//     }
//   }

//   getStatusColor(statut: string): string {
//     switch(statut) {
//       case 'valide': return '#32bcae';
//       case 'en attente': return '#ffd93d';
//       case 'rejete': return '#ff6b6b';
//       case 'termine': return '#13514b';
//       default: return '#666666';
//     }
//   }

//   getStatusText(statut: string): string {
//     switch(statut) {
//       case 'valide': return 'Validé';
//       case 'en attente': return 'En attente';
//       case 'rejete': return 'Rejeté';
//       case 'termine': return 'Terminé';
//       default: return statut;
//     }
//   }

//   getProgressPercentage(event: Event): number {
//     if (!event.participants || event.capacite_max <= 0) return 0;
//     return Math.min((event.participants / event.capacite_max) * 100, 100);
//   }

//   getProgressColor(event: Event): string {
//     const percentage = this.getProgressPercentage(event);
//     if (percentage >= 90) return '#ff6b6b';
//     if (percentage >= 70) return '#ffd93d';
//     return '#32bcae';
//   }

//   validateForm(): boolean {
//     if (!this.eventForm.titre.trim()) {
//       this.errorMessage = 'Le titre est requis';
//       return false;
//     }
//     if (!this.eventForm.description.trim()) {
//       this.errorMessage = 'La description est requise';
//       return false;
//     }
//     if (!this.eventForm.date_debut || !this.eventForm.date_fin) {
//       this.errorMessage = 'Les dates sont requises';
//       return false;
//     }
    
//     const startDate = new Date(this.eventForm.date_debut);
//     const endDate = new Date(this.eventForm.date_fin);
    
//     if (endDate <= startDate) {
//       this.errorMessage = 'La date de fin doit être après la date de début';
//       return false;
//     }
    
//     if (this.eventForm.capacite_max < 1) {
//       this.errorMessage = 'La capacité doit être d\'au moins 1 personne';
//       return false;
//     }
    
//     return true;
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService, Event, CreateEventDto, ApiResponse } from '../../services/event.service';

@Component({
  selector: 'app-boutique-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boutique-events.component.html',
  styleUrls: ['./boutique-events.component.css']
})
export class BoutiqueEventsComponent implements OnInit {
  // États
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  // Filtres
  searchTerm = '';
  statusFilter = 'all';
  sortBy = 'date';
  
  // Modal
  showEventModal = false;
  isEditing = false;
  currentEvent: Event | null = null;
  
  // Formulaire
  eventForm: CreateEventDto = {
    titre: '',
    description: '',
    date_debut: '',
    date_fin: '',
    capacite_max: 50
  };

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.eventService.getBoutiqueEvents().subscribe({
      next: (response: ApiResponse<Event[]>) => {
        if (response.success && response.data) {
          this.events = response.data;
          this.applyFilters();
        } else {
          this.errorMessage = response.message || 'Erreur lors du chargement';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur de connexion au serveur';
        console.error('Détails erreur:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.events];
    
    // Filtre par recherche
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.titre.toLowerCase().includes(search) ||
        event.description.toLowerCase().includes(search)
      );
    }
    
    // Filtre par statut
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(event => event.statut === this.statusFilter);
    }
    
    // Tri
    switch(this.sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime());
        break;
      case 'titre':
        filtered.sort((a, b) => a.titre.localeCompare(b.titre));
        break;
      case 'statut':
        filtered.sort((a, b) => a.statut.localeCompare(b.statut));
        break;
      case 'participants':
        filtered.sort((a, b) => (b.participants || 0) - (a.participants || 0));
        break;
    }
    
    this.filteredEvents = filtered;
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.currentEvent = null;
    this.eventForm = {
      titre: '',
      description: '',
      date_debut: this.getDefaultStartDate(),
      date_fin: this.getDefaultEndDate(),
      capacite_max: 50
    };
    this.showEventModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  openEditModal(event: Event): void {
    this.isEditing = true;
    this.currentEvent = event;
    this.eventForm = {
      titre: event.titre,
      description: event.description,
      date_debut: this.formatDateForInput(event.date_debut),
      date_fin: this.formatDateForInput(event.date_fin),
      capacite_max: event.capacite_max
    };
    this.showEventModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeModal(): void {
    this.showEventModal = false;
    this.eventForm = {
      titre: '',
      description: '',
      date_debut: '',
      date_fin: '',
      capacite_max: 50
    };
    this.errorMessage = '';
  }

  submitEvent(): void {
    if (!this.validateForm()) {
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.isEditing && this.currentEvent) {
      this.eventService.updateEvent(this.currentEvent._id, this.eventForm).subscribe({
        next: (response: ApiResponse<Event>) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = 'Événement mis à jour avec succès';
            this.loadEvents();
            this.closeModal();
          } else {
            this.errorMessage = response.message || 'Erreur lors de la mise à jour';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Erreur de connexion au serveur';
          console.error(error);
        }
      });
    } else {
      this.eventService.createEvent(this.eventForm).subscribe({
        next: (response: ApiResponse<Event>) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = 'Événement créé avec succès';
            this.loadEvents();
            this.closeModal();
          } else {
            this.errorMessage = response.message || 'Erreur lors de la création';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Erreur de connexion au serveur';
          console.error(error);
        }
      });
    }
  }

  deleteEvent(event: Event): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.titre}" ?`)) {
      this.loading = true;
      this.eventService.deleteEvent(event._id).subscribe({
        next: (response: ApiResponse<void>) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = 'Événement supprimé avec succès';
            this.loadEvents();
          } else {
            this.errorMessage = response.message || 'Erreur lors de la suppression';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Erreur de connexion au serveur';
          console.error(error);
        }
      });
    }
  }

  // Méthodes utilitaires (inchangées)
  getDefaultStartDate(): string {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return this.formatDateForInput(now.toISOString());
  }

  getDefaultEndDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(tomorrow.getHours() + 2);
    return this.formatDateForInput(tomorrow.toISOString());
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  formatDisplayDate(dateString: string): string {
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

  getTimeRemaining(dateString: string): string {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffMs = eventDate.getTime() - now.getTime();
    
    if (diffMs < 0) return 'Terminé';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `Dans ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else {
      return 'Bientôt';
    }
  }

  getStatusColor(statut: string): string {
    switch(statut) {
      case 'valide': return '#32bcae';
      case 'en attente': return '#ffd93d';
      case 'rejete': return '#ff6b6b';
      case 'termine': return '#13514b';
      default: return '#666666';
    }
  }

  getStatusText(statut: string): string {
    switch(statut) {
      case 'valide': return 'Validé';
      case 'en attente': return 'En attente';
      case 'rejete': return 'Rejeté';
      case 'termine': return 'Terminé';
      default: return statut;
    }
  }

  getProgressPercentage(event: Event): number {
    if (!event.participants || event.capacite_max <= 0) return 0;
    return Math.min((event.participants / event.capacite_max) * 100, 100);
  }

  getProgressColor(event: Event): string {
    const percentage = this.getProgressPercentage(event);
    if (percentage >= 90) return '#ff6b6b';
    if (percentage >= 70) return '#ffd93d';
    return '#32bcae';
  }

  validateForm(): boolean {
    if (!this.eventForm.titre.trim()) {
      this.errorMessage = 'Le titre est requis';
      return false;
    }
    if (!this.eventForm.description.trim()) {
      this.errorMessage = 'La description est requise';
      return false;
    }
    if (!this.eventForm.date_debut || !this.eventForm.date_fin) {
      this.errorMessage = 'Les dates sont requises';
      return false;
    }
    
    const startDate = new Date(this.eventForm.date_debut);
    const endDate = new Date(this.eventForm.date_fin);
    
    if (endDate <= startDate) {
      this.errorMessage = 'La date de fin doit être après la date de début';
      return false;
    }
    
    if (this.eventForm.capacite_max < 1) {
      this.errorMessage = 'La capacité doit être d\'au moins 1 personne';
      return false;
    }
    
    return true;
  }

  // Méthodes pour les statistiques
  getPendingEventsCount(): number {
    return this.events.filter(e => e.statut === 'en attente').length;
  }

  getValidEventsCount(): number {
    return this.events.filter(e => e.statut === 'valide').length;
  }

  getTotalParticipants(): number {
    return this.events.reduce((sum, e) => sum + (e.participants || 0), 0);
  }
}