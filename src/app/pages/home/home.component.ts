import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueService } from '../../services/boutique.service';
import { AuthService } from '../../services/auth.service';

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
  x?: number;
  y?: number;
  color?: string;
  icon?: string;
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
  private authService = inject(AuthService);

  userName: string = '';

  searchTerm: string = '';
  selectedBoutique: Boutique | null = null;
  hoveredBoutique: Boutique | null = null;
  boutiques: Boutique[] = [];
  loading: boolean = true;
  error: string = '';

  private colors = ['#32bcae', '#13514b'];

  private icons = [
    'bi bi-bag',
    'bi bi-laptop',
    'bi bi-book',
    'bi bi-cup-straw',
    'bi bi-heart',
    'bi bi-trophy'
  ];

  ngOnInit(): void {
    this.loadUser();
    this.loadBoutiques();
  }

  private loadUser(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      // Tu peux remplacer par user.name si tu l’as côté backend
      this.userName = user.email.split('@')[0];
    }
  }

  loadBoutiques(): void {
    this.loading = true;
    this.error = '';

    this.boutiqueService.getAllBoutiques().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.boutiques = response.data.map((boutique: any, index: number) => ({
            ...boutique,
            x: this.getRandomPosition(20, 80),
            y: this.getRandomPosition(20, 80),
            color: this.colors[index % this.colors.length],
            icon: this.icons[index % this.icons.length]
          }));
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les boutiques. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  private getRandomPosition(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  get filteredBoutiques(): Boutique[] {
    if (!this.searchTerm) return this.boutiques;

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
    this.selectedBoutique =
      this.selectedBoutique?._id === boutique._id ? null : boutique;
  }

  getTooltipX(x: number): number {
    return x > 70 ? x - 15 : x + 5;
  }

  getBoutiqueIndex(boutique: Boutique): number {
    return this.boutiques.findIndex(b => b._id === boutique._id) + 1;
  }
}
