import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GastoService } from '../../services/gasto.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit, AfterViewInit {
  totalGastadoMes: number = 0;
  promedioGastosDiarios: number = 0;
  gastosRecientes: any[] = [];
  gastos: any[] = [];

  @ViewChild('gastosPorCategoriaChart') gastosPorCategoriaChart: ElementRef | undefined;

  constructor(private gastoService: GastoService) { }

  ngOnInit(): void {
    this.cargarGastos();
  }

  ngAfterViewInit(): void {
    this.crearGraficoGastosPorCategoria();
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
    // Total gastado en el mes (asumiendo que los gastos son del mes actual)
    this.totalGastadoMes = this.gastos
      .filter(gasto => new Date(gasto.fecha).getMonth() === new Date().getMonth())
      .reduce((sum, gasto) => sum + gasto.coste, 0);

    // Promedio de gastos diarios
    const primerDiaDelMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const hoy = new Date();
    const diffEnDias = Math.ceil((hoy.getTime() - primerDiaDelMes.getTime()) / (1000 * 3600 * 24));
    this.promedioGastosDiarios = this.totalGastadoMes / diffEnDias;
  }

  obtenerGastosRecientes(): void {
    // Obtener los 5 gastos más recientes
    this.gastosRecientes = this.gastos
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);
  }

  crearGraficoGastosPorCategoria(): void {
    if (!this.gastosPorCategoriaChart || !this.gastosPorCategoriaChart.nativeElement) {
      return;
    }

    // Agrupar gastos por categoría
    const gastosPorCategoria = this.gastos.reduce((acc, gasto) => {
      const categoria = gasto.categoria;
      if (acc[categoria]) {
        acc[categoria] += gasto.coste;
      } else {
        acc[categoria] = gasto.coste;
      }
      return acc;
    }, {});

    const categorias = Object.keys(gastosPorCategoria);
    const costes = Object.values(gastosPorCategoria);

    const ctx = this.gastosPorCategoriaChart.nativeElement.getContext('2d');

    new Chart(ctx, {
      type: 'pie', // o 'bar'
      data: {
        labels: categorias,
        datasets: [{
          label: 'Gastos por Categoría',
          data: costes,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
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
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Distribución de Gastos por Categoría'
          }
        }
      }
    });
  }

  // Aquí puedes añadir más funciones para calcular otras estadísticas
}