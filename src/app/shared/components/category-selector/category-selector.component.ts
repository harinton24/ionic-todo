import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonItem,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { Category } from '../../../models/task.model';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonItem,
    IonSelect,
    IonSelectOption
  ],
})
export class CategorySelectorComponent {
  categories = input<Category[]>([]);
  selectedCategoryId = input<string>('all');
  showAllOption = input<boolean>(true);
  label = input<string>('Filtrar por categoría:');

  selectionChange = output<string>();

  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }

  onCategoryChange(event: any) {
    this.selectionChange.emit(event.detail.value);
  }
}