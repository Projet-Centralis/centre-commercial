import { Component, OnInit } from '@angular/core';
import { BoutiqueService } from '../../services/boutique.service';
import { ProduitService } from '../../services/produit.service';
import { PromotionService } from '../../services/promotions.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-boutiques',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boutiques.component.html',
  styleUrls: ['./boutiques.component.css']
})
export class BoutiquesComponent implements OnInit {
  boutiques: any[] = [];
  allBoutiques: any[] = [];
  favorisIds: Set<string> = new Set();
  produits: any[] = [];
  selectedBoutiqueId: string | null = null;
  selectedBoutique: any = null;

  searchTerm: string = '';
  showOnlyFavoris: boolean = false;

  loading = false;
  loadingProduits = false;
  error: string | null = null;

  favorisCount: { [boutiqueId: string]: number } = {};
  promotions: any[] = [];
  promotionMap: { [produitId: string]: any } = {};

  constructor(
    private boutiqueService: BoutiqueService,
    private produitService: ProduitService,
    private promotionService: PromotionService
  ) { }

  ngOnInit(): void {
    this.loadUserFavoris();
  }

  loadBoutiques(): void {
    this.loading = true;
    this.error = null;

    this.boutiqueService.getAllBoutiques().subscribe({
      next: (response) => {
        this.allBoutiques = response.data || response;
        this.boutiques = [...this.allBoutiques];

        this.allBoutiques.forEach((boutique) => {
          this.loadNombreFavorisBoutique(boutique._id);
        });

        this.loading = false;

        if (this.boutiques.length > 0) {
          this.selectBoutique(this.boutiques[0]);
        }
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des boutiques';
        console.error('Erreur:', err);
        this.loading = false;
      }
    });
  }

  loadUserFavoris(): void {
    this.boutiqueService.getUserFavoris().subscribe({
      next: (response) => {
        let favoris = [];

        if (response.data) {
          favoris = response.data;
        } else if (Array.isArray(response)) {
          favoris = response;
        } else if (response.favoris) {
          favoris = response.favoris;
        }

        this.favorisIds = new Set();
        favoris.forEach((f: any) => {
          let id = null;

          if (f.boutique && f.boutique._id) {
            id = f.boutique._id;
          } else if (f.boutiqueId) {
            id = f.boutiqueId;
          } else if (f._id) {
            id = f._id;
          } else if (f.boutique && typeof f.boutique === 'string') {
            id = f.boutique;
          }

          if (id) {
            this.favorisIds.add(id);
          }
        });

        this.loadBoutiques();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des favoris:', err);
        this.loadBoutiques();
      }
    });
  }

  selectBoutique(boutique: any): void {
    this.selectedBoutiqueId = boutique._id;
    this.selectedBoutique = boutique;
    this.loadPromotionsThenProduits(boutique._id);
  }

  loadPromotionsThenProduits(boutiqueId: string): void {
    this.loadingProduits = true;
    this.produits = [];
    this.promotionMap = {};

    this.promotionService.getAllPromotions(boutiqueId).subscribe({
      next: (promos) => {
        const liste = Array.isArray(promos) ? promos : (promos.data || []);
        liste.forEach((promo: any) => {
          const produitId = promo.produit?._id || promo.produit;
          if (produitId && promo.actif) {
            this.promotionMap[produitId] = promo;
          }
        });
        this.loadProduits(boutiqueId);
      },
      error: (err) => {
        console.error('Erreur chargement promotions:', err);
        this.loadProduits(boutiqueId);
      }
    });
  }

  loadProduits(boutiqueId: string): void {
    this.produitService.getProductsBoutique(boutiqueId).subscribe({
      next: (response) => {
        this.produits = response.data || response;
        this.loadingProduits = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits:', err);
        this.loadingProduits = false;
      }
    });
  }

  getPromotion(produitId: string): any {
    return this.promotionMap[produitId] || null;
  }

  getPrixPromo(produit: any): number {
    const promo = this.getPromotion(produit._id);
    if (promo) {
      return Math.round(produit.prix * (1 - promo.pourcentage_reduction / 100));
    }
    return produit.prix;
  }

  isFavori(boutiqueId: string): boolean {
    return this.favorisIds.has(boutiqueId);
  }

  toggleFavori(event: Event, boutiqueId: string): void {
    event.stopPropagation();

    if (this.isFavori(boutiqueId)) {
      this.removeFavori(boutiqueId);
    } else {
      this.addFavori(boutiqueId);
    }
  }

  addFavori(boutiqueId: string): void {
    this.boutiqueService.addFavori(boutiqueId).subscribe({
      next: (response) => {
        this.favorisIds.add(boutiqueId);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout aux favoris:', err);
        if (err.error?.message?.includes('déjà dans vos favoris')) {
          this.favorisIds.add(boutiqueId);
        } else {
          alert('Erreur lors de l\'ajout aux favoris: ' + (err.error?.message || err.message));
        }
      }
    });
  }

  removeFavori(boutiqueId: string): void {
    this.boutiqueService.deleteFavori(boutiqueId).subscribe({
      next: (response) => {
        this.favorisIds.delete(boutiqueId);
        if (this.showOnlyFavoris) {
          this.filterBoutiques();
        }
      },
      error: (err) => {
        console.error('Erreur lors de la suppression des favoris:', err);
        alert('Erreur lors de la suppression des favoris: ' + (err.error?.message || err.message));
      }
    });
  }

  onSearch(): void {
    this.filterBoutiques();
  }

  toggleFavorisFilter(): void {
    this.showOnlyFavoris = !this.showOnlyFavoris;
    this.filterBoutiques();
  }

  filterBoutiques(): void {
    let filtered = [...this.allBoutiques];

    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.nom_boutique?.toLowerCase().includes(search) ||
        b.description?.toLowerCase().includes(search) ||
        b.email_contact?.toLowerCase().includes(search)
      );
    }

    if (this.showOnlyFavoris) {
      filtered = filtered.filter(b => this.isFavori(b._id));
    }

    this.boutiques = filtered;

    if (this.selectedBoutiqueId && !this.boutiques.find(b => b._id === this.selectedBoutiqueId)) {
      if (this.boutiques.length > 0) {
        this.selectBoutique(this.boutiques[0]);
      } else {
        this.selectedBoutiqueId = null;
        this.selectedBoutique = null;
        this.produits = [];
      }
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterBoutiques();
  }

  loadNombreFavorisBoutique(boutiqueId: string): void {
    if (this.favorisCount[boutiqueId] !== undefined) {
      return;
    }
    this.boutiqueService.getNombreFavorisBoutique(boutiqueId).subscribe({
      next: (res) => {
        this.favorisCount[boutiqueId] = res.favoris_count;
      },
      error: (err) => {
        console.error(`Erreur chargement nombre favoris boutique ${boutiqueId}`, err);
        this.favorisCount[boutiqueId] = 0;
      }
    });
  }
}