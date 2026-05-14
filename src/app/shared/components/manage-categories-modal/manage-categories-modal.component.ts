import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonFab,
  IonFabButton,
  IonInput
} from '@ionic/angular/standalone';
import { TodoService } from 'src/app/services/todo.service';
import { Category } from 'src/app/models/task.model';
import { addIcons } from 'ionicons';
import { add, pencil, trash, square } from 'ionicons/icons';

@Component({
  selector: 'app-manage-categories-modal',
  templateUrl: './manage-categories-modal.component.html',
  styleUrls: ['./manage-categories-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonIcon,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonFab,
    IonFabButton,
    IonInput
  ]
})
export class ManageCategoriesModalComponent {
  public todoService = inject(TodoService);
  private modalController = inject(ModalController);

  colorOptions = ['primary', 'secondary', 'success', 'warning', 'danger'];
  
  isFormVisible = false;
  formName = '';
  formColor = 'primary';
  editingId: string | null = null;

  constructor() {
    addIcons({ add, pencil, trash, square });
  }

  selectColor(color: string) {
    this.formColor = color;
  }

  getColorValue(color: string): string {
    const colorMap: { [key: string]: string } = {
      'primary': '#3880ff',
      'secondary': '#3dc9a3',
      'success': '#2dd36f',
      'warning': '#ffc409',
      'danger': '#eb445a'
    };
    return colorMap[color] || '#3880ff';
  }

  startAdd() {
    this.isFormVisible = true;
    this.editingId = null;
    this.formName = '';
    this.formColor = 'primary';
  }

  startEdit(category: Category) {
    this.isFormVisible = true;
    this.editingId = category.id;
    this.formName = category.name;
    this.formColor = category.color;
  }

  cancelForm() {
    this.isFormVisible = false;
    this.formName = '';
    this.formColor = 'primary';
    this.editingId = null;
  }

  async saveCategory() {
    if (!this.formName.trim()) {
      return;
    }

    if (this.editingId) {
      await this.todoService.updateCategory(this.editingId, {
        name: this.formName,
        color: this.formColor
      });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: this.formName,
        color: this.formColor
      };
      await this.todoService.addCategory(newCategory);
    }

    this.cancelForm();
  }

  async confirmDelete(id: string) {
    try {
      await this.todoService.deleteCategory(id);
    } catch (error) {
      alert('No se puede eliminar una categoría que tiene tareas asignadas.');
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
