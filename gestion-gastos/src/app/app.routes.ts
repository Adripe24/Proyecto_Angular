import { Routes } from '@angular/router';
import { ListaGastosComponent } from './components/lista-gastos/lista-gastos.component';
import { FormularioGastoComponent } from './components/formulario-gasto/formulario-gasto.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';

export const routes: Routes = [
  { path: 'lista-gastos', component: ListaGastosComponent },
  { path: 'formulario-gasto', component: FormularioGastoComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: '', redirectTo: '/lista-gastos', pathMatch: 'full' },
  { path: '**', redirectTo: '/lista-gastos' }
];
