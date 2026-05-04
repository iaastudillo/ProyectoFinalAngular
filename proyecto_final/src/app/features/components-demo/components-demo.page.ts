import { Component } from '@angular/core';
import { StudentView } from '../../models/student.model';
import { StudentCardComponent } from '../../shared/components/student-card/student-card.component';

@Component({
  selector: 'app-components-demo-page',
  imports: [StudentCardComponent],
  templateUrl: './components-demo.page.html',
})
export class ComponentsDemoPage {
  /*
   * Objetivo del ejercicio:
   * Practicar componente padre + componente hijo.
   *
   * Que debe completar el estudiante:
   * Actividad 1, nivel basico:
   * - Agregar un segundo output en StudentCardComponent llamado removeRequested.
   *
   * Actividad 2, nivel intermedio:
   * - Agregar un metodo para eliminar un estudiante de la lista.
   *
   * Actividad 3, nivel reto:
   * - Evitar eliminar si el estudiante esta activo y mostrar un mensaje.
   *
   * Criterio de aceptacion:
   * - El hijo no debe modificar la lista.
   * - El hijo solo debe emitir eventos.
   * - El padre debe decidir que hacer con la lista.
   */

  students: StudentView[] = [
    {
      id: 1,
      fullName: 'Ana Mora',
      email: 'ana.mora@example.com',
      active: true,
      activeLabel: 'Activo',
    },
    {
      id: 2,
      fullName: 'Luis Vega',
      email: 'luis.vega@example.com',
      active: true,
      activeLabel: 'Activo',
    },
    {
      id: 3,
      fullName: 'Ivo Astudillo',
      email: 'ivo_astudillo@outlook.com',
      active: false,
      activeLabel: 'Inactivo',
    },
  ];

  selectedStudent: StudentView | null = null;
  deletedStudent: StudentView | null = null;
  alertMessage: string = '';

  onStudentSelected(student: StudentView): void {
    this.selectedStudent = student;
  }

  //Desarrollo actividad 3 del README.md
  onRemoveRequested(student: StudentView): void {
    this.selectedStudent = null;
    this.deletedStudent = student;
    if (student.active) {
      this.alertMessage = `No se puede eliminar el estudiante ${student.fullName} porque está activo.`;
    } else {
      this.students = this.students.filter((s) => s.id !== student.id);
      this.alertMessage = `El estudiante ${student.fullName} ha sido eliminado correctamente.`;
    }
  }
}
