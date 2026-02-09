import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoutiqueEventsComponent } from './boutique-events.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { of, throwError } from 'rxjs';

describe('BoutiqueEventsComponent', () => {
  let component: BoutiqueEventsComponent;
  let fixture: ComponentFixture<BoutiqueEventsComponent>;
  let mockEventService: jasmine.SpyObj<EventService>;

  beforeEach(async () => {
    mockEventService = jasmine.createSpyObj('EventService', [
      'getBoutiqueEvents',
      'createEvent',
      'updateEvent',
      'deleteEvent'
    ]);

    await TestBed.configureTestingModule({
      imports: [BoutiqueEventsComponent, CommonModule, FormsModule],
      providers: [
        { provide: EventService, useValue: mockEventService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BoutiqueEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load events on init', () => {
    const mockEvents = [
      {
        _id: '1',
        titre: 'Test Event',
        description: 'Test Description',
        date_debut: '2024-01-01T10:00:00Z',
        date_fin: '2024-01-01T12:00:00Z',
        statut: 'en attente',
        capacite_max: 50,
        participants: 10
      }
    ];
    mockEventService.getBoutiqueEvents.and.returnValue(of(mockEvents));

    component.ngOnInit();
    
    expect(mockEventService.getBoutiqueEvents).toHaveBeenCalled();
    expect(component.events).toEqual(mockEvents);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading events', () => {
    mockEventService.getBoutiqueEvents.and.returnValue(throwError(() => new Error('Error')));
    
    component.loadEvents();
    
    expect(component.errorMessage).toBe('Erreur lors du chargement des événements');
    expect(component.loading).toBeFalse();
  });

  it('should filter events by search term', () => {
    component.events = [
      { _id: '1', titre: 'Event One', description: 'Desc One', date_debut: '', date_fin: '', statut: 'valide', capacite_max: 10 },
      { _id: '2', titre: 'Event Two', description: 'Desc Two', date_debut: '', date_fin: '', statut: 'valide', capacite_max: 20 }
    ];
    
    component.searchTerm = 'One';
    component.applyFilters();
    
    expect(component.filteredEvents.length).toBe(1);
    expect(component.filteredEvents[0].titre).toBe('Event One');
  });

  it('should filter events by status', () => {
    component.events = [
      { _id: '1', titre: 'Event 1', description: 'Desc', date_debut: '', date_fin: '', statut: 'valide', capacite_max: 10 },
      { _id: '2', titre: 'Event 2', description: 'Desc', date_debut: '', date_fin: '', statut: 'en attente', capacite_max: 20 }
    ];
    
    component.statusFilter = 'valide';
    component.applyFilters();
    
    expect(component.filteredEvents.length).toBe(1);
    expect(component.filteredEvents[0].statut).toBe('valide');
  });

  it('should sort events by date', () => {
    component.events = [
      { _id: '1', titre: 'Event 1', description: 'Desc', date_debut: '2024-01-01', date_fin: '', statut: 'valide', capacite_max: 10 },
      { _id: '2', titre: 'Event 2', description: 'Desc', date_debut: '2024-01-02', date_fin: '', statut: 'valide', capacite_max: 20 }
    ];
    
    component.sortBy = 'date';
    component.applyFilters();
    
    expect(component.filteredEvents[0]._id).toBe('2'); // Plus récent en premier
  });

  it('should calculate progress percentage correctly', () => {
    const event = {
      _id: '1',
      titre: 'Test',
      description: 'Test',
      date_debut: '',
      date_fin: '',
      statut: 'valide',
      capacite_max: 100,
      participants: 75
    };
    
    const percentage = component.getProgressPercentage(event);
    expect(percentage).toBe(75);
  });

  it('should get correct status color', () => {
    expect(component.getStatusColor('valide')).toBe('#32bcae');
    expect(component.getStatusColor('en attente')).toBe('#ffd93d');
    expect(component.getStatusColor('rejete')).toBe('#ff6b6b');
    expect(component.getStatusColor('termine')).toBe('#13514b');
  });

  it('should get correct status text', () => {
    expect(component.getStatusText('valide')).toBe('Validé');
    expect(component.getStatusText('en attente')).toBe('En attente');
    expect(component.getStatusText('rejete')).toBe('Rejeté');
    expect(component.getStatusText('termine')).toBe('Terminé');
  });

  it('should format date for display', () => {
    const formatted = component.formatDisplayDate('2024-01-01T10:00:00Z');
    expect(formatted).toContain('2024');
    expect(typeof formatted).toBe('string');
  });

  it('should validate form correctly', () => {
    component.eventForm = {
      titre: 'Test Event',
      description: 'Test Description',
      date_debut: '2024-01-01T10:00:00',
      date_fin: '2024-01-01T12:00:00',
      capacite_max: 50
    };
    
    expect(component.validateForm()).toBeTrue();
    
    component.eventForm.titre = '';
    expect(component.validateForm()).toBeFalse();
  });

  it('should open create modal with default values', () => {
    component.openCreateModal();
    
    expect(component.showEventModal).toBeTrue();
    expect(component.isEditing).toBeFalse();
    expect(component.currentEvent).toBeNull();
    expect(component.eventForm.titre).toBe('');
  });

  it('should open edit modal with event data', () => {
    const event = {
      _id: '1',
      titre: 'Test Event',
      description: 'Test Description',
      date_debut: '2024-01-01T10:00:00Z',
      date_fin: '2024-01-01T12:00:00Z',
      statut: 'valide',
      capacite_max: 50
    };
    
    component.openEditModal(event);
    
    expect(component.showEventModal).toBeTrue();
    expect(component.isEditing).toBeTrue();
    expect(component.currentEvent).toBe(event);
    expect(component.eventForm.titre).toBe('Test Event');
  });
});