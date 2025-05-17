import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGasto } from '../interfaces/gasto';

@Injectable({
  providedIn: 'root'
})
export class GastoService {
  private apiUrl = 'http://localhost:3000/gastos';


  constructor(private http: HttpClient) { }

  obtenerGastos(): Observable<IGasto[]> {
    return this.http.get<IGasto[]>(this.apiUrl);
  }

  agregarGasto(gasto: IGasto): Observable<IGasto> {
    return this.http.post<IGasto>(this.apiUrl, gasto);
  }

  eliminarGasto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  actualizarGasto(gasto: IGasto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${gasto.id}`, gasto);
  }

  // Otros métodos como editar, filtrar, etc., se pueden agregar

}
