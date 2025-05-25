import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GastoService } from '../../services/gasto.service';
import { Chart, registerables } from 'chart.js';
import { IGasto } from '../../interfaces/gasto';
Chart.register(...registerables);

interface GastosPorCategoria {
  [categoria: string]: number;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit, AfterViewInit {
  @ViewChild('graficoGastosCategoria') graficoGastosCategoria!: ElementRef;
  public chart: any;

  totalGastadoMes: number = 0;
  promedioGastosDiarios: number = 0;
  gastosRecientes: IGasto[] = [];
  gastos: IGasto[] = [];

  constructor(private gastoService: GastoService) { }

  ngOnInit(): void {
    this.cargarGastos();
  }

  ngAfterViewInit(): void {
    this.cargarGastos();
  }

  cargarGastos(): void {
    this.gastoService.obtenerGastos().subscribe(gastos => {
      this.gastos = gastos;
      this.calcularEstadisticas();
      this.obtenerGastosRecientes();
      this.crearGraficoGastosPorCategoria();
    });
  }

  calcularEstadisticas(): void {
    this.totalGastadoMes = this.gastos
      .filter(gasto => new Date(gasto.fecha).getMonth() === new Date().getMonth())
      .reduce((sum, gasto) => sum + gasto.coste, 0);

    const primerDiaDelMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const hoy = new Date();
    const diffEnDias = Math.ceil((hoy.getTime() - primerDiaDelMes.getTime()) / (1000 * 3600 * 24));
    this.promedioGastosDiarios = this.totalGastadoMes / diffEnDias;
  }

  obtenerGastosRecientes(): void {
    this.gastosRecientes = this.gastos
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);
  }

  crearGraficoGastosPorCategoria(): void {
    if (this.graficoGastosCategoria) {
      const gastosPorCategoria: GastosPorCategoria = this.gastos.reduce((acumulador: GastosPorCategoria, gasto: IGasto) => {
        acumulador[gasto.categoria] = (acumulador[gasto.categoria] || 0) + gasto.coste;
        return acumulador;
      }, {});

      const labels = Object.keys(gastosPorCategoria);
      const data = Object.values(gastosPorCategoria);

      const ctx = this.graficoGastosCategoria.nativeElement.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: 'Gastos por Categoría',
            data: data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Gastos por Categoría'
            }
          }
        }
      });
    }
  }
}