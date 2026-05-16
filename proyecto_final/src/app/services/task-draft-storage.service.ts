import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../core/storage/local-storage.service';

export interface TaskDraft {
  student_id: string;
  due_date: string;
  priority?: 'low' | 'medium' | 'high';
  title: string;
  description: string;
}

const TASK_DRAFT_KEY = 'academic-task-draft';

@Injectable({ providedIn: 'root' })
export class TaskDraftStorageService {
  /*
   * Objetivo del servicio:
   * Persistir un borrador pequeno para practicar localStorage.
   *
   * Que debe completar el estudiante:
   * Guardar mas campos del formulario, por ejemplo priority o due_date.
   */
  private readonly storage = inject(LocalStorageService);

  loadDraft(): TaskDraft {
    return this.storage.getItem<TaskDraft>(TASK_DRAFT_KEY, {
      student_id: '',
      due_date: '',
      priority: 'medium',
      title: '',
      description: '',
    });
  }

  saveDraft(draft: TaskDraft): void {
    this.storage.setItem(TASK_DRAFT_KEY, draft);
  }

  clearDraft(): void {
    this.storage.removeItem(TASK_DRAFT_KEY);
  }
}
