import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrevisionService, Prevision, ChiffreAffaires, PrevisionGeneree } from '../../services/prevision.service';

@Component({
  selector: 'app-boutique-prevision',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './boutique-prevision.component.html',
  styleUrls: ['./boutique-prevision.component.css']
})
export class BoutiquePrevisionComponent implements OnInit {
  // Données
  chiffreAffaires: ChiffreAffaires | null = null;
  previsionsGenerees: PrevisionGeneree | null = null;
  previsionsSemaine: Prevision[] = [];
  previsionAujourdhui: Prevision | null = null;

  // États
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Période sélectionnée
  periodeSelectionnee: 'jour' | 'semaine' | 'mois' | 'annee' = 'semaine';

  // Objectif de croissance
  objectifCroissance = 10;

  constructor(private previsionService: PrevisionService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Charger toutes les données en parallèle
    Promise.all([
      this.loadChiffreAffaires(),
      this.loadPrevisionsGenerees(),
      this.loadPrevisionAujourdhui(),
      this.loadPrevisionsSemaine()
    ]).catch(error => {
      console.error('Erreur chargement données:', error);
      this.errorMessage = 'Erreur lors du chargement des données';
    }).finally(() => {
      this.isLoading = false;
    });
  }

  loadChiffreAffaires(): Promise<void> {
    return new Promise((resolve) => {
      this.previsionService.getChiffreAffaires().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.chiffreAffaires = response.data;
          }
          resolve();
        },
        error: (error) => {
          console.error('Erreur chiffre affaires:', error);
          resolve();
        }
      });
    });
  }

  loadPrevisionsGenerees(): Promise<void> {
    return new Promise((resolve) => {
      this.previsionService.genererPrevisions().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.previsionsGenerees = response.data;
          }
          resolve();
        },
        error: (error) => {
          console.error('Erreur prévisions générées:', error);
          resolve();
        }
      });
    });
  }

  loadPrevisionAujourdhui(): Promise<void> {
    return new Promise((resolve) => {
      this.previsionService.getPrevisionAujourdhui().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.previsionAujourdhui = response.data;
          }
          resolve();
        },
        error: (error) => {
          console.error('Erreur prévision aujourd\'hui:', error);
          resolve();
        }
      });
    });
  }

  loadPrevisionsSemaine(): Promise<void> {
    return new Promise((resolve) => {
      this.previsionService.getPrevisionsSemaine().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.previsionsSemaine = response.data;
          }
          resolve();
        },
        error: (error) => {
          console.error('Erreur prévisions semaine:', error);
          resolve();
        }
      });
    });
  }

  refreshData(): void {
    this.loadAllData();
    this.showSuccess('Données actualisées avec succès');
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  // Méthodes pour obtenir les données de la période sélectionnée
  getChiffrePeriode(): number {
    if (!this.chiffreAffaires) return 0;
    
    switch(this.periodeSelectionnee) {
      case 'jour': return this.chiffreAffaires.actuel.aujourdhui;
      case 'semaine': return this.chiffreAffaires.actuel.semaine;
      case 'mois': return this.chiffreAffaires.actuel.mois;
      case 'annee': return this.chiffreAffaires.actuel.annee;
      default: return 0;
    }
  }

  getObjectifPeriode(): number {
    if (!this.chiffreAffaires) return 0;
    
    switch(this.periodeSelectionnee) {
      case 'jour': return this.chiffreAffaires.objectifs.journalier;
      case 'semaine': return this.chiffreAffaires.objectifs.hebdomadaire;
      case 'mois': return this.chiffreAffaires.objectifs.mensuel;
      case 'annee': return this.chiffreAffaires.actuel.annee * 1.1;
      default: return 0;
    }
  }

  getProgressionPourcentage(): number {
    const actuel = this.getChiffrePeriode();
    const objectif = this.getObjectifPeriode();
    
    if (objectif === 0) return 0;
    return Math.min(100, Math.round((actuel / objectif) * 100));
  }

  getObjectifColor(): string {
    const progression = this.getProgressionPourcentage();
    if (progression >= 100) return '#32bcae';
    if (progression >= 70) return '#ffd93d';
    return '#ff6b6b';
  }

  // Méthodes utilitaires
  formatMontant(montant: number): string {
    return this.previsionService.formatMontant(montant);
  }

  getProbabiliteColor(probabilite: number): string {
    return this.previsionService.getProbabiliteColor(probabilite);
  }

  getStatutColor(statut: string): string {
    return this.previsionService.getStatutColor(statut);
  }

  getStatutText(statut: string): string {
    return this.previsionService.getStatutText(statut);
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
  }

  getTendanceIcon(tendance: string): string {
    switch(tendance) {
      case 'hausse': return 'bi bi-arrow-up-circle-fill';
      case 'baisse': return 'bi bi-arrow-down-circle-fill';
      default: return 'bi bi-dash-circle-fill';
    }
  }

  getTendanceColor(tendance: string): string {
    switch(tendance) {
      case 'hausse': return '#32bcae';
      case 'baisse': return '#ff6b6b';
      default: return '#ffd93d';
    }
  }
}