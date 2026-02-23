import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoyerService, ContratLoyer, PaiementLoyer, StatistiquesLoyer, EcheanceLoyer } from '../../services/loyer.service';

@Component({
  selector: 'app-boutique-loyer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './boutique-loyer.component.html',
  styleUrls: ['./boutique-loyer.component.css']
})
export class BoutiqueLoyerComponent implements OnInit {
  contrats: ContratLoyer[] = [];
  paiements: PaiementLoyer[] = [];
  statistiques: StatistiquesLoyer | null = null;
  echeances: EcheanceLoyer[] = [];
  contratActif: ContratLoyer | null = null;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ongletActif: 'tableau' | 'historique' | 'contrats' = 'tableau';

  showPaiementModal = false;
  showContratModal = false;
  showFactureModal = false;
  isEditing = false;

  paiementSelectionne: PaiementLoyer | null = null;

  paiementForm: Partial<PaiementLoyer> = {
    contrat: '',
    mois: new Date(),
    montant_du: 0,
    montant_paye: 0,
    statut: 'en_attente'
  };

  contratForm: Partial<ContratLoyer> = {
    boutique: '',
    montant_mensuel: 0,
    jour_echeance: 5,
    date_debut: new Date(),
    date_fin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    is_active: true
  };

  filtreStatut: string = 'tous';
  filtreRecherche: string = '';

  constructor(private loyerService: LoyerService) {
    console.log('BoutiqueLoyerComponent chargé');
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    Promise.all([
      this.loadContrats(),
      this.loadPaiements(),
      this.loadStatistiques(),
      this.loadEcheances(),
      this.loadContratActif()
    ]).catch(error => {
      console.error('Erreur chargement données:', error);
      this.errorMessage = 'Erreur lors du chargement des données';
    }).finally(() => {
      this.isLoading = false;
    });
  }

  loadContrats(): Promise<void> {
    return new Promise((resolve) => {
      this.loyerService.getContrats().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.contrats = response.data;
          }
          resolve();
        },
        error: (error) => {
          console.error('Erreur contrats:', error);
          resolve();
        }
      });
    });
  }

  loadContratActif(): Promise<void> {
    return new Promise((resolve) => {
      this.loyerService.getContratActif().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.contratActif = response.data;
          }
          resolve();
        },
        error: (error) => {
          console.error('Erreur contrat actif:', error);
          resolve();
        }
      });
    });
  }

  loadPaiements(): Promise<void> {
    return new Promise((resolve) => {
      this.loyerService.getPaiements().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.paiements = response.data;
          }
          resolve();
        },
        error: (error) => {
          console.error('Erreur paiements:', error);
          resolve();
        }
      });
    });
  }

  loadStatistiques(): Promise<void> {
    return new Promise((resolve) => {
      this.loyerService.getStatistiques().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.statistiques = response.data;
          }
          resolve();
        },
        error: (error) => {
          console.error('Erreur statistiques:', error);
          resolve();
        }
      });
    });
  }

  loadEcheances(): Promise<void> {
    return new Promise((resolve) => {
      this.loyerService.getEcheances().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.echeances = response.data;
          }
          resolve();
        },
        error: (error) => {
          console.error('Erreur échéances:', error);
          resolve();
        }
      });
    });
  }

  openCreatePaiementModal(): void {
    if (!this.contratActif) {
      this.errorMessage = 'Aucun contrat actif trouvé. Vous ne pouvez pas enregistrer de paiement.';
      return;
    }
    
    this.isEditing = false;
    this.paiementForm = {
      contrat: this.contratActif._id,
      mois: new Date(),
      montant_du: this.contratActif.montant_mensuel,
      montant_paye: this.contratActif.montant_mensuel,
      statut: 'en_attente'
    };
    this.showPaiementModal = true;
    this.errorMessage = '';
  }

  openCreatePaiementForContrat(contrat: ContratLoyer): void {
    this.isEditing = false;
    this.paiementForm = {
      contrat: contrat._id,
      mois: new Date(),
      montant_du: contrat.montant_mensuel,
      montant_paye: contrat.montant_mensuel,
      statut: 'en_attente'
    };
    this.showPaiementModal = true;
    this.errorMessage = '';
  }

  openEditPaiementModal(paiement: PaiementLoyer): void {
    this.isEditing = true;
    this.paiementSelectionne = paiement;
    this.paiementForm = {
      contrat: typeof paiement.contrat === 'string' ? paiement.contrat : paiement.contrat._id,
      mois: new Date(paiement.mois),
      montant_du: paiement.montant_du,
      montant_paye: paiement.montant_paye,
      statut: paiement.statut
    };
    this.showPaiementModal = true;
    this.errorMessage = '';
  }

  closePaiementModal(): void {
    this.showPaiementModal = false;
    this.paiementSelectionne = null;
    this.paiementForm = {
      contrat: '',
      mois: new Date(),
      montant_du: 0,
      montant_paye: 0,
      statut: 'en_attente'
    };
  }

  // submitPaiement(): void {
  //   if (!this.validatePaiementForm()) {
  //     return;
  //   }

  //   this.isLoading = true;
  //   this.errorMessage = '';

  //   let moisDate: Date;
  //   if (typeof this.paiementForm.mois === 'string') {
  //     const [year, month] = this.paiementForm.mois.split('-');
  //     moisDate = new Date(parseInt(year), parseInt(month) - 1, 1);
  //   } else {
  //     moisDate = this.paiementForm.mois as Date;
  //   }

  //   const paiementData = {
  //     contrat: this.paiementForm.contrat,
  //     mois: moisDate,
  //     montant_du: this.paiementForm.montant_du,
  //     montant_paye: this.paiementForm.montant_paye,
  //     statut: this.paiementForm.statut
  //   };

  //   if (this.isEditing && this.paiementSelectionne) {
  //     this.loyerService.updatePaiement(this.paiementSelectionne._id, paiementData).subscribe({
  //       next: (response) => {
  //         if (response.success) {
  //           this.showSuccess('Paiement mis à jour avec succès');
  //           this.loadPaiements();
  //           this.loadStatistiques();
  //           this.closePaiementModal();
  //         } else {
  //           this.errorMessage = response.message || 'Erreur lors de la mise à jour';
  //         }
  //         this.isLoading = false;
  //       },
  //       error: (error) => {
  //         console.error('Erreur:', error);
  //         this.errorMessage = 'Erreur de connexion au serveur';
  //         this.isLoading = false;
  //       }
  //     });
  //   } else {
  //     this.loyerService.createPaiement(paiementData).subscribe({
  //       next: (response) => {
  //         if (response.success) {
  //           this.showSuccess('Paiement enregistré avec succès');
  //           this.loadPaiements();
  //           this.loadStatistiques();
  //           this.loadEcheances();
  //           this.closePaiementModal();
  //         } else {
  //           this.errorMessage = response.message || 'Erreur lors de la création';
  //         }
  //         this.isLoading = false;
  //       },
  //       error: (error) => {
  //         console.error('Erreur:', error);
  //         this.errorMessage = 'Erreur de connexion au serveur';
  //         this.isLoading = false;
  //       }
  //     });
  //   }
  // }
  submitPaiement(): void {
  if (!this.validatePaiementForm()) {
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  // Correction: Vérifier le type et convertir correctement
  let moisDate: Date;
  
  if (typeof this.paiementForm.mois === 'string') {
    // Si c'est une chaîne au format "YYYY-MM"
    const [year, month] = (this.paiementForm.mois as string).split('-');
    moisDate = new Date(parseInt(year), parseInt(month) - 1, 1);
  } else if (this.paiementForm.mois instanceof Date) {
    // Si c'est déjà un objet Date
    moisDate = this.paiementForm.mois;
  } else {
    // Fallback: date actuelle
    console.warn('Format de mois inattendu, utilisation de la date actuelle');
    moisDate = new Date();
  }

  const paiementData = {
    contrat: this.paiementForm.contrat,
    mois: moisDate,
    montant_du: this.paiementForm.montant_du,
    montant_paye: this.paiementForm.montant_paye,
    statut: this.paiementForm.statut
  };

  if (this.isEditing && this.paiementSelectionne) {
    this.loyerService.updatePaiement(this.paiementSelectionne._id, paiementData).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccess('Paiement mis à jour avec succès');
          this.loadPaiements();
          this.loadStatistiques();
          this.closePaiementModal();
        } else {
          this.errorMessage = response.message || 'Erreur lors de la mise à jour';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Erreur de connexion au serveur';
        this.isLoading = false;
      }
    });
  } else {
    this.loyerService.createPaiement(paiementData).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccess('Paiement enregistré avec succès');
          this.loadPaiements();
          this.loadStatistiques();
          this.loadEcheances();
          this.closePaiementModal();
        } else {
          this.errorMessage = response.message || 'Erreur lors de la création';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Erreur de connexion au serveur';
        this.isLoading = false;
      }
    });
  }
}

getMoisPayes(): number {
  if (!this.contratActif || !this.paiements) return 0;
  
  // Compter les paiements payés pour l'année en cours
  const anneeEnCours = new Date().getFullYear();
  return this.paiements.filter(p => {
    const datePaiement = new Date(p.mois);
    return p.statut === 'paye' && datePaiement.getFullYear() === anneeEnCours;
  }).length;
}

getMoisRestants(): number {
  if (!this.contratActif) return 0;
  return 12 - this.getMoisPayes();
}

getProgressionAnnuelle(): number {
  return (this.getMoisPayes() / 12) * 100;
}

getTotalAnnuel(): number {
  if (!this.contratActif) return 0;
  return this.contratActif.montant_mensuel * 12;
}

  deletePaiement(paiement: PaiementLoyer): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      this.isLoading = true;
      this.loyerService.deletePaiement(paiement._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccess('Paiement supprimé avec succès');
            this.loadPaiements();
            this.loadStatistiques();
          } else {
            this.errorMessage = response.message || 'Erreur lors de la suppression';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.errorMessage = 'Erreur de connexion au serveur';
          this.isLoading = false;
        }
      });
    }
  }

  validatePaiementForm(): boolean {
    if (!this.paiementForm.contrat) {
      this.errorMessage = 'Le contrat est requis';
      return false;
    }
    if (!this.paiementForm.mois) {
      this.errorMessage = 'Le mois est requis';
      return false;
    }
    if (!this.paiementForm.montant_du || this.paiementForm.montant_du <= 0) {
      this.errorMessage = 'Le montant dû doit être supérieur à 0';
      return false;
    }
    if (this.paiementForm.montant_paye === undefined || this.paiementForm.montant_paye < 0) {
      this.errorMessage = 'Le montant payé est requis';
      return false;
    }
    return true;
  }

  openFactureModal(paiement: PaiementLoyer): void {
    this.paiementSelectionne = paiement;
    this.showFactureModal = true;
  }

  closeFactureModal(): void {
    this.showFactureModal = false;
    this.paiementSelectionne = null;
  }

  telechargerFacture(): void {
    if (!this.paiementSelectionne) return;

    this.loyerService.telechargerFacture(this.paiementSelectionne._id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${this.paiementSelectionne?._id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.closeFactureModal();
        this.showSuccess('Facture téléchargée avec succès');
      },
      error: (error) => {
        console.error('Erreur téléchargement:', error);
        this.errorMessage = 'Erreur lors du téléchargement de la facture';
      }
    });
  }

  imprimerFacture(): void {
    if (!this.paiementSelectionne) return;

    this.loyerService.telechargerFacture(this.paiementSelectionne._id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const printWindow = window.open(url);
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
        this.closeFactureModal();
      },
      error: (error) => {
        console.error('Erreur impression:', error);
        this.errorMessage = 'Erreur lors de l\'impression de la facture';
      }
    });
  }

  submitContrat(): void {
    if (!this.validateContratForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditing && this.contratActif) {
      this.loyerService.updateContrat(this.contratActif._id, this.contratForm).subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccess('Contrat mis à jour avec succès');
            this.loadContrats();
            this.loadContratActif();
            this.closeContratModal();
          } else {
            this.errorMessage = response.message || 'Erreur lors de la mise à jour';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.errorMessage = 'Erreur de connexion au serveur';
          this.isLoading = false;
        }
      });
    } else {
      this.loyerService.createContrat(this.contratForm).subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccess('Contrat créé avec succès');
            this.loadContrats();
            this.loadContratActif();
            this.closeContratModal();
          } else {
            this.errorMessage = response.message || 'Erreur lors de la création';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.errorMessage = 'Erreur de connexion au serveur';
          this.isLoading = false;
        }
      });
    }
  }

  validateContratForm(): boolean {
    if (!this.contratForm.montant_mensuel || this.contratForm.montant_mensuel <= 0) {
      this.errorMessage = 'Le montant mensuel doit être supérieur à 0';
      return false;
    }
    if (!this.contratForm.jour_echeance || this.contratForm.jour_echeance < 1 || this.contratForm.jour_echeance > 31) {
      this.errorMessage = 'Le jour d\'échéance doit être compris entre 1 et 31';
      return false;
    }
    if (!this.contratForm.date_debut) {
      this.errorMessage = 'La date de début est requise';
      return false;
    }
    if (!this.contratForm.date_fin) {
      this.errorMessage = 'La date de fin est requise';
      return false;
    }
    
    const dateDebut = new Date(this.contratForm.date_debut);
    const dateFin = new Date(this.contratForm.date_fin);
    
    if (dateFin <= dateDebut) {
      this.errorMessage = 'La date de fin doit être postérieure à la date de début';
      return false;
    }
    
    return true;
  }

  openCreateContratModal(): void {
    this.isEditing = false;
    this.contratForm = {
      boutique: '',
      montant_mensuel: 0,
      jour_echeance: 5,
      date_debut: new Date(),
      date_fin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      is_active: true
    };
    this.showContratModal = true;
    this.errorMessage = '';
  }

  openEditContratModal(contrat: ContratLoyer): void {
    this.isEditing = true;
    this.paiementSelectionne = null;
    this.contratForm = {
      boutique: typeof contrat.boutique === 'string' ? contrat.boutique : contrat.boutique._id,
      montant_mensuel: contrat.montant_mensuel,
      jour_echeance: contrat.jour_echeance,
      date_debut: new Date(contrat.date_debut),
      date_fin: new Date(contrat.date_fin),
      is_active: contrat.is_active
    };
    this.showContratModal = true;
    this.errorMessage = '';
  }

  closeContratModal(): void {
    this.showContratModal = false;
    this.contratForm = {
      boutique: '',
      montant_mensuel: 0,
      jour_echeance: 5,
      date_debut: new Date(),
      date_fin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      is_active: true
    };
  }

  getPaiementsFiltres(): PaiementLoyer[] {
    let filtered = [...this.paiements];

    if (this.filtreStatut !== 'tous') {
      filtered = filtered.filter(p => p.statut === this.filtreStatut);
    }

    if (this.filtreRecherche.trim()) {
      const search = this.filtreRecherche.toLowerCase();
      filtered = filtered.filter(p => {
        const boutique = typeof p.boutique === 'object' ? p.boutique?.nom_boutique : '';
        return (boutique?.toLowerCase() || '').includes(search) ||
               this.formatMois(p.mois).toLowerCase().includes(search);
      });
    }

    return filtered;
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  getStatutText(statut: string): string {
    return this.loyerService.getStatutText(statut);
  }

  getStatutColor(statut: string): string {
    return this.loyerService.getStatutColor(statut);
  }

  formatMontant(montant: number): string {
    return this.loyerService.formatMontant(montant);
  }

  formatDate(date: Date | string): string {
    return this.loyerService.formatDate(date);
  }

  formatMois(date: Date | string): string {
    return this.loyerService.formatMois(date);
  }

  getJoursRestantText(jours: number): string {
    if (jours < 0) return 'En retard';
    if (jours === 0) return 'Aujourd\'hui';
    if (jours === 1) return 'Demain';
    return `Dans ${jours} jours`;
  }

  getJoursRestantColor(jours: number): string {
    if (jours < 0) return '#ff6b6b';
    if (jours <= 3) return '#ffd93d';
    return '#32bcae';
  }

  getProgressionPaiements(): number {
    if (!this.statistiques) return 0;
    const total = this.statistiques.totalPaye + this.statistiques.totalAttente;
    if (total === 0) return 0;
    return Math.round((this.statistiques.totalPaye / total) * 100);
  }

  get nomBoutique(): string {
    if (this.contratActif && typeof this.contratActif.boutique === 'object') {
      return this.contratActif.boutique.nom_boutique;
    }
    return 'Ma boutique';
  }

  getJoursRestant(): number {
    if (!this.contratActif) return 0;
    
    const aujourdhui = new Date();
    const jourEcheance = this.contratActif.jour_echeance;
    
    let prochaineEcheance = new Date(
      aujourdhui.getFullYear(),
      aujourdhui.getMonth(),
      jourEcheance
    );
    
    if (prochaineEcheance < aujourdhui) {
      prochaineEcheance = new Date(
        aujourdhui.getFullYear(),
        aujourdhui.getMonth() + 1,
        jourEcheance
      );
    }
    
    return Math.ceil((prochaineEcheance.getTime() - aujourdhui.getTime()) / (1000 * 60 * 60 * 24));
  }

  getMaxHistorique(): number {
    if (!this.statistiques || !this.statistiques.historiqueMensuel || this.statistiques.historiqueMensuel.length === 0) {
      return 1;
    }
    return Math.max(...this.statistiques.historiqueMensuel.map(item => item.total));
  }

  getMoisLabel(mois: number): string {
    const moisLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    return moisLabels[mois - 1] || '';
  }

  getNomBoutique(objet: any): string {
    if (!objet) return 'Boutique';
    if (typeof objet === 'object' && objet.nom_boutique) {
      return objet.nom_boutique;
    }
    return 'Boutique';
  }
}