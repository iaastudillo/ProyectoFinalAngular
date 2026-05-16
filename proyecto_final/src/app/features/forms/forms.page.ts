import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskDraftStorageService } from '../../services/task-draft-storage.service';
import { CreateTaskPayload } from '../../models/task.model';
import { AcademicApiService } from '../../services/academic-api.service';

interface TaskForm {
  student_id: FormControl<string>;
  due_date: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string>;
  priority: FormControl<'low' | 'medium' | 'high'>;
  subtasks: FormArray<FormControl<string>>;
}

@Component({
  selector: 'app-forms-page',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './forms.page.html',
})
export class FormsPage {
  /*
   * Objetivo del ejercicio:
   * Practicar formularios reactivos con FormGroup, FormControl y FormArray.
   *
   * Que debe completar el estudiante:
   * Actividad 1, nivel basico:
   * - Agregar Validators.minLength(3) al titulo.
   *
   * Actividad 2, nivel intermedio:
   * - Construir un CreateTaskPayload usando los valores del formulario.
   *
   * Actividad 3, nivel intermedio:
   * - Enviar el formulario al backend usando AcademicApiService.createTask().
   *
   * Actividad 4, nivel reto:
   * - Guardar mas campos como borrador en localStorage y restaurarlos al recargar.
   *
   * Criterio de aceptacion:
   * - Si el formulario es invalido, no debe hacer POST.
   * - Si el POST funciona, debe limpiar el formulario o mostrar la tarea creada.
   * - El payload debe respetar los nombres del backend: student_id y due_date.
   */

  //DESARROLLO ACTIVIDAD 8
  private readonly draftStorage = inject(TaskDraftStorageService);
  private readonly draft = this.draftStorage.loadDraft();
  private readonly academicApi = inject(AcademicApiService);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  readonly taskForm = new FormGroup<TaskForm>({
    student_id: new FormControl(this.draft.student_id, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    due_date: new FormControl(this.draft.due_date, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    title: new FormControl(this.draft.title, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    description: new FormControl(this.draft.description, {
      nonNullable: true,
    }),
    priority: new FormControl(this.draft.priority || 'medium', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    subtasks: new FormArray<FormControl<string>>([
      new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    ]),
  });

  get subtasks(): FormArray<FormControl<string>> {
    return this.taskForm.controls.subtasks;
  }

  addSubtask(): void {
    this.subtasks.push(
      new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    );
  }

  removeSubtask(index: number): void {
    this.subtasks.removeAt(index);
  }

  saveDraft(): void {
    this.draftStorage.saveDraft({
      student_id: this.taskForm.controls.student_id.value,
      due_date: this.taskForm.controls.due_date.value,
      title: this.taskForm.controls.title.value,
      description: this.taskForm.controls.description.value,
      priority: this.taskForm.controls.priority.value,
    });
  }

  submit(): void {
    this.taskForm.markAllAsTouched();

    if (this.taskForm.invalid) {
      return;
    }

    /*
     * TODO estudiante:
     * Aqui debe construir CreateTaskPayload y llamar AcademicApiService.createTask().
     * Por ahora solo se muestra el valor en consola para no resolver todo el ejercicio.
     *
     * Pasos sugeridos:
     * 1. Leer const value = this.taskForm.getRawValue().
     * 2. Crear un objeto CreateTaskPayload.
     * 3. Pasar description como null si esta vacia.
     * 4. Llamar al servicio.
     * 5. Manejar next y error en subscribe.
     */
    console.log('Formulario valido:', this.taskForm.getRawValue());

    this.errorMessage.set(null);
    this.successMessage.set(null);
    const value = this.taskForm.getRawValue();
    const createTaskPayload: CreateTaskPayload = {
      student_id: parseInt(value.student_id),
      due_date: value.due_date,
      title: value.title,
      description: value.description.trim() ? value.description : null,
      status: 'pending',
      priority: value.priority,
    };
    this.academicApi.createTask(createTaskPayload).subscribe({
      next: (task) => {
        console.log('Se creo la tarea:', task);
        this.successMessage.set('La tarea se creó correctamente');
        this.draftStorage.clearDraft();
        this.taskForm.reset({
          student_id: '',
          due_date: '',
          title: '',
          description: '',
          priority: 'medium',
        });
        this.subtasks.clear();
        this.addSubtask();
      },
      error: (error) => {
        console.error('Error al crear tarea:', error);
        this.errorMessage.set(error.error?.message || 'Error al crear la tarea');
        console.log(this.errorMessage());
      },
    });
  }
}
