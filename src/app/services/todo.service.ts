import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task, Category } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private _storage: Storage | null = null;
  private _tasks = new BehaviorSubject<Task[]>([]);
  public tasks$ = this._tasks.asObservable();
  private configService = inject(ConfigService);

  private _categories = new BehaviorSubject<Category[]>([
    { id: '1', name: 'Personal', color: 'primary' },
    { id: '2', name: 'Trabajo', color: 'secondary' },
    { id: '3', name: 'Hogar', color: 'success' },
  ]);
  public categories$ = this._categories.asObservable();

  get categories(): Category[] {
    return this._categories.value;
  }

  constructor(private storage: Storage) {
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
    const updatedTasks = [...this._tasks.value, task];
    await this._storage?.set('tasks', updatedTasks);
    this._tasks.next(updatedTasks);
  }

  async clearAll() {
    const canDelete = await this.configService.checkFeatureStatus();

    if (canDelete) {
      await this._storage?.remove('tasks');
      this._tasks.next([]);
    } else {
      throw new Error('Esta funcionalidad ha sido deshabilitada remotamente.');
    }
  }

  async deleteTask(id: string) {
    const updatedTasks = this._tasks.value.filter((t) => t.id !== id);
    await this._storage?.set('tasks', updatedTasks);
    this._tasks.next(updatedTasks);
  }

  async toggleTask(id: string) {
    const updatedTasks = this._tasks.value.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
    await this._storage?.set('tasks', updatedTasks);
    this._tasks.next(updatedTasks);
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
    const updatedCategories = [...this._categories.value, category];
    await this.saveCategories(updatedCategories);
  }

  async updateCategory(id: string, updates: Partial<Category>) {
    const updatedCategories = this._categories.value.map((cat) =>
      cat.id === id ? { ...cat, ...updates } : cat,
    );
    await this.saveCategories(updatedCategories);
  }

  async deleteCategory(id: string) {
    const hasTasksWithCategory = this._tasks.value.some(
      (t) => t.categoryId === id,
    );
    if (hasTasksWithCategory) {
      throw new Error('No se puede eliminar una categoría con tareas');
    }

    const updatedCategories = this._categories.value.filter(
      (cat) => cat.id !== id,
    );
    await this.saveCategories(updatedCategories);
  }
}
