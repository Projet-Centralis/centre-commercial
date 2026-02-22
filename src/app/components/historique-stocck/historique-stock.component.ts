import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProduitService, MouvementStock, ApiResponse } from '../../services/produit.service';

@Component({
  selector: 'app-historique-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="showHistorique" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>
            <i class="bi bi-clock-history"></i>
            Historique des mouvements
            <span *ngIf="produitNom">- {{ produitNom }}</span>
          </h2>
          <button class="modal-close" (click)="close()">
            <i class="bi bi-x"></i>
          </button>
        </div>

        <div class="modal-body">
          <!-- Filtres -->
          <div class="filters-section">
            <div class="search-bar">
              <i class="bi bi-search"></i>
              <input 
                type="text" 
                [(ngModel)]="searchTerm" 
                (input)="filterMouvements()"
                placeholder="Rechercher un motif ou emplacement...">
              <button *ngIf="searchTerm" (click)="clearSearch()" class="clear-btn">
                <i class="bi bi-x"></i>
              </button>
            </div>
            
            <div class="filter-controls">
              <div class="filter-group">
                <label for="typeFilter">
                  <i class="bi bi-funnel"></i>
                  Type de mouvement
                </label>
                <select 
                  id="typeFilter" 
                  [(ngModel)]="typeFilter" 
                  (change)="filterMouvements()"
                  class="filter-select">
                  <option value="all">Tous les types</option>
                  <option value="entree">Entrées</option>
                  <option value="sortie">Sorties</option>
                  <option value="ajustement">Ajustements</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div *ngIf="loading" class="loading-state">
            <div class="loader"></div>
            <p>Chargement de l'historique...</p>
          </div>

          <!-- Empty state -->
          <div *ngIf="!loading && filteredMouvements.length === 0" class="empty-state">
            <i class="bi bi-clock-history"></i>
            <p>Aucun mouvement trouvé</p>
          </div>

          <!-- Liste des mouvements -->
          <div class="historique-list" *ngIf="!loading && filteredMouvements.length > 0">
            <div *ngFor="let mvt of filteredMouvements" class="mouvement-card" [class]="mvt.type_mouvement">
              <div class="mouvement-icon">
                <i class="bi" [class.bi-box-arrow-in-down]="mvt.type_mouvement === 'entree'"
                           [class.bi-box-arrow-up]="mvt.type_mouvement === 'sortie'"
                           [class.bi-pencil-square]="mvt.type_mouvement === 'ajustement'"></i>
              </div>
              
              <div class="mouvement-details">
                <div class="mouvement-header">
                  <span class="mouvement-type" [style.background]="getTypeColor(mvt.type_mouvement)">
                    {{ getTypeText(mvt.type_mouvement) }}
                  </span>
                  <span class="mouvement-date">{{ formatDate(mvt.date_mouvement) }}</span>
                </div>
                
                <div class="mouvement-content">
                  <div class="mouvement-quantite">
                    <span class="label">Quantité:</span>
                    <span class="value" [class.positive]="mvt.type_mouvement === 'entree'"
                                       [class.negative]="mvt.type_mouvement === 'sortie'">
                      {{ mvt.type_mouvement === 'entree' ? '+' : '-' }}{{ mvt.quantite }}
                    </span>
                  </div>
                  
                  <div class="mouvement-avant-apres">
                    <span class="label">Stock: </span>
                    <span class="avant">{{ mvt.quantite_avant }}</span>
                    <i class="bi bi-arrow-right"></i>
                    <span class="apres">{{ mvt.quantite_apres }}</span>
                  </div>
                  
                  <div class="mouvement-emplacement" *ngIf="getEmplacementNom(mvt.emplacement)">
                    <i class="bi bi-geo-alt"></i>
                    {{ getEmplacementNom(mvt.emplacement) }}
                  </div>
                  
                  <div class="mouvement-motif" *ngIf="mvt.motif">
                    <i class="bi bi-chat"></i>
                    {{ mvt.motif }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-content {
      background: #1a1d2e;
      border-radius: 16px;
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      border: 2px solid #32bcae;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 25px;
      border-bottom: 2px solid #13514b;
      position: sticky;
      top: 0;
      background: #1a1d2e;
      z-index: 10;
    }

    .modal-header h2 {
      color: #ffffff;
      font-size: 22px;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .modal-header h2 i {
      color: #32bcae;
      font-size: 26px;
    }

    .modal-header h2 span {
      font-size: 18px;
      color: #32bcae;
    }

    .modal-close {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      padding: 8px;
      font-size: 24px;
      transition: all 0.3s ease;
      border-radius: 6px;
    }

    .modal-close:hover {
      color: #ff6b6b;
      background: rgba(255, 107, 107, 0.1);
    }

    .modal-body {
      padding: 25px;
    }

    .filters-section {
      background: #101324;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 25px;
      border: 2px solid #13514b;
    }

    .search-bar {
      position: relative;
      margin-bottom: 20px;
    }

    .search-bar i {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #32bcae;
      font-size: 18px;
    }

    .search-bar input {
      width: 100%;
      padding: 12px 45px 12px 45px;
      background: #1a1d2e;
      border: 2px solid #13514b;
      border-radius: 10px;
      color: #ffffff;
      font-size: 15px;
      transition: all 0.3s ease;
    }

    .search-bar input:focus {
      outline: none;
      border-color: #32bcae;
      box-shadow: 0 0 15px rgba(50, 188, 174, 0.3);
    }

    .search-bar input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .clear-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      padding: 5px;
      font-size: 18px;
      transition: color 0.3s ease;
    }

    .clear-btn:hover {
      color: #ff6b6b;
    }

    .filter-controls {
      display: flex;
      gap: 20px;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }

    .filter-group label {
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .filter-group label i {
      color: #32bcae;
      font-size: 14px;
    }

    .filter-select {
      padding: 10px 15px;
      background: #1a1d2e;
      border: 2px solid #13514b;
      border-radius: 8px;
      color: #ffffff;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-select:focus {
      outline: none;
      border-color: #32bcae;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      gap: 15px;
    }

    .loader {
      width: 40px;
      height: 40px;
      border: 4px solid #13514b;
      border-top-color: #32bcae;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-state p {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      margin: 0;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      gap: 15px;
      text-align: center;
    }

    .empty-state i {
      color: #32bcae;
      font-size: 48px;
      opacity: 0.3;
    }

    .empty-state p {
      color: rgba(255, 255, 255, 0.5);
      font-size: 16px;
      margin: 0;
    }

    .historique-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 500px;
      overflow-y: auto;
      padding-right: 5px;
    }

    .historique-list::-webkit-scrollbar {
      width: 6px;
    }

    .historique-list::-webkit-scrollbar-track {
      background: #101324;
      border-radius: 3px;
    }

    .historique-list::-webkit-scrollbar-thumb {
      background: #13514b;
      border-radius: 3px;
    }

    .historique-list::-webkit-scrollbar-thumb:hover {
      background: #32bcae;
    }

    .mouvement-card {
      display: flex;
      gap: 15px;
      padding: 15px;
      background: #101324;
      border-radius: 8px;
      border-left: 4px solid;
      transition: all 0.3s ease;
    }

    .mouvement-card:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }

    .mouvement-card.entree {
      border-left-color: #32bcae;
    }

    .mouvement-card.sortie {
      border-left-color: #ff6b6b;
    }

    .mouvement-card.ajustement {
      border-left-color: #ffd93d;
    }

    .mouvement-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .mouvement-card.entree .mouvement-icon {
      background: rgba(50, 188, 174, 0.2);
      color: #32bcae;
    }

    .mouvement-card.sortie .mouvement-icon {
      background: rgba(255, 107, 107, 0.2);
      color: #ff6b6b;
    }

    .mouvement-card.ajustement .mouvement-icon {
      background: rgba(255, 217, 61, 0.2);
      color: #ffd93d;
    }

    .mouvement-details {
      flex: 1;
    }

    .mouvement-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .mouvement-type {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #ffffff;
    }

    .mouvement-date {
      color: rgba(255,255,255,0.5);
      font-size: 11px;
    }

    .mouvement-content {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 13px;
    }

    .mouvement-quantite,
    .mouvement-avant-apres,
    .mouvement-emplacement,
    .mouvement-motif {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .label {
      color: rgba(255,255,255,0.5);
    }

    .value {
      font-weight: 600;
    }

    .value.positive {
      color: #32bcae;
    }

    .value.negative {
      color: #ff6b6b;
    }

    .avant {
      color: rgba(255,255,255,0.5);
    }

    .apres {
      color: #32bcae;
      font-weight: 600;
    }

    .mouvement-emplacement i,
    .mouvement-motif i {
      color: #32bcae;
      font-size: 14px;
    }

    .mouvement-emplacement,
    .mouvement-motif {
      color: rgba(255,255,255,0.7);
    }

    @media (max-width: 768px) {
      .modal-content {
        margin: 10px;
      }
      
      .filter-controls {
        flex-direction: column;
      }
      
      .mouvement-content {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class HistoriqueStockComponent implements OnInit, OnChanges {
  @Input() produitId: string = '';
  @Input() produitNom: string = '';
  @Input() showHistorique: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  mouvements: MouvementStock[] = [];
  filteredMouvements: MouvementStock[] = [];
  loading = false;
  searchTerm = '';
  typeFilter = 'all';
  
  private isFirstLoad = true;
  private isLoading = false;
  private currentProductId = '';

  constructor(private produitService: ProduitService) {}

  ngOnInit(): void {
    // Ne pas charger ici
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Quand la modal s'ouvre
    if (changes['showHistorique'] && this.showHistorique) {
      // Si c'est un nouveau produit ou première ouverture
      if (this.currentProductId !== this.produitId || this.isFirstLoad) {
        this.currentProductId = this.produitId;
        this.isFirstLoad = false;
        this.loadMouvements();
      }
    }
    
    // Quand la modal se ferme
    if (changes['showHistorique'] && !this.showHistorique && !this.isLoading) {
      // Petit délai pour éviter les problèmes de UI
      setTimeout(() => {
        this.resetComponent();
      }, 300);
    }
  }

  loadMouvements(): void {
    if (this.isLoading || !this.produitId) return;
    
    this.isLoading = true;
    this.loading = true;
    this.mouvements = [];
    this.filteredMouvements = [];
    
    this.produitService.getMouvementsProduit(this.produitId).subscribe({
      next: (response: ApiResponse<MouvementStock[]>) => {
        if (response.success && response.data) {
          this.mouvements = response.data;
          this.filterMouvements();
        }
        this.loading = false;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement mouvements:', error);
        this.loading = false;
        this.isLoading = false;
      }
    });
  }

  filterMouvements(): void {
    let filtered = [...this.mouvements];

    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(m => 
        (m.motif?.toLowerCase() || '').includes(search) ||
        this.getEmplacementNom(m.emplacement).toLowerCase().includes(search)
      );
    }

    if (this.typeFilter !== 'all') {
      filtered = filtered.filter(m => m.type_mouvement === this.typeFilter);
    }

    this.filteredMouvements = filtered;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterMouvements();
  }

  getTypeColor(type: string): string {
    switch(type) {
      case 'entree': return '#32bcae';
      case 'sortie': return '#ff6b6b';
      case 'ajustement': return '#ffd93d';
      default: return '#666';
    }
  }

  getTypeText(type: string): string {
    switch(type) {
      case 'entree': return 'ENTRÉE';
      case 'sortie': return 'SORTIE';
      case 'ajustement': return 'AJUSTEMENT';
      default: return type;
    }
  }

  getEmplacementNom(emplacement: any): string {
    if (!emplacement) return 'Emplacement inconnu';
    if (typeof emplacement === 'string') return emplacement;
    return emplacement?.nom_emplacement || 'Emplacement inconnu';
  }

  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  resetComponent(): void {
    this.mouvements = [];
    this.filteredMouvements = [];
    this.searchTerm = '';
    this.typeFilter = 'all';
    this.isLoading = false;
  }

  close(): void {
    this.closeModal.emit();
  }
}