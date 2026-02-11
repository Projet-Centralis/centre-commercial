import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  private eventService = inject(EventService);

  availableEvents: any[] = [];
  myEvents: any[] = [];
  isLoadingAvailable = false;
  isLoadingMy = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadAvailableEvents();
    this.loadMyEvents();
  }

  loadAvailableEvents(): void {
    this.isLoadingAvailable = true;
    this.eventService.getEventsValide().subscribe({
      next: (response) => {
        this.availableEvents = response.data || response;
        this.availableEvents.forEach(event => {
          this.loadEventCapacity(event);
        });
        this.isLoadingAvailable = false;
      },
      error: (error) => {
        console.error('Erreur chargement événements:', error);
        this.errorMessage = 'Erreur lors du chargement des événements';
        this.isLoadingAvailable = false;
      }
    });
  }

  loadMyEvents(): void {
  this.isLoadingMy = true;

  this.eventService.getMyEvents().subscribe({
    next: (response: any) => {
      this.myEvents = Array.isArray(response?.events)
        ? response.events.map((item: any) => item.event)
        : [];

      this.myEvents.forEach(event => this.loadEventCapacity(event));
      this.isLoadingMy = false;
    },
    error: (error) => {
      console.error('Erreur chargement mes événements:', error);
      this.myEvents = [];
      this.isLoadingMy = false;
    }
  });
}


  loadEventCapacity(event: any): void {
    event.isLoadingCapacity = true;
    this.eventService.getcapaciterestante(event._id).subscribe({
      next: (response) => {
        event.capacite_restante = response.capacite_restante;
        event.isLoadingCapacity = false;
      },
      error: (error) => {
        console.error('Erreur chargement capacité:', error);
        event.isLoadingCapacity = false;
      }
    });
  }

  registerToEvent(eventId: string): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.eventService.registerToEvent(eventId).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Inscription réussie !';
        this.loadAvailableEvents();
        this.loadMyEvents();
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de l\'inscription';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'en attente': 'En attente',
      'valide': 'Validé',
      'rejete': 'Rejeté',
      'termine': 'Terminé'
    };
    return labels[statut] || statut;
  }

  isEventFull(event: any): boolean {
    return event.capacite_restante !== undefined && event.capacite_restante <= 0;
  }

  isEventPast(event: any): boolean {
    return new Date(event.date_fin) < new Date();
  }
}