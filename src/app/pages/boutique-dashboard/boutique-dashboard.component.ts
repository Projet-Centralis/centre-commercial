import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface VenteJournaliere {
  date: string;
  montant: number;
  nombreVentes: number;
}

interface ProduitPopulaire {
  nom: string;
  categorie: string;
  ventes: number;
  revenu: number;
  tendance: 'up' | 'down' | 'stable';
}

interface ProspectClient {
  nom: string;
  email: string;
  derniereVisite: string;
  statut: 'actif' | 'inactif' | 'potentiel';
}

@Component({
  selector: 'app-boutique-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boutique-dashboard.component.html',
  styleUrls: ['./boutique-dashboard.component.css']
})
export class BoutiqueDashboardComponent implements OnInit {
  // Statistiques principales
  ventesTotales = 0;
  ventesAujourdhui = 0;
  nombreClients = 0;
  nouveauxClients = 0;
  tauxConversion = 0;
  revenuMensuel = 0;

  // Données pour les graphiques
  ventesJournalieres: VenteJournaliere[] = [];
  produitsPopulaires: ProduitPopulaire[] = [];
  prospectsClients: ProspectClient[] = [];

  // Loading state
  isLoading = false;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Simulation de chargement des données
    setTimeout(() => {
      // Données simulées
      this.ventesTotales = 12450;
      this.ventesAujourdhui = 1250;
      this.nombreClients = 342;
      this.nouveauxClients = 12;
      this.tauxConversion = 23.5;
      this.revenuMensuel = 28750;

      // Ventes journalières
      this.ventesJournalieres = [
        { date: 'Lun', montant: 1850, nombreVentes: 24 },
        { date: 'Mar', montant: 2100, nombreVentes: 28 },
        { date: 'Mer', montant: 1750, nombreVentes: 22 },
        { date: 'Jeu', montant: 2400, nombreVentes: 31 },
        { date: 'Ven', montant: 1950, nombreVentes: 25 },
        { date: 'Sam', montant: 2850, nombreVentes: 38 },
        { date: 'Dim', montant: 1250, nombreVentes: 16 }
      ];

      // Produits populaires
      this.produitsPopulaires = [
        { nom: 'T-shirt Premium', categorie: 'Vêtements', ventes: 156, revenu: 4680, tendance: 'up' },
        { nom: 'Casque Audio', categorie: 'Électronique', ventes: 89, revenu: 7120, tendance: 'stable' },
        { nom: 'Chaussures Sport', categorie: 'Chaussures', ventes: 67, revenu: 4020, tendance: 'up' },
        { nom: 'Sac à dos', categorie: 'Accessoires', ventes: 45, revenu: 1800, tendance: 'down' },
        { nom: 'Montre Connectée', categorie: 'Électronique', ventes: 38, revenu: 4560, tendance: 'up' }
      ];

      // Prospects clients
      this.prospectsClients = [
        { nom: 'Jean Dupont', email: 'jean@email.com', derniereVisite: 'Aujourd\'hui', statut: 'actif' },
        { nom: 'Marie Martin', email: 'marie@email.com', derniereVisite: 'Hier', statut: 'potentiel' },
        { nom: 'Pierre Dubois', email: 'pierre@email.com', derniereVisite: '2 jours', statut: 'actif' },
        { nom: 'Sophie Bernard', email: 'sophie@email.com', derniereVisite: '3 jours', statut: 'inactif' },
        { nom: 'Thomas Leroy', email: 'thomas@email.com', derniereVisite: 'Aujourd\'hui', statut: 'potentiel' }
      ];

      this.isLoading = false;
    }, 1000);
  }

  // CORRECTION : Cette méthode doit être DANS la classe
  getCurrentDate(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return now.toLocaleDateString('fr-FR', options);
  }

  getVentesMax(): number {
    return Math.max(...this.ventesJournalieres.map(v => v.montant));
  }

  getBarHeight(montant: number): number {
    const max = this.getVentesMax();
    return max > 0 ? (montant / max) * 100 : 0;
  }

  getTendanceIcon(tendance: string): string {
    switch(tendance) {
      case 'up': return 'bi bi-arrow-up-circle-fill';
      case 'down': return 'bi bi-arrow-down-circle-fill';
      default: return 'bi bi-dash-circle-fill';
    }
  }

  getTendanceColor(tendance: string): string {
    switch(tendance) {
      case 'up': return '#32bcae';
      case 'down': return '#ff6b6b';
      default: return '#ffd93d';
    }
  }

  getStatutColor(statut: string): string {
    switch(statut) {
      case 'actif': return '#32bcae';
      case 'potentiel': return '#ffd93d';
      case 'inactif': return '#ff6b6b';
      default: return '#13514b';
    }
  }

  formatCurrency(montant: number): string {
    return montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  }
}