import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GastoService } from '../../services/gasto.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario-gasto',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './formulario-gasto.component.html',
  styleUrl: './formulario-gasto.component.css'
})
export class FormularioGastoComponent {


  gastoForm: FormGroup;
  categorias: string[] = ['Alimentación', 'Transporte', 'Ocio', 'Salud', 'Otros'];

  constructor(
    private fb: FormBuilder,
    private gastoService: GastoService,
    private router: Router
  ) {
    this.gastoForm = this.fb.group({
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      coste: [null, [Validators.required, Validators.min(0.01)]],
      fecha: [new Date().toISOString().substring(0,10), Validators.required]
  })
}

onSubmit(): void {
    if (this.gastoForm.valid) {
      this.gastoService.agregarGasto(this.gastoForm.value).subscribe(() => {
        this.router.navigate(['/lista-gastos']);
      });
    }
  }

}
