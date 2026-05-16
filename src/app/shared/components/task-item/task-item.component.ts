import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonItem,
  IonLabel,
  IonCheckbox,
  IonBadge,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/angular/standalone';
import { Task } from '../../../models/task.model';
import {
  CategoryNamePipe,
  CategoryColorPipe,
} from '../../pipes/category.pipe';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonBadge,
    IonIcon,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    CategoryNamePipe,
    CategoryColorPipe,
  ],
})
export class TaskItemComponent {
  task = input.required<Task>();
  canDelete = input<boolean>(false);

  toggleTask = output<string>();
  deleteTask = output<{ taskId: string; slidingItem: any }>();

  onToggle() {
    this.toggleTask.emit(this.task().id);
  }

  onDelete(slidingItem: any) {
    this.deleteTask.emit({ taskId: this.task().id, slidingItem });
  }
}