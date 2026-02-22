import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import { Observable, forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

// Interface correspondant à l'exemple de l'événement
export interface Event {
  _id: string;
  boutique: {
    _id: string;
    nom_boutique: string;
  };
  titre: string;
  description: string;
  date_debut: string;   // ISO string
  date_fin: string;     // ISO string
  statut: 'en_attente' | 'valide' | 'rejete';
  capacite_max: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Component({
  selector: 'app-events-admin',
  templateUrl: './events-admin.component.html',
  styleUrls: ['./events-admin.component.css'],
  standalone: true,
  imports: [CommonModule]  
})
export class EventsAdminComponent implements OnInit {
  pendingEvents: Event[] = [];            // événements en attente
  validatedEvents: Event[] = [];           // événements validés

  // Calendrier
  currentMonth: Date = new Date();
  calendarDays: { date: Date; events: Event[] }[] = [];

  // Pour la modale du jour
  selectedDayEvents: Event[] = [];
  showModal = false;

  // Messages de feedback
  message: { type: 'success' | 'error'; text: string } | null = null;

  constructor(private eventsService: EventService) { }

  ngOnInit(): void {
    this.loadAllEvents();
  }

  // Charge les deux listes en parallèle
  loadAllEvents(): void {
    forkJoin({
      pending: this.eventsService.getEventsNonValide(),
      validated: this.eventsService.getEventsValide()
    }).subscribe({
      next: (results) => {
        // Selon la structure de l'API, adapter si nécessaire (ex: results.pending.data)
        this.pendingEvents = results.pending || [];
        this.validatedEvents = results.validated || [];
        this.buildCalendar();
        this.clearMessage();
      },
      error: (err) => {
        this.showMessage('error', 'Erreur lors du chargement des événements');
        console.error(err);
      }
    });
  }

  // Construit les jours du mois courant avec les événements associés
  buildCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: { date: Date; events: Event[] }[] = [];

    // Remplir les jours vides avant le premier jour (pour aligner avec lundi ou dimanche)
    const startOffset = firstDay.getDay(); // 0 = dimanche, 1 = lundi, ...
    // Si on veut commencer la semaine le lundi, on peut ajuster
    const startDate = new Date(firstDay);
    startDate.setDate(1 - startOffset + (startOffset === 0 ? -6 : 1)); // pour commencer par lundi

    // Générer 42 jours (6 semaines)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayEvents = this.validatedEvents.filter(event => {
        const eventDate = new Date(event.date_debut);
        return eventDate.toDateString() === date.toDateString();
      });
      days.push({ date, events: dayEvents });
    }

    this.calendarDays = days;
  }

  // Navigation mois précédent / suivant
  prevMonth(): void {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() - 1));
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() + 1));
    this.buildCalendar();
  }

  // Affiche les événements d'un jour dans la modale
  openDayEvents(day: { date: Date; events: Event[] }): void {
    if (day.events.length > 0) {
      this.selectedDayEvents = day.events;
      this.showModal = true;
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedDayEvents = [];
  }

  // Actions sur les demandes
  acceptEvent(eventId: string): void {
    this.eventsService.validateEvent(eventId).subscribe({
      next: (res) => {
        if (res.success) {
          this.showMessage('success', 'Événement validé avec succès');
          this.loadAllEvents(); // recharger les deux listes
        } else {
          this.showMessage('error', res.message || 'Erreur lors de la validation');
        }
      },
      error: (err) => {
        this.showMessage('error', 'Erreur réseau');
        console.error(err);
      }
    });
  }

  rejectEvent(eventId: string): void {
    this.eventsService.rejeterEvent(eventId).subscribe({
      next: (res) => {
        if (res.success) {
          this.showMessage('success', 'Événement refusé');
          this.loadAllEvents();
        } else {
          this.showMessage('error', res.message || 'Erreur lors du refus');
        }
      },
      error: (err) => {
        this.showMessage('error', 'Erreur réseau');
        console.error(err);
      }
    });
  }

  // Affichage des messages
  showMessage(type: 'success' | 'error', text: string): void {
    this.message = { type, text };
    setTimeout(() => this.clearMessage(), 5000);
  }

  clearMessage(): void {
    this.message = null;
  }
}