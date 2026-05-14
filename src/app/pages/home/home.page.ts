import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonFab,
  IonFabButton,
  IonIcon,
  AlertController,
  IonBadge,
  IonButtons,
  IonButton,
  ModalController,
  IonSelect,
  IonSelectOption,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { addIcons } from 'ionicons';
import { add, trashOutline, settingsOutline, trash } from 'ionicons/icons';
import { Task } from '../../models/task.model';
import { ConfigService } from 'src/app/services/config.service';
import { CategoryModalComponent } from './components/category-model/category-modal.component';
import {
  CategoryNamePipe,
  CategoryColorPipe,
} from 'src/app/shared/pipes/category.pipe';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonBadge,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButtons,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    CategoryNamePipe,
    CategoryColorPipe,
  ],
})
export class HomePage {
  private todoService = inject(TodoService);
  private alertController = inject(AlertController);
  private configService = inject(ConfigService);
  private modalController = inject(ModalController);
  private router = inject(Router);

  private selectedCategoryFilter = new BehaviorSubject<string>('all');
  public categories$ = this.todoService.categories$;
  public showDelete$ = this.configService.showDeleteAll$;

  // Filtrar tareas según la categoría seleccionada
  public tasks$ = combineLatest([
    this.todoService.tasks$,
    this.selectedCategoryFilter.asObservable(),
  ]).pipe(
    map(([tasks, filter]) => {
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

  onCategoryFilterChange(event: any) {
    this.selectedCategoryFilter.next(event.detail.value);
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
      this.addTask(data.title, data.categoryId);
    }
  }

  addTask(title: string, catId: string = '1') {
    const newTask: Task = {
      id: Date.now().toString(),
      title: title,
      completed: false,
      createdAt: Date.now(),
      categoryId: catId,
    };
    this.todoService.addTask(newTask);
  }

  async deleteAll() {
    const alert = await this.alertController.create({
      header: '¿Borrar todo?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, borrar',
          handler: async () => {
            try {
              await this.todoService.clearAll();
              return true;
            } catch (error) {
              this.showDisabledAlert();
              return true;
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async showDisabledAlert() {
    const alert = await this.alertController.create({
      header: 'Acción no permitida',
      message:
        'Lo sentimos, no se pudo eliminar debido a una flag configurada remotamente.',
      buttons: [{ text: 'Cerrar' }],
    });
    await alert.present();
  }

  toggleTask(id: string) {
    this.todoService.toggleTask(id);
  }

  deleteTask(id: string) {
    this.todoService.deleteTask(id);
  }
}
