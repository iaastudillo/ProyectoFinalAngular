import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { TaskView } from '../../../models/task.model';
import { AcademicApiService } from '../../../services/academic-api.service';

@Component({
  selector: 'app-route-detail-page',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './route-detail.page.html',
})
export class RouteDetailPage {
  /*
   * Objetivo del ejercicio:
   * Leer parametros de ruta.
   *
   * Que debe completar el estudiante:
   * Actividad 1:
   * - Convertir routeId a numero y validar que sea un entero positivo.
   *
   * Actividad 2:
   * - Crear en AcademicApiService un metodo getTaskById(id).
   *
   * Actividad 3:
   * - Usar ese metodo para consultar un detalle real al backend.
   *
   * Pista:
   * ActivatedRoute permite acceder a snapshot.paramMap o params como Observable.
   *
   * Criterio de aceptacion:
   * - Si id no es valido, la pantalla debe mostrar un mensaje.
   * - Si el backend responde 404, se debe mostrar "No encontrado".
   */

  //DESARROLLO ACTIVIDAD 7
  private readonly route = inject(ActivatedRoute);
  private readonly academicApi = inject(AcademicApiService);
  errorMessage = signal<string | null>(null);

  readonly routeId = computed(() => {
    const rawId = this.route.snapshot.paramMap.get('id') || null;
    if (!rawId) {
      return null;
    }
    const numericId = Number(rawId);
    if (numericId <= 0 || !Number.isInteger(numericId)) {
      return null;
    }
    return numericId;
  });

  readonly task$: Observable<TaskView | null> | null = this.routeId()
    ? this.academicApi.getTaskById(this.routeId()!).pipe(
        catchError((error) => {
          console.error('Error al cargar tarea:', error);
          if (error.status === 404) {
            this.errorMessage.set('ERROR 404:Tarea no encontrada');
          } else {
            this.errorMessage.set('Error al cargar tarea, intenta de nuevo mas tarde');
          }
          return of(null);
        }),
      )
    : null;
}
