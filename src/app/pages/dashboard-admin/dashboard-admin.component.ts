// dashboard-admin.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatistiquesService, TopVente, LoyerImpaye, CAGlobal } from '../../services/statistiques.service';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType, Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {
  private statsService = inject(StatistiquesService);

  // Données
  caGlobal$!: Observable<CAGlobal | null>;
  topVentes$!: Observable<TopVente[]>;
  loyersImpayes$!: Observable<LoyerImpaye[]>;

  // États de chargement / erreur
  loading = {
    ca: true,
    top: true,
    loyers: true
  };
  error = {
    ca: false,
    top: false,
    loyers: false
  };

  // Configuration des graphiques (barres)
  barChartType: ChartType = 'bar';

  // Options communes aux graphiques (thème sombre)
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#13514b', titleColor: '#ffffff', bodyColor: '#ffffff' }
    },
    scales: {
      x: { ticks: { color: '#ffffff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { ticks: { color: '#ffffff' }, grid: { color: 'rgba(255,255,255,0.1)' } }
    }
  };

  // Données pour le graphique des top ventes (CA par boutique)
  topVentesChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  // Données pour le graphique des loyers impayés
  loyersChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  // Totaux pour les cartes
  totalLoyersImpayes = 0;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    // CA global
    this.caGlobal$ = this.statsService.getCAGlobal().pipe(
      map(response => (response.success ? response.data! : null)),
      catchError(err => {
        this.error.ca = true;
        return of(null);
      })
    );
    this.caGlobal$.subscribe(() => (this.loading.ca = false));

    // Top ventes
    this.topVentes$ = this.statsService.getTopVentes().pipe(
      map(response => (response.success ? response.data! : [])),
      catchError(err => {
        this.error.top = true;
        return of([]);
      })
    );
    this.topVentes$.subscribe(ventes => {
      this.loading.top = false;
      this.prepareTopVentesChart(ventes);
    });

    // Loyers impayés
    this.loyersImpayes$ = this.statsService.getLoyersImpayes().pipe(
      map(response => (response.success ? response.data! : [])),
      catchError(err => {
        this.error.loyers = true;
        return of([]);
      })
    );
    this.loyersImpayes$.subscribe(loyers => {
      this.loading.loyers = false;
      this.totalLoyersImpayes = loyers.reduce((sum, l) => sum + l.totalImpaye, 0);
      this.prepareLoyersChart(loyers);
    });
  }

  private prepareTopVentesChart(ventes: TopVente[]): void {
    this.topVentesChartData = {
      labels: ventes.map(v => v.nom_boutique || v.boutiqueId),
      datasets: [
        {
          data: ventes.map(v => v.totalCA),
          label: 'Chiffre d’affaires (FCFA)',
          backgroundColor: '#32bcae',
          hoverBackgroundColor: '#13514b'
        }
      ]
    };
  }

  private prepareLoyersChart(loyers: LoyerImpaye[]): void {
    this.loyersChartData = {
      labels: loyers.map(l => l._id), // idéalement remplacer par le nom de la boutique si disponible
      datasets: [
        {
          data: loyers.map(l => l.totalImpaye),
          label: 'Impayés (FCFA)',
          backgroundColor: '#13514b',
          hoverBackgroundColor: '#32bcae'
        }
      ]
    };
  }
}