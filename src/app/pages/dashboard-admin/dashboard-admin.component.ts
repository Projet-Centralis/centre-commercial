import { Component, OnInit, OnDestroy, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { StatistiquesAdminService, TopVente, LoyerImpaye, CAGlobal } from '../../services/statistiquesAdmin.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit, OnDestroy, AfterViewInit {
  private statsService = inject(StatistiquesAdminService);
  private destroy$ = new Subject<void>();

  currentDate = new Date();

  // Données
  caGlobal: CAGlobal | null = null;
  topVentes: TopVente[] = [];
  loyersImpayes: LoyerImpaye[] = [];
  ventesStats: any = null;

  // États de chargement
  loadingCaGlobal = false;
  loadingTopVentes = false;
  loadingLoyers = false;
  loadingVentesStats = false;

  // Messages d'erreur
  errorCaGlobal: string | null = null;
  errorTopVentes: string | null = null;
  errorLoyers: string | null = null;
  errorVentesStats: string | null = null;

  // Graphiques
  @ViewChild('caChart') caChart!: BaseChartDirective;
  @ViewChild('topVentesChart') topVentesChart!: BaseChartDirective;
  @ViewChild('impayesChart') impayesChart!: BaseChartDirective;

  // Configuration des graphiques
  // Graphique d'évolution du CA (simulé pour l'exemple)
  caChartData: ChartData<'line'> = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0],
        label: 'Chiffre d\'affaires',
        backgroundColor: 'rgba(50, 188, 174, 0.2)',
        borderColor: '#32bcae',
        pointBackgroundColor: '#32bcae',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#32bcae',
        fill: 'origin',
        tension: 0.4
      }
    ]
  };

  caChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#a0a0c0' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#a0a0c0' }
      }
    },
    elements: { line: { borderWidth: 3 } }
  };

  // Graphique Top Ventes (camembert)
  topVentesChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#32bcae',
        '#4fd1c5',
        '#6b46c1',
        '#805ad5',
        '#9f7aea'
      ],
      borderColor: '#101324',
      borderWidth: 3,
      hoverOffset: 10
    }]
  };

  topVentesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#ffffff', font: { size: 12 } }
      }
    }  };

  // Graphique Loyers Impayés (barres horizontales)
  impayesChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Montant impayé',
      backgroundColor: 'rgba(255, 138, 92, 0.8)',
      borderColor: '#ff8a5c',
      borderWidth: 2,
      borderRadius: 8,
      barPercentage: 0.6
    }]
  };

  impayesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: { 
        callbacks: {
          label: (context) => `Montant: ${this.formatCurrency(context.raw as number)}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { 
          color: '#a0a0c0',
          callback: (value) => this.formatCurrency(value as number)
        }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#a0a0c0' }
      }
    }
  };

  ngOnInit(): void {
    this.loadAllStats();
    this.generateMockChartData(); // À remplacer par vos vraies données
  }

  ngAfterViewInit(): void {
    // Animation des graphiques au chargement
    setTimeout(() => this.updateCharts(), 500);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAllStats(): void {
    this.loadCAGlobal();
    this.loadTopVentes();
    this.loadLoyersImpayes();
  }

  refresh(): void {
    this.loadAllStats();
  }

  isAnyLoading(): boolean {
    return this.loadingCaGlobal || this.loadingTopVentes || this.loadingLoyers || this.loadingVentesStats;
  }

  private updateCharts(): void {
  this.updateCaChart();
  this.updateTopVentesChart();
  this.updateImpayesChart();
}

  private loadCAGlobal(): void {
    this.loadingCaGlobal = true;
    this.errorCaGlobal = null;
    this.statsService.getCAGlobal()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loadingCaGlobal = false;
          if (res.success && res.data) {
            this.caGlobal = res.data;
            this.updateCaChart();
          } else {
            this.errorCaGlobal = res.message || 'Erreur lors du chargement du CA global';
          }
        },
        error: () => {
          this.loadingCaGlobal = false;
          this.errorCaGlobal = 'Une erreur technique est survenue';
        }
      });
  }

  private loadTopVentes(): void {
    this.loadingTopVentes = true;
    this.errorTopVentes = null;
    this.statsService.getTopVentes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loadingTopVentes = false;
          if (res.success && res.data) {
            this.topVentes = res.data;
            this.updateTopVentesChart();
          } else {
            this.errorTopVentes = res.message || 'Erreur lors du chargement du top ventes';
          }
        },
        error: () => {
          this.loadingTopVentes = false;
          this.errorTopVentes = 'Une erreur technique est survenue';
        }
      });
  }

  private loadLoyersImpayes(): void {
    this.loadingLoyers = true;
    this.errorLoyers = null;
    this.statsService.getLoyersImpayes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loadingLoyers = false;
          if (res.success && res.data) {
            this.loyersImpayes = res.data;
            this.updateImpayesChart();
          } else {
            this.errorLoyers = res.message || 'Erreur lors du chargement des loyers impayés';
          }
        },
        error: () => {
          this.loadingLoyers = false;
          this.errorLoyers = 'Une erreur technique est survenue';
        }
      });
  }

  // Mise à jour des graphiques avec les données réelles
  private updateCaChart(): void {
    if (!this.caGlobal) return;
    
    // Simulation d'évolution mensuelle (à remplacer par vos vraies données)
    const monthlyData = this.generateMonthlyData(this.caGlobal.caTotal);
    this.caChartData.datasets[0].data = monthlyData;
    this.caChart?.update();
  }

  private updateTopVentesChart(): void {
    if (this.topVentes.length === 0) return;

    const top5 = this.topVentes.slice(0, 5);
    this.topVentesChartData.labels = top5.map(v => v.nom_boutique);
    this.topVentesChartData.datasets[0].data = top5.map(v => v.totalCA);
    this.topVentesChart?.update();
  }

  private updateImpayesChart(): void {
    if (this.loyersImpayes.length === 0) return;

    const topImpayes = this.loyersImpayes.slice(0, 7);
    this.impayesChartData.labels = topImpayes.map(i => i._id);
    this.impayesChartData.datasets[0].data = topImpayes.map(i => i.totalImpaye);
    this.impayesChart?.update();
  }

  // Génération de données mock pour l'exemple
  private generateMockChartData(): void {
    // Simulation de données mensuelles
    const mockMonthlyData = [45000, 52000, 49000, 58000, 62000, 71000];
    this.caChartData.datasets[0].data = mockMonthlyData;
  }

  private generateMonthlyData(total: number): number[] {
    // Génère une progression mensuelle basée sur le total
    const months = 6;
    const baseValue = total / months;
    return Array.from({ length: months }, (_, i) => 
      Math.round(baseValue * (0.7 + (i * 0.1) + Math.random() * 0.2))
    );
  }

  // Formateurs
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatCompactNumber(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M€';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'k€';
    }
    return value + '€';
  }
}