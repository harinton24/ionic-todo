import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
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
  IonInput,
  ModalController
} from '@ionic/angular/standalone';
import { TodoService } from 'src/app/services/todo.service';
import { Category } from 'src/app/models/task.model';
import { addIcons } from 'ionicons';
import { add, pencil, trash } from 'ionicons/icons';

@Component({
  selector: 'app-manage-categories-modal',
  templateUrl: './manage-categories-modal.component.html',
  styleUrls: ['./manage-categories-modal.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    addIcons({ add, pencil, trash});
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
    this.dismiss();
  }

  async confirmDelete(id: string) {
    await this.todoService.deleteCategory(id);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  trackByColorId(index: number, color: string): string {
    return color;
  }

  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }
}
