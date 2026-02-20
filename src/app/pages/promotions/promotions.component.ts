import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionService } from '../../services/promotions.service';

export interface Produit {
  _id: string;
  boutique: string;
  categorie: string;
  nom_produit: string;
  description: string;
  prix: number;
  prix_promotionnel: number;
  quantite_stock: number;
  seuil_alerte_stock: number;
  images: string[];
  est_actif: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  _id: string;
  produit: Produit;
  titre: string;
  description: string;
  pourcentage_reduction: number;
  date_debut: string;
  date_fin: string;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {

  @ViewChild('cardsTrack') cardsTrack!: ElementRef<HTMLDivElement>;

  private promotionService = inject(PromotionService);

  // ===== STATE =====
  promotions: Promotion[] = [];
  isLoading = true;

  scrollPosition = 0;
  isScrollEnd = false;
  activeIndex = 0;

  private readonly CARD_WIDTH = 320;
  private readonly BOUTIQUE_ID = 'default';

  // ===== LIFECYCLE =====
  ngOnInit(): void {
    this.loadPromotions();
  }

  // ===== DATA =====
  loadPromotions(): void {
    this.isLoading = true;
    this.promotionService.getAllPromotions(this.BOUTIQUE_ID).subscribe({
      next: (data: Promotion[]) => {
        this.promotions = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des promotions :', err);
        this.isLoading = false;
      }
    });
  }

  // ===== SCROLL =====
  scrollLeft(): void {
    const track = this.cardsTrack?.nativeElement;
    if (track) {
      track.scrollBy({ left: -this.CARD_WIDTH, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    const track = this.cardsTrack?.nativeElement;
    if (track) {
      track.scrollBy({ left: this.CARD_WIDTH, behavior: 'smooth' });
    }
  }

  scrollToCard(index: number): void {
    const track = this.cardsTrack?.nativeElement;
    if (track) {
      track.scrollTo({ left: index * this.CARD_WIDTH, behavior: 'smooth' });
    }
  }

  onScroll(event: Event): void {
    const track = event.target as HTMLDivElement;
    this.scrollPosition = track.scrollLeft;
    this.isScrollEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
    this.activeIndex = Math.round(track.scrollLeft / this.CARD_WIDTH);
  }

  // ===== IMAGE HELPERS =====
  getImageUrl(imageName: string): string {
    return `/${imageName}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const fallback = img.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  }

  // ===== STOCK HELPERS =====
  getStockPercent(produit: Produit): number {
    const max = 100; // estimation max stock
    return Math.min(100, Math.round((produit.quantite_stock / max) * 100));
  }

  isStockLow(produit: Produit): boolean {
    return produit.quantite_stock <= produit.seuil_alerte_stock;
  }

  // ===== DATE HELPERS =====
  isPromotionExpired(promo: Promotion): boolean {
    return new Date(promo.date_fin) < new Date();
  }

  getDaysRemaining(promo: Promotion): number {
    const now = new Date();
    const end = new Date(promo.date_fin);
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}