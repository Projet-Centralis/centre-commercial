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
  // ══════════════════════════════════════════════════════
// AJOUTS TypeScript pour le composant Events
// Coller ces propriétés / méthodes dans ta classe
// ══════════════════════════════════════════════════════

// ── Propriétés popup ──
selectedEvent: any = null;

openEventPopup(event: any) {
  this.selectedEvent = event;
}

// ── Capacité (utilitaire) ──
getCapacityPercent(event: any): number {
  if (!event.capacite_max || event.capacite_max === 0) return 0;
  const used = event.capacite_max - (event.capacite_restante || 0);
  return Math.min(100, Math.round((used / event.capacite_max) * 100));
}

// ── Calendrier ──
weekDays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
currentYear  = new Date().getFullYear();
currentMonth = new Date().getMonth(); // 0-based
calendarCells: any[] = [];
currentMonthLabel = '';
selectedCalDay: number | null = null;
selectedDayEvents: any[] = [];

buildCalendar() {
  const date = new Date(this.currentYear, this.currentMonth, 1);
  const monthNames = [
    'Janvier','Février','Mars','Avril','Mai','Juin',
    'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
  ];
  this.currentMonthLabel = `${monthNames[this.currentMonth]} ${this.currentYear}`;

  // Premier jour de la semaine (lundi = 0)
  let startDay = date.getDay() - 1;
  if (startDay < 0) startDay = 6;

  const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
  const today = new Date();
  const cells: any[] = [];

  // Cellules vides avant le 1er
  for (let i = 0; i < startDay; i++) {
    cells.push({ day: null, events: [] });
  }

  // Jours du mois
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday =
      today.getDate() === d &&
      today.getMonth() === this.currentMonth &&
      today.getFullYear() === this.currentYear;

    // Events qui tombent ce jour
    const dayEvents = this.availableEvents.filter(ev => {
      const evDate = new Date(ev.date_debut);
      return (
        evDate.getDate() === d &&
        evDate.getMonth() === this.currentMonth &&
        evDate.getFullYear() === this.currentYear
      );
    });

    cells.push({ day: d, isToday, events: dayEvents });
  }

  this.calendarCells = cells;
}

prevMonth() {
  if (this.currentMonth === 0) {
    this.currentMonth = 11;
    this.currentYear--;
  } else {
    this.currentMonth--;
  }
  this.selectedCalDay = null;
  this.selectedDayEvents = [];
  this.buildCalendar();
}

nextMonth() {
  if (this.currentMonth === 11) {
    this.currentMonth = 0;
    this.currentYear++;
  } else {
    this.currentMonth++;
  }
  this.selectedCalDay = null;
  this.selectedDayEvents = [];
  this.buildCalendar();
}

selectCalDay(cell: any) {
  this.selectedCalDay = cell.day;
  this.selectedDayEvents = cell.events;
}
}