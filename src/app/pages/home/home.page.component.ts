import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonButton,
  ModalController,
  IonRefresher, IonRefresherContent, IonSpinner } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { addIcons } from 'ionicons';
import { add, trashOutline, settingsOutline } from 'ionicons/icons';
import { Task } from '../../models/task.model';
import { ConfigService } from 'src/app/services/config.service';
import { CategoryModalComponent } from '../../shared/components/category-modal/category-modal.component';
import { TaskItemComponent } from '../../shared/components/task-item/task-item.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { CategorySelectorComponent } from '../../shared/components/category-selector/category-selector.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.component.html',
  styleUrls: ['home.page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonSpinner,
    IonRefresherContent,
    IonRefresher,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButtons,
    IonButton,
    TaskItemComponent,
    EmptyStateComponent,
    CategorySelectorComponent,
  ],
})
export class HomePage {
  private todoService = inject(TodoService);
  private configService = inject(ConfigService);
  private modalController = inject(ModalController);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);

  private selectedCategoryFilter = new BehaviorSubject<string>('all');
  public categories$ = this.todoService.categories$;
  public showDelete$ = this.configService.showDeleteAll$;
  
  public tasks$ = combineLatest([
    this.todoService.tasks$,
    this.selectedCategoryFilter.asObservable(),
    this.todoService.categories$,
  ]).pipe(
    map(([tasks, filter, _categories]) => {
      if (filter === 'all') {
        return tasks;
      }
      return tasks.filter((task) => task.categoryId === filter);
    }),
  );

  constructor() {
    addIcons({
      add,
      'trash-outline': trashOutline,
      'settings-outline': settingsOutline,
    });
  }

  onCategoryFilterChange(categoryId: string) {
    this.selectedCategoryFilter.next(categoryId);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  async presentAlert() {
    const modal = await this.modalController.create({
      component: CategoryModalComponent,
      cssClass: 'category-modal',
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.title && data?.categoryId) {
      await this.addTask(data.title, data.categoryId);
    }
  }

  async addTask(title: string, catId: string = '1') {
    const newTask: Task = {
      id: Date.now().toString(),
      title: title,
      completed: false,
      createdAt: Date.now(),
      categoryId: catId,
    };
    await this.todoService.addTask(newTask);
  }

  async deleteAll() {
    const confirmed = await this.errorHandler.showConfirmAlert(
      '¿Borrar todo?',
      'Esta acción no se puede deshacer.',
      'Sí, borrar'
    );

    if (confirmed) {
      await this.todoService.clearAll();
    }
  }

  async toggleTask(id: string) {
    await this.todoService.toggleTask(id);
  }

  async onDeleteTask(event: { taskId: string; slidingItem: any }) {
    const { taskId, slidingItem } = event;
    await this.todoService.deleteTask(taskId);

    if (slidingItem) slidingItem.close();
  }

  async deleteTask(id: string, slidingItem?: any) {
    await this.todoService.deleteTask(id);

    if (slidingItem) slidingItem.close();
  }

  async handleRefresh(event: { target: { complete: () => void; }; }) {
    try {
      await this.configService.checkFeatureStatus();
      await this.todoService.refreshData();
    } catch {
      await this.errorHandler.showErrorToast('No se pudo actualizar el estado');
    } finally {
      event.target.complete();
    }
  }
}