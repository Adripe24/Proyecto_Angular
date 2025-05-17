import { Component, OnInit } from '@angular/core';
import { IGasto } from '../../interfaces/gasto';
import { GastoService } from '../../services/gasto.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-lista-gastos',
  imports: [
    CommonModule, RouterModule, FormsModule
  ],
  templateUrl: './lista-gastos.component.html',
  styleUrl: './lista-gastos.component.css'
})
export class ListaGastosComponent implements OnInit {
  gastos: IGasto[] = [];
  gastoSeleccionado: IGasto = {
    id: 0,
    descripcion: '',
    coste: 0,
    categoria: '',
    fecha: ''
  };
  modoEdicion: boolean = false;

  
  constructor(private gastoService: GastoService) { }
  
  ngOnInit(): void {
    this.cargarGastos();
  }

  cargarGastos(): void {
    this.gastoService.obtenerGastos().subscribe(gastos => {
      this.gastos = gastos;
    });
  }

  eliminarGasto(id: number): void {
    this.gastoService.eliminarGasto(id).subscribe(() => {
      this.cargarGastos();
      
    });
  }
  
  editarGasto(gasto: IGasto): void { // Utiliza la interfaz Gasto
    this.gastoSeleccionado = { ...gasto };
    this.modoEdicion = true;
    console.log('Editar gasto:', gasto);
  }

    // lista-gastos.component.ts
  guardarGasto(): void {
    // Aquí puedes implementar la lógica para guardar los cambios en el servicio
    console.log('Guardar gasto:', this.gastoSeleccionado);
    this.gastoService.actualizarGasto(this.gastoSeleccionado).subscribe(() => {
      this.cargarGastos();
    });
    this.modoEdicion = false;
    this.gastoSeleccionado = {
      id: 0,
      descripcion: '',
      coste: 0,
      categoria: '',
      fecha: ''
    };
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.gastoSeleccionado = {
      id: 0,
      descripcion: '',
      coste: 0,
      categoria: '',
      fecha: ''
    };
  }

}
