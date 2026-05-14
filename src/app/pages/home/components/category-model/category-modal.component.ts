import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonSelect,
  IonSelectOption,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
} from '@ionic/angular/standalone';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
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
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
  ],
})
export class CategoryModalComponent {
  title = '';
  selectedCategory = '1';
  todoService = inject(TodoService);
  private modalController = inject(ModalController);

  dismiss() {
    this.modalController.dismiss();
  }

  save() {
    if (this.title.trim()) {
      this.modalController.dismiss({
        title: this.title,
        categoryId: this.selectedCategory,
      });
    }
  }
}
