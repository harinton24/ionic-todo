import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task, Category } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from './config.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private _storage: Storage | null = null;
  private _tasks = new BehaviorSubject<Task[]>([]);
  public tasks$ = this._tasks.asObservable();
  private configService = inject(ConfigService);
  private errorHandler = inject(ErrorHandlerService);
  private storage = inject(Storage);

  private _categories = new BehaviorSubject<Category[]>([
    { id: '1', name: 'Personal', color: 'primary' },
    { id: '2', name: 'Trabajo', color: 'secondary' },
    { id: '3', name: 'Hogar', color: 'success' },
  ]);
  public categories$ = this._categories.asObservable();

  get categories(): Category[] {
    return this._categories.value;
  }

  constructor() {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.loadCategories();
    await this.loadTasks();
  }

  async loadTasks() {
    const tasks = (await this._storage?.get('tasks')) || [];
    this._tasks.next(tasks);
  }

  async addTask(task: Task) {
    try {
      const updatedTasks = [...this._tasks.value, task];
      await this._storage?.set('tasks', updatedTasks);
      this._tasks.next(updatedTasks);
      await this.errorHandler.showSuccessToast('Tarea creada');
    } catch {
      await this.errorHandler.showErrorAlert(
        'Error',
        'No se pudo guardar la tarea',
      );
    }
  }

  async clearAll() {
    try {
      const canDelete = await this.configService.checkFeatureStatus();

      if (!canDelete) {
        await this.errorHandler.showErrorAlert(
          'Acción no permitida',
          'Esta funcionalidad ha sido deshabilitada remotamente.',
        );
        return;
      }

      await this._storage?.remove('tasks');
      this._tasks.next([]);
      await this.errorHandler.showSuccessToast('Todas las tareas fueron eliminadas');
    } catch {
      await this.errorHandler.showErrorAlert(
        'Error',
        'No se pudieron eliminar las tareas',
      );
    }
  }

  async deleteTask(id: string) {
    try {
      const canDelete = await this.configService.checkFeatureStatus();

      if (!canDelete) {
        await this.errorHandler.showErrorAlert(
          'Acción no permitida',
          'Esta funcionalidad ha sido deshabilitada remotamente.',
        );
        return;
      }

      const updatedTasks = this._tasks.value.filter((t) => t.id !== id);
      await this._storage?.set('tasks', updatedTasks);
      this._tasks.next(updatedTasks);
      await this.errorHandler.showSuccessToast('Tarea eliminada');
    } catch {
      await this.errorHandler.showErrorAlert(
        'Error',
        'No se pudo eliminar la tarea',
      );
    }
  }

  async toggleTask(id: string) {
    try {
      const updatedTasks = this._tasks.value.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      );
      await this._storage?.set('tasks', updatedTasks);
      this._tasks.next(updatedTasks);
      await this.errorHandler.showSuccessToast('Tarea actualizada');
    } catch {
      await this.errorHandler.showErrorToast('No se pudo actualizar la tarea');
    }
  }

  private async loadCategories() {
    const categories =
      (await this._storage?.get('categories')) || this._categories.value;
    this._categories.next(categories);
  }

  async saveCategories(categories: Category[]) {
    await this._storage?.set('categories', categories);
    this._categories.next(categories);
  }

  async addCategory(category: Category) {
    try {
      const updatedCategories = [...this._categories.value, category];
      await this.saveCategories(updatedCategories);
      await this.errorHandler.showSuccessToast('Categoría creada');
    } catch {
      await this.errorHandler.showErrorAlert(
        'Error',
        'No se pudo guardar la categoría',
      );
    }
  }

  async updateCategory(id: string, updates: Partial<Category>) {
    try {
      const updatedCategories = this._categories.value.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat,
      );
      await this.saveCategories(updatedCategories);
      await this.errorHandler.showSuccessToast('Categoría actualizada');
    } catch {
      await this.errorHandler.showErrorAlert(
        'Error',
        'No se pudo actualizar la categoría',
      );
    }
  }

  async deleteCategory(id: string) {
    try {
      const hasTasksWithCategory = this._tasks.value.some(
        (t) => t.categoryId === id,
      );

      if (hasTasksWithCategory) {
        await this.errorHandler.showErrorAlert(
          'No se puede eliminar',
          'No se puede eliminar una categoría con tareas.',
        );
        return;
      }

      const updatedCategories = this._categories.value.filter(
        (cat) => cat.id !== id,
      );
      await this.saveCategories(updatedCategories);
      await this.errorHandler.showSuccessToast('Categoría eliminada');
    } catch {
      await this.errorHandler.showErrorAlert(
        'Error',
        'No se pudo eliminar la categoría',
      );
    }
  }

  async refreshData() {
    try {
      await this.loadCategories();
      await this.loadTasks();
    } catch (error) {
      console.error('Error sincronizando storage local', error);
    }
  }
}
