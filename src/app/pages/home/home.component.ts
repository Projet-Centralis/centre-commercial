import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueService } from '../../services/boutique.service';

interface Boutique {
  _id: string;
  nom_boutique: string;
  description: string;
  logo: string;
  email_contact: string;
  user: {
    _id: string;
    email: string;
    type_user: string;
  };
  x?: number; // Position X en pourcentage (à définir manuellement ou aléatoirement)
  y?: number; // Position Y en pourcentage (à définir manuellement ou aléatoirement)
  color?: string; // Couleur pour l'affichage
  icon?: string; // Icône pour l'affichage
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private boutiqueService = inject(BoutiqueService);
  
  searchTerm: string = '';
  selectedBoutique: Boutique | null = null;
  hoveredBoutique: Boutique | null = null;
  boutiques: Boutique[] = [];
  loading: boolean = true;
  error: string = '';

  // Couleurs alternées pour les boutiques
  private colors = ['#32bcae', '#13514b'];
  
  // Icônes par défaut (vous pouvez améliorer la logique selon la catégorie)
  private icons = [
    'bi bi-bag',
    'bi bi-laptop',
    'bi bi-book',
    'bi bi-cup-straw',
    'bi bi-heart',
    'bi bi-trophy'
  ];

  ngOnInit(): void {
    this.loadBoutiques();
  }

  loadBoutiques(): void {
    this.loading = true;
    this.error = '';
    
    this.boutiqueService.getAllBoutiques().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Transformer les données de l'API pour les adapter à l'interface
          this.boutiques = response.data.map((boutique: any, index: number) => ({
            ...boutique,
            // Assigner des positions aléatoires ou prédéfinies
            x: this.getRandomPosition(20, 80),
            y: this.getRandomPosition(20, 80),
            // Alterner les couleurs
            color: this.colors[index % this.colors.length],
            // Assigner une icône
            icon: this.icons[index % this.icons.length]
          }));
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des boutiques:', err);
        this.error = 'Impossible de charger les boutiques. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  // Générer une position aléatoire entre min et max
  private getRandomPosition(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  get filteredBoutiques(): Boutique[] {
    if (!this.searchTerm) {
      return this.boutiques;
    }
    return this.boutiques.filter(b => 
      b.nom_boutique.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      b.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onBoutiqueHover(boutique: Boutique): void {
    this.hoveredBoutique = boutique;
  }

  onBoutiqueLeave(): void {
    this.hoveredBoutique = null;
  }

  onPointHover(boutique: Boutique): void {
    this.hoveredBoutique = boutique;
  }

  onPointLeave(): void {
    this.hoveredBoutique = null;
  }

  selectBoutique(boutique: Boutique): void {
    this.selectedBoutique = this.selectedBoutique?._id === boutique._id ? null : boutique;
  }

  getTooltipX(x: number): number {
    // Ajuster la position pour éviter que le tooltip sorte de l'écran
    return x > 70 ? x - 15 : x + 5;
  }

  getBoutiqueIndex(boutique: Boutique): number {
    return this.boutiques.findIndex(b => b._id === boutique._id) + 1;
  }
}