import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoyerService, ContratLoyer, PaiementLoyer } from '../../services/loyer.service';

@Component({
  selector: 'app-admin-loyers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="loyer-container">
      <div class="loyer-header">
        <div class="header-left">
          <h1>
            <i class="bi bi-building"></i>
            Gestion des Loyers - Admin
          </h1>
          <p class="subtitle">Gérez les contrats et validez les paiements des boutiques</p>
        </div>
        <div class="header-right">
          <button class="refresh-btn" (click)="loadData()" [disabled]="isLoading">
            <i class="bi" [class.bi-arrow-clockwise]="!isLoading" [class.bi-hourglass-split]="isLoading"></i>
            {{ isLoading ? 'Chargement...' : 'Actualiser' }}
          </button>
        </div>
      </div>

      <div *ngIf="successMessage" class="success-message">
        <i class="bi bi-check-circle"></i> {{ successMessage }}
      </div>
      <div *ngIf="errorMessage" class="error-message">
        <i class="bi bi-exclamation-triangle"></i> {{ errorMessage }}
      </div>

      <div *ngIf="isLoading" class="loading-state">
        <div class="loader"></div>
        <p>Chargement des données...</p>
      </div>

      <div *ngIf="!isLoading" class="loyer-content">
        <!-- Statistiques globales -->
        <div class="stats-grid" *ngIf="statsGlobales">
          <div class="stat-card">
            <div class="stat-icon total">
              <i class="bi bi-cash-stack"></i>
            </div>
            <div class="stat-content">
              <h3>Total collecté</h3>
              <div class="stat-value">{{ formatMontant(statsGlobales.totalCollecte) }}</div>
              <div class="stat-trend">
                <span>{{ statsGlobales.nbPaiements }} paiements</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon pending">
              <i class="bi bi-hourglass-split"></i>
            </div>
            <div class="stat-content">
              <h3>En attente</h3>
              <div class="stat-value">{{ statsGlobales.paiementsEnAttente }}</div>
              <div class="stat-trend">
                <span>{{ formatMontant(statsGlobales.montantEnAttente) }}</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="bi bi-building"></i>
            </div>
            <div class="stat-content">
              <h3>Boutiques</h3>
              <div class="stat-value">{{ statsGlobales.nbBoutiques }}</div>
              <div class="stat-trend">
                <span>{{ statsGlobales.nbContratsActifs }} contrats actifs</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon progress">
              <i class="bi bi-graph-up"></i>
            </div>
            <div class="stat-content">
              <h3>Moyenne / mois</h3>
              <div class="stat-value">{{ formatMontant(statsGlobales.moyenneMensuelle) }}</div>
            </div>
          </div>
        </div>

        <!-- Liste des contrats par boutique -->
        <div class="contrats-section">
          <h3>
            <i class="bi bi-list-ul"></i>
            Contrats par boutique
          </h3>

          <div class="contrats-list">
            <div *ngFor="let contrat of contrats" class="contrat-card-admin">
              <div class="contrat-header">
                <div class="boutique-info">
                  <h4>{{ contrat.boutique?.nom_boutique || 'Boutique' }}</h4>
                  <span class="badge" [class.actif]="contrat.is_active" [class.inactif]="!contrat.is_active">
                    {{ contrat.is_active ? 'ACTIF' : 'INACTIF' }}
                  </span>
                </div>
                <div class="contrat-montant">
                  {{ formatMontant(contrat.montant_mensuel) }}/mois
                </div>
              </div>

              <div class="contrat-stats">
                <div class="stat-item">
                  <span class="label">Total payé:</span>
                  <span class="value">{{ formatMontant(contrat.statistiques?.totalPaye || 0) }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">Mois payés:</span>
                  <span class="value">{{ contrat.statistiques?.moisPayes || 0 }} / {{ contrat.statistiques?.moisTotal || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">Progression:</span>
                  <div class="progress-bar-mini">
                    <div class="progress-fill" [style.width.%]="contrat.statistiques?.progression || 0"></div>
                  </div>
                </div>
              </div>

              <div class="contrat-actions">
                <button class="action-btn primary" (click)="showBoutiqueDetails(contrat.boutique._id)">
                  <i class="bi bi-eye"></i>
                  Voir détails
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Détails Boutique -->
    <div *ngIf="selectedBoutiqueId" class="modal-overlay" (click)="closeModal()">
      <div class="modal-content large" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>
            <i class="bi bi-building"></i>
            {{ selectedBoutique?.nom_boutique }}
          </h2>
          <button class="modal-close" (click)="closeModal()">
            <i class="bi bi-x"></i>
          </button>
        </div>

        <div class="modal-body" *ngIf="boutiqueDetails">
          <div class="details-stats">
            <div class="stat-mini-card">
              <span class="label">Total payé</span>
              <span class="value">{{ formatMontant(boutiqueDetails.statistiques.totalPaye) }}</span>
            </div>
            <div class="stat-mini-card">
              <span class="label">En attente</span>
              <span class="value">{{ boutiqueDetails.statistiques.paiementsEnAttente }}</span>
            </div>
          </div>

          <div class="section-title">
            <h4>Paiements en attente</h4>
            <button class="create-btn" (click)="showCreatePaiementModal()">
              <i class="bi bi-plus-circle"></i>
              Nouveau paiement
            </button>
          </div>

          <div class="paiements-list">
            <div *ngFor="let paiement of boutiqueDetails.paiements" class="paiement-item" [class]="paiement.statut">
              <div class="paiement-info">
                <span class="mois">{{ formatMois(paiement.mois) }}</span>
                <span class="montant">{{ formatMontant(paiement.montant_paye) }}</span>
              </div>
              <div class="paiement-status">
                <span class="status-badge" [style.background]="getStatutColor(paiement.statut)">
                  {{ getStatutText(paiement.statut) }}
                </span>
              </div>
              <div class="paiement-actions" *ngIf="paiement.statut === 'en_attente'">
                <button class="action-btn success" (click)="validerPaiement(paiement)" title="Valider">
                  <i class="bi bi-check-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Création Paiement Admin -->
    <div *ngIf="showCreateModal && selectedBoutique" class="modal-overlay" (click)="closeCreateModal()">
      <div class="modal-content payment-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>
            <i class="bi bi-cash"></i>
            Nouveau paiement
          </h2>
          <button class="modal-close" (click)="closeCreateModal()">
            <i class="bi bi-x"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="boutique-info-banner">
            <i class="bi bi-shop"></i>
            <span>{{ selectedBoutique.nom_boutique }}</span>
          </div>

          <form (ngSubmit)="submitPaiementAdmin()" class="modal-form">
            <!-- Contrat sélectionné automatiquement (caché) -->
            <input type="hidden" [value]="paiementForm.contrat" name="contrat" />

            <div class="form-group">
              <label>Contrat</label>
              <div class="contrat-display">
                {{ getContratDisplay() }}
              </div>
            </div>

            <div class="form-group">
              <label>Mois concerné *</label>
              <input type="month" [(ngModel)]="paiementForm.mois" name="mois" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Montant dû (€) *</label>
                <input type="number" [(ngModel)]="paiementForm.montant_du" name="montant_du" min="0" step="0.01" required>
              </div>

              <div class="form-group">
                <label>Montant payé (€) *</label>
                <input type="number" [(ngModel)]="paiementForm.montant_paye" name="montant_paye" min="0" step="0.01" required>
              </div>
            </div>

            <div class="info-note">
              <i class="bi bi-info-circle"></i>
              <span>Le paiement sera directement enregistré avec le statut "Payé"</span>
            </div>

            <div *ngIf="errorMessage" class="form-error">
              <i class="bi bi-exclamation-circle"></i> {{ errorMessage }}
            </div>

            <div class="modal-actions">
              <button type="button" class="cancel-btn" (click)="closeCreateModal()">Annuler</button>
              <button type="submit" class="submit-btn" [disabled]="isLoading">
                <span *ngIf="!isLoading">
                  <i class="bi bi-check-circle"></i> Enregistrer le paiement
                </span>
                <span *ngIf="isLoading">
                  <i class="bi bi-arrow-clockwise spin"></i> Traitement...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loyer-container {
      width: 100%;
      min-height: 100vh;
      background: #101324;
      padding: 20px;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      color: #ffffff;
    }

    .loyer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #13514b;
    }

    .header-left h1 {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-left h1 i {
      color: #32bcae;
      font-size: 32px;
    }

    .subtitle {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      margin: 0;
    }

    .refresh-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #13514b;
      border: 2px solid #32bcae;
      border-radius: 8px;
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .refresh-btn:hover:not(:disabled) {
      background: #32bcae;
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(50, 188, 174, 0.4);
    }

    .success-message, .error-message {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .success-message {
      background: rgba(50, 188, 174, 0.1);
      border: 1px solid #32bcae;
      color: #32bcae;
    }

    .error-message {
      background: rgba(255, 107, 107, 0.1);
      border: 1px solid #ff6b6b;
      color: #ff6b6b;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      gap: 20px;
    }

    .loader {
      width: 50px;
      height: 50px;
      border: 4px solid #13514b;
      border-top: 4px solid #32bcae;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: #1a1d2e;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      border: 2px solid #13514b;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      flex-shrink: 0;
    }

    .stat-icon.total {
      background: rgba(50, 188, 174, 0.2);
      color: #32bcae;
    }

    .stat-icon.pending {
      background: rgba(255, 217, 61, 0.2);
      color: #ffd93d;
    }

    .stat-icon.progress {
      background: rgba(50, 188, 174, 0.2);
      color: #32bcae;
    }

    .stat-content {
      flex: 1;
    }

    .stat-content h3 {
      color: rgba(255, 255, 255, 0.7);
      font-size: 13px;
      font-weight: 600;
      margin: 0 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
    }

    .stat-trend {
      color: #32bcae;
      font-size: 12px;
      margin-top: 5px;
    }

    .contrats-section h3 {
      color: #ffffff;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .contrats-section h3 i {
      color: #32bcae;
    }

    .contrats-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }

    .contrat-card-admin {
      background: #1a1d2e;
      border-radius: 12px;
      border: 2px solid #13514b;
      padding: 20px;
      transition: all 0.3s ease;
    }

    .contrat-card-admin:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    }

    .contrat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .boutique-info h4 {
      color: #ffffff;
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 5px 0;
    }

    .badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
    }

    .badge.actif {
      background: #32bcae;
      color: #ffffff;
    }

    .badge.inactif {
      background: #13514b;
      color: #ffffff;
    }

    .contrat-montant {
      color: #32bcae;
      font-size: 18px;
      font-weight: 600;
    }

    .contrat-stats {
      margin-bottom: 15px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }

    .stat-item .label {
      color: rgba(255,255,255,0.5);
      width: 100px;
      font-size: 13px;
    }

    .stat-item .value {
      color: #ffffff;
      font-weight: 600;
      font-size: 14px;
    }

    .progress-bar-mini {
      width: 150px;
      height: 6px;
      background: #101324;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #32bcae;
      transition: width 0.3s ease;
    }

    .contrat-actions {
      display: flex;
      justify-content: flex-end;
    }

    .action-btn.primary {
      background: linear-gradient(135deg, #13514b 0%, #32bcae 100%);
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .action-btn.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(50, 188, 174, 0.4);
    }

    /* Modal styles */
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
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      border: 2px solid #32bcae;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }

    .modal-content.large {
      max-width: 800px;
    }

    .modal-content.payment-modal {
      max-width: 550px;
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

    .modal-close {
      background: none;
      border: none;
      color: rgba(255,255,255,0.6);
      cursor: pointer;
      padding: 8px;
      font-size: 24px;
      transition: all 0.3s ease;
      border-radius: 6px;
    }

    .modal-close:hover {
      color: #ff6b6b;
      background: rgba(255,107,107,0.1);
    }

    .modal-body {
      padding: 25px;
    }

    .boutique-info-banner {
      background: #13514b;
      border-radius: 8px;
      padding: 12px 15px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #ffffff;
      font-size: 15px;
      font-weight: 600;
    }

    .boutique-info-banner i {
      color: #32bcae;
      font-size: 18px;
    }

    .details-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 25px;
    }

    .stat-mini-card {
      background: #101324;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      border: 2px solid #13514b;
    }

    .stat-mini-card .label {
      color: rgba(255,255,255,0.5);
      font-size: 12px;
      display: block;
      margin-bottom: 5px;
      text-transform: uppercase;
    }

    .stat-mini-card .value {
      color: #32bcae;
      font-size: 22px;
      font-weight: 700;
    }

    .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-title h4 {
      color: #ffffff;
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    .create-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: linear-gradient(135deg, #13514b 0%, #32bcae 100%);
      border: none;
      border-radius: 8px;
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .create-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(50, 188, 174, 0.4);
    }

    .paiements-list {
      max-height: 300px;
      overflow-y: auto;
      padding-right: 5px;
    }

    .paiements-list::-webkit-scrollbar {
      width: 6px;
    }

    .paiements-list::-webkit-scrollbar-track {
      background: #101324;
      border-radius: 3px;
    }

    .paiements-list::-webkit-scrollbar-thumb {
      background: #13514b;
      border-radius: 3px;
    }

    .paiements-list::-webkit-scrollbar-thumb:hover {
      background: #32bcae;
    }

    .paiement-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: #101324;
      border-radius: 8px;
      margin-bottom: 10px;
      border-left: 4px solid;
    }

    .paiement-item.paye {
      border-left-color: #32bcae;
    }

    .paiement-item.en_attente {
      border-left-color: #ffd93d;
    }

    .paiement-item.retard {
      border-left-color: #ff6b6b;
    }

    .paiement-info {
      flex: 1;
    }

    .paiement-info .mois {
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      display: block;
      margin-bottom: 4px;
    }

    .paiement-info .montant {
      color: #32bcae;
      font-size: 15px;
      font-weight: 600;
    }

    .status-badge {
      padding: 5px 12px;
      border-radius: 20px;
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .paiement-actions {
      margin-left: 10px;
    }

    .action-btn.success {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: none;
      background: rgba(50, 188, 174, 0.2);
      color: #32bcae;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: all 0.3s ease;
    }

    .action-btn.success:hover {
      background: #32bcae;
      color: #ffffff;
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .contrat-display {
      background: #101324;
      border: 2px solid #13514b;
      border-radius: 8px;
      padding: 12px;
      color: #32bcae;
      font-size: 14px;
      font-weight: 600;
    }

    .form-group input {
      padding: 12px;
      background: #101324;
      border: 2px solid #13514b;
      border-radius: 8px;
      color: #ffffff;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: #32bcae;
      box-shadow: 0 0 10px rgba(50, 188, 174, 0.3);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .info-note {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: rgba(50, 188, 174, 0.1);
      border: 1px solid #32bcae;
      border-radius: 8px;
      color: #32bcae;
      font-size: 13px;
    }

    .info-note i {
      font-size: 16px;
    }

    .form-error {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: rgba(255,107,107,0.1);
      border: 1px solid #ff6b6b;
      border-radius: 8px;
      color: #ff6b6b;
      font-size: 13px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 10px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .cancel-btn {
      padding: 12px 24px;
      background: rgba(255,255,255,0.1);
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 8px;
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-btn:hover {
      background: rgba(255,255,255,0.2);
    }

    .submit-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #13514b 0%, #32bcae 100%);
      border: none;
      border-radius: 8px;
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(50, 188, 174, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @media (max-width: 768px) {
      .contrats-list {
        grid-template-columns: 1fr;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminLoyersComponent implements OnInit {
  contrats: any[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  statsGlobales: any = null;

  selectedBoutiqueId: string | null = null;
  selectedBoutique: any = null;
  boutiqueDetails: any = null;

  showCreateModal = false;
  paiementForm: any = {
    contrat: '',
    mois: new Date(),
    montant_du: 0,
    montant_paye: 0
  };

  constructor(private loyerService: LoyerService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.loyerService.getAdminContrats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.contrats = response.data;
          this.calculerStatsGlobales();
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

  calculerStatsGlobales(): void {
    let totalCollecte = 0;
    let nbPaiements = 0;
    let paiementsEnAttente = 0;
    let montantEnAttente = 0;
    const boutiquesUniques = new Set();
    let nbContratsActifs = 0;

    this.contrats.forEach(contrat => {
      boutiquesUniques.add(contrat.boutique?._id);
      if (contrat.is_active) nbContratsActifs++;
      
      if (contrat.statistiques) {
        totalCollecte += contrat.statistiques.totalPaye || 0;
        nbPaiements += contrat.statistiques.moisPayes || 0;
      }
    });

    this.statsGlobales = {
      totalCollecte,
      nbPaiements,
      paiementsEnAttente,
      montantEnAttente,
      nbBoutiques: boutiquesUniques.size,
      nbContratsActifs,
      moyenneMensuelle: nbPaiements > 0 ? totalCollecte / nbPaiements : 0
    };
  }

  showBoutiqueDetails(boutiqueId: string): void {
    this.selectedBoutiqueId = boutiqueId;
    this.isLoading = true;

    this.loyerService.getAdminBoutiqueDetails(boutiqueId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.boutiqueDetails = response.data;
          this.selectedBoutique = response.data.boutique;
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

  closeModal(): void {
    this.selectedBoutiqueId = null;
    this.boutiqueDetails = null;
    this.selectedBoutique = null;
  }

  validerPaiement(paiement: any): void {
    if (confirm('Valider ce paiement ?')) {
      this.isLoading = true;
      this.loyerService.validerPaiement(paiement._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccess('Paiement validé avec succès');
            if (this.selectedBoutiqueId) {
              this.showBoutiqueDetails(this.selectedBoutiqueId);
            }
          } else {
            this.errorMessage = response.message || 'Erreur lors de la validation';
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

  showCreatePaiementModal(): void {
    const contratActif = this.boutiqueDetails?.contrats?.find((c: any) => c.is_active);
    
    if (contratActif) {
      this.paiementForm = {
        contrat: contratActif._id,
        mois: new Date(),
        montant_du: contratActif.montant_mensuel,
        montant_paye: contratActif.montant_mensuel
      };
      this.showCreateModal = true;
    } else {
      this.errorMessage = 'Aucun contrat actif trouvé pour cette boutique';
    }
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.errorMessage = '';
  }

  getContratDisplay(): string {
    const contratActif = this.boutiqueDetails?.contrats?.find((c: any) => c.is_active);
    if (!contratActif) return 'Aucun contrat actif';
    
    const debut = this.formatDate(contratActif.date_debut);
    const fin = this.formatDate(contratActif.date_fin);
    return `${debut} - ${fin} (${this.formatMontant(contratActif.montant_mensuel)}/mois)`;
  }

  submitPaiementAdmin(): void {
    if (!this.paiementForm.mois) {
      this.errorMessage = 'Veuillez sélectionner un mois';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const paiementData = {
      ...this.paiementForm,
      boutique: this.selectedBoutiqueId
    };

    this.loyerService.createPaiementAdmin(paiementData).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccess('Paiement enregistré avec succès');
          this.closeCreateModal();
          if (this.selectedBoutiqueId) {
            this.showBoutiqueDetails(this.selectedBoutiqueId);
          }
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
}