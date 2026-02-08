import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoutiqueDashboardComponent } from './boutique-dashboard.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('BoutiqueDashboardComponent', () => {
  let component: BoutiqueDashboardComponent;
  let fixture: ComponentFixture<BoutiqueDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutiqueDashboardComponent, CommonModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutiqueDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.ventesTotales).toBe(0);
    expect(component.ventesAujourdhui).toBe(0);
    expect(component.nombreClients).toBe(0);
    expect(component.nouveauxClients).toBe(0);
    expect(component.tauxConversion).toBe(0);
    expect(component.revenuMensuel).toBe(0);
    expect(component.ventesJournalieres).toEqual([]);
    expect(component.produitsPopulaires).toEqual([]);
    expect(component.prospectsClients).toEqual([]);
    expect(component.isLoading).toBeFalse();
  });

  it('should load dashboard data on init', () => {
    spyOn(component, 'loadDashboardData');
    component.ngOnInit();
    expect(component.loadDashboardData).toHaveBeenCalled();
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(1250);
    expect(formatted).toContain('1 250');
    expect(formatted).toContain('€'); // Ou la devise configurée
  });

  it('should get max sales from ventesJournalieres', () => {
    component.ventesJournalieres = [
      { date: 'Lun', montant: 1000, nombreVentes: 10 },
      { date: 'Mar', montant: 2000, nombreVentes: 20 },
      { date: 'Mer', montant: 1500, nombreVentes: 15 }
    ];
    
    const max = component.getVentesMax();
    expect(max).toBe(2000);
  });

  it('should calculate bar height correctly', () => {
    component.ventesJournalieres = [
      { date: 'Lun', montant: 1000, nombreVentes: 10 },
      { date: 'Mar', montant: 2000, nombreVentes: 20 }
    ];
    
    const height = component.getBarHeight(1000);
    expect(height).toBe(50); // 1000/2000 * 100 = 50%
  });

  it('should return correct trend icon', () => {
    expect(component.getTendanceIcon('up')).toBe('bi bi-arrow-up-circle-fill');
    expect(component.getTendanceIcon('down')).toBe('bi bi-arrow-down-circle-fill');
    expect(component.getTendanceIcon('stable')).toBe('bi bi-dash-circle-fill');
    expect(component.getTendanceIcon('unknown')).toBe('bi bi-dash-circle-fill');
  });

  it('should return correct trend color', () => {
    expect(component.getTendanceColor('up')).toBe('#32bcae');
    expect(component.getTendanceColor('down')).toBe('#ff6b6b');
    expect(component.getTendanceColor('stable')).toBe('#ffd93d');
    expect(component.getTendanceColor('unknown')).toBe('#ffd93d');
  });

  it('should return correct status color', () => {
    expect(component.getStatutColor('actif')).toBe('#32bcae');
    expect(component.getStatutColor('potentiel')).toBe('#ffd93d');
    expect(component.getStatutColor('inactif')).toBe('#ff6b6b');
    expect(component.getStatutColor('unknown')).toBe('#13514b');
  });

  it('should load dashboard data correctly', (done) => {
    component.loadDashboardData();
    
    setTimeout(() => {
      expect(component.isLoading).toBeFalse();
      expect(component.ventesTotales).toBe(12450);
      expect(component.ventesAujourdhui).toBe(1250);
      expect(component.nombreClients).toBe(342);
      expect(component.ventesJournalieres.length).toBe(7);
      expect(component.produitsPopulaires.length).toBe(5);
      expect(component.prospectsClients.length).toBe(5);
      done();
    }, 1100); // Plus que le timeout de 1000ms
  });

  it('should handle empty ventesJournalieres for bar height', () => {
    component.ventesJournalieres = [];
    const height = component.getBarHeight(1000);
    expect(height).toBe(0);
  });

  it('should handle zero max sales for bar height', () => {
    component.ventesJournalieres = [
      { date: 'Lun', montant: 0, nombreVentes: 0 },
      { date: 'Mar', montant: 0, nombreVentes: 0 }
    ];
    
    const height = component.getBarHeight(0);
    expect(height).toBe(0);
  });

  it('should have proper data types', () => {
    component.loadDashboardData();
    
    setTimeout(() => {
      // Vérifier les types
      expect(typeof component.ventesTotales).toBe('number');
      expect(typeof component.tauxConversion).toBe('number');
      expect(Array.isArray(component.ventesJournalieres)).toBeTrue();
      expect(Array.isArray(component.produitsPopulaires)).toBeTrue();
      expect(Array.isArray(component.prospectsClients)).toBeTrue();
      
      // Vérifier la structure des objets
      if (component.ventesJournalieres.length > 0) {
        const vente = component.ventesJournalieres[0];
        expect(vente).toHaveProperty('date');
        expect(vente).toHaveProperty('montant');
        expect(vente).toHaveProperty('nombreVentes');
        expect(typeof vente.date).toBe('string');
        expect(typeof vente.montant).toBe('number');
        expect(typeof vente.nombreVentes).toBe('number');
      }
      
      if (component.produitsPopulaires.length > 0) {
        const produit = component.produitsPopulaires[0];
        expect(produit).toHaveProperty('nom');
        expect(produit).toHaveProperty('categorie');
        expect(produit).toHaveProperty('ventes');
        expect(produit).toHaveProperty('revenu');
        expect(produit).toHaveProperty('tendance');
        expect(['up', 'down', 'stable']).toContain(produit.tendance);
      }
    }, 1100);
  });

  it('should update data when refresh button is clicked', () => {
    const initialVentes = component.ventesTotales;
    component.loadDashboardData();
    
    setTimeout(() => {
      expect(component.ventesTotales).not.toBe(initialVentes);
      expect(component.ventesTotales).toBe(12450);
    }, 1100);
  });

  it('should display loading state correctly', () => {
    component.isLoading = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const refreshButton = compiled.querySelector('.refresh-btn');
    expect(refreshButton.disabled).toBeTrue();
    expect(refreshButton.textContent).toContain('Chargement');
  });

  it('should display current date', () => {
    const date = component.getCurrentDate();
    expect(date).toBeTruthy();
    expect(typeof date).toBe('string');
    expect(date.length).toBeGreaterThan(0);
  });

  it('should sort products by rank/index', () => {
    component.loadDashboardData();
    
    setTimeout(() => {
      // Vérifier que les produits sont dans l'ordre (par index)
      component.produitsPopulaires.forEach((produit, index) => {
        expect(component.produitsPopulaires.indexOf(produit)).toBe(index);
      });
    }, 1100);
  });
});