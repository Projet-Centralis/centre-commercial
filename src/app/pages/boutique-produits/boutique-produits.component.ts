import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProduitService, Produit, Categorie, CreateProduitDto, ApiResponse } from '../../services/produit.service';

@Component({
  selector: 'app-boutique-produits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boutique-produits.component.html',
  styleUrls: ['./boutique-produits.component.css']
})
export class BoutiqueProduitsComponent implements OnInit {
  // États
  produits: Produit[] = [];
  filteredProduits: Produit[] = [];
  categories: Categorie[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  // Filtres
  searchTerm = '';
  categorieFilter = 'all';
  statusFilter = 'all';
  sortBy = 'date';
  
  // Modal produit
  showProduitModal = false;
  isEditing = false;
  currentProduit: Produit | null = null;
  
  // Modal stock
  showStockModal = false;
  currentProduitStock: Produit | null = null;
  
  // Formulaire produit
  produitForm: Partial<CreateProduitDto> = {
    categorie: '',
    nom_produit: '',
    description: '',
    prix: 0,
    prix_promotionnel: 0,
    quantite_stock: 0,
    seuil_alerte_stock: 10,
    images: []
  };

  // Formulaire stock
  stockForm = {
    operation: 'entree' as 'entree' | 'sortie',
    quantite: 0,
    emplacement: ''
  };

  constructor(private produitService: ProduitService) {}

  ngOnInit(): void {
    this.loadProduits();
    this.loadCategories();
  }

  loadProduits(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.produitService.getProduitsBoutique().subscribe({
      next: (response: ApiResponse<Produit[]>) => {
        if (response.success && response.data) {
          this.produits = response.data;
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
 // Méthodes utilitaires pour extraire les noms des objets populés
  getProduitNom(produit: any): string {
    if (typeof produit === 'string') {
      return produit;
    }
    if (produit && typeof produit === 'object' && 'nom_produit' in produit) {
      return produit.nom_produit;
    }
    return 'Produit inconnu';
  }

  getCategorieNom(categorie: any): string {
    if (typeof categorie === 'string') {
      // Si c'est juste un ID, on cherche dans la liste des catégories
      const cat = this.categories.find(c => c._id === categorie);
      return cat ? cat.nom : 'Catégorie inconnue';
    }
    if (categorie && typeof categorie === 'object' && 'nom' in categorie) {
      return categorie.nom;
    }
    return 'Catégorie inconnue';
  }

//   loadCategories(): void {
//     this.produitService.getCategories().subscribe({
//       next: (response: ApiResponse<Categorie[]>) => {
//         if (response.success && response.data) {
//           this.categories = response.data;
//         }
//       }
//     });
//   }
loadCategories(): void {
  this.produitService.getCategories().subscribe({
    next: (response: any) => {
      console.log('Catégories reçues:', response);
      
      // Si la réponse est un tableau
      if (Array.isArray(response)) {
        this.categories = response;
      }
      // Si c'est un objet avec propriété data
      else if (response && response.data && Array.isArray(response.data)) {
        this.categories = response.data;
      }
      // Si c'est un ApiResponse
      else if (response && response.success && response.data) {
        this.categories = response.data;
      }
      
      console.log('Catégories finales:', this.categories);
      
      // Si toujours pas de catégories après le chargement
      if (this.categories.length === 0) {
        console.warn('Aucune catégorie chargée');
      }
    },
    error: (error) => {
      console.error('Erreur API catégories:', error);
    }
  });
}

  applyFilters(): void {
    let filtered = [...this.produits];
    
   // Filtre par recherche
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(produit =>
        produit.nom_produit.toLowerCase().includes(search) ||
        produit.description.toLowerCase().includes(search) ||
        this.getCategorieNom(produit.categorie).toLowerCase().includes(search)
      );
    }
    
   // Filtre par catégorie
    if (this.categorieFilter !== 'all') {
      filtered = filtered.filter(produit => {
        const categorieId = typeof produit.categorie === 'string' ? produit.categorie : produit.categorie._id;
        return categorieId === this.categorieFilter;
      });
    }
    
    // Filtre par statut
    if (this.statusFilter !== 'all') {
      if (this.statusFilter === 'actif') {
        filtered = filtered.filter(produit => produit.est_actif);
      } else if (this.statusFilter === 'inactif') {
        filtered = filtered.filter(produit => !produit.est_actif);
      } else if (this.statusFilter === 'alerte') {
        filtered = filtered.filter(produit => 
          produit.quantite_stock <= produit.seuil_alerte_stock
        );
      } else if (this.statusFilter === 'rupture') {
        filtered = filtered.filter(produit => produit.quantite_stock === 0);
      }
    }
    
    // Tri
    switch(this.sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
      case 'nom':
        filtered.sort((a, b) => a.nom_produit.localeCompare(b.nom_produit));
        break;
      case 'prix':
        filtered.sort((a, b) => b.prix - a.prix);
        break;
      case 'stock':
        filtered.sort((a, b) => b.quantite_stock - a.quantite_stock);
        break;
    }
    
    this.filteredProduits = filtered;
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  // Modal Produit
  openCreateModal(): void {
    this.isEditing = false;
    this.currentProduit = null;
    this.produitForm = {
      categorie: this.categories[0]?._id || '',
      nom_produit: '',
      description: '',
      prix: 0,
      prix_promotionnel: 0,
      quantite_stock: 0,
      seuil_alerte_stock: 10,
      images: []
    };
    this.showProduitModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

//   openEditModal(produit: Produit): void {
//     this.isEditing = true;
//     this.currentProduit = produit;
//     const categorieId = typeof produit.categorie === 'string' ? produit.categorie : produit.categorie._id;
    
//     this.produitForm = {
//       categorie: categorieId,
//       nom_produit: produit.nom_produit,
//       description: produit.description,
//       prix: produit.prix,
//       prix_promotionnel: produit.prix_promotionnel || 0,
//       quantite_stock: produit.quantite_stock,
//       seuil_alerte_stock: produit.seuil_alerte_stock,
//       images: produit.images
//     };
//     this.showProduitModal = true;
//     this.errorMessage = '';
//     this.successMessage = '';
//   }
openEditModal(produit: Produit): void {
    this.isEditing = true;
    this.currentProduit = produit;
    const categorieId = typeof produit.categorie === 'string' ? produit.categorie : produit.categorie?._id || '';
    
    this.produitForm = {
      categorie: categorieId,
      nom_produit: produit.nom_produit,
      description: produit.description,
      prix: produit.prix,
      prix_promotionnel: produit.prix_promotionnel || 0,
      quantite_stock: produit.quantite_stock,
      seuil_alerte_stock: produit.seuil_alerte_stock,
      images: produit.images || []
    };
    this.showProduitModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeProduitModal(): void {
    this.showProduitModal = false;
    this.produitForm = {
      categorie: '',
      nom_produit: '',
      description: '',
      prix: 0,
      prix_promotionnel: 0,
      quantite_stock: 0,
      seuil_alerte_stock: 10,
      images: []
    };
    this.errorMessage = '';
  }

  submitProduit(): void {
    if (!this.validateProduitForm()) {
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.isEditing && this.currentProduit) {
      this.produitService.updateProduit(this.currentProduit._id, this.produitForm).subscribe({
        next: (response: ApiResponse<Produit>) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = 'Produit mis à jour avec succès';
            this.loadProduits();
            this.closeProduitModal();
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
      this.produitService.createProduit(this.produitForm).subscribe({
        next: (response: ApiResponse<Produit>) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = 'Produit créé avec succès';
            this.loadProduits();
            this.closeProduitModal();
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

  deleteProduit(produit: Produit): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${produit.nom_produit}" ?`)) {
      this.loading = true;
      this.produitService.deleteProduit(produit._id).subscribe({
        next: (response: ApiResponse<void>) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = 'Produit supprimé avec succès';
            this.loadProduits();
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

  toggleProduitStatus(produit: Produit): void {
    const newStatus = !produit.est_actif;
    const action = newStatus ? 'activé' : 'désactivé';
    
    if (confirm(`Êtes-vous sûr de vouloir ${action} le produit "${produit.nom_produit}" ?`)) {
      this.loading = true;
      this.produitService.toggleProduitStatus(produit._id, newStatus).subscribe({
        next: (response: ApiResponse<Produit>) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = `Produit ${action} avec succès`;
            this.loadProduits();
          } else {
            this.errorMessage = response.message || `Erreur lors de la ${action}`;
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

  // Modal Stock
  openStockModal(produit: Produit): void {
    this.currentProduitStock = produit;
    this.stockForm = {
      operation: 'entree',
      quantite: 0,
      emplacement: ''
    };
    this.showStockModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeStockModal(): void {
    this.showStockModal = false;
    this.currentProduitStock = null;
    this.stockForm = {
      operation: 'entree',
      quantite: 0,
      emplacement: ''
    };
    this.errorMessage = '';
  }

  submitStock(): void {
    if (!this.validateStockForm()) {
      return;
    }
    
    if (!this.currentProduitStock) return;
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.produitService.addStock(this.currentProduitStock._id, this.stockForm).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.successMessage = `Stock ${this.stockForm.operation === 'entree' ? 'ajouté' : 'retiré'} avec succès`;
          this.loadProduits();
          this.closeStockModal();
        } else {
          this.errorMessage = response.message || 'Erreur lors de la mise à jour du stock';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erreur de connexion au serveur';
        console.error(error);
      }
    });
  }

  // Validation
  validateProduitForm(): boolean {
    if (!this.produitForm.nom_produit?.trim()) {
      this.errorMessage = 'Le nom du produit est requis';
      return false;
    }
    if (!this.produitForm.description?.trim()) {
      this.errorMessage = 'La description est requise';
      return false;
    }
    if (!this.produitForm.categorie) {
      this.errorMessage = 'La catégorie est requise';
      return false;
    }
    if (!this.produitForm.prix || this.produitForm.prix <= 0) {
      this.errorMessage = 'Le prix doit être supérieur à 0';
      return false;
    }
    if (this.produitForm.quantite_stock === undefined || this.produitForm.quantite_stock < 0) {
      this.errorMessage = 'La quantité doit être un nombre positif';
      return false;
    }
    return true;
  }

  validateStockForm(): boolean {
    if (!this.stockForm.emplacement) {
      this.errorMessage = 'L\'emplacement est requis';
      return false;
    }
    if (!this.stockForm.quantite || this.stockForm.quantite <= 0) {
      this.errorMessage = 'La quantité doit être supérieure à 0';
      return false;
    }
    return true;
  }

  // Méthodes utilitaires
  formatPrice(prix: number): string {
    return this.produitService.formatPrice(prix);
  }

  getReduction(produit: Produit): number {
    if (!produit.prix_promotionnel) return 0;
    return this.produitService.calculateReduction(produit.prix, produit.prix_promotionnel);
  }

  getStockStatus(produit: Produit): string {
    return this.produitService.getStockStatus(produit.quantite_stock, produit.seuil_alerte_stock);
  }

  getStockStatusColor(produit: Produit): string {
    return this.produitService.getStockStatusColor(produit.quantite_stock, produit.seuil_alerte_stock);
  }

  getStockStatusText(produit: Produit): string {
    return this.produitService.getStockStatusText(produit.quantite_stock, produit.seuil_alerte_stock);
  }

  getProduitImage(images: string[]): string {
    return this.produitService.getProduitImage(images);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Méthodes pour les statistiques
  getTotalProduits(): number {
    return this.produits.length;
  }

  getActifsCount(): number {
    return this.produits.filter(p => p.est_actif).length;
  }

  getAlertesCount(): number {
    return this.produits.filter(p => 
      p.quantite_stock > 0 && p.quantite_stock <= p.seuil_alerte_stock
    ).length;
  }

  getRupturesCount(): number {
    return this.produits.filter(p => p.quantite_stock === 0).length;
  }
}