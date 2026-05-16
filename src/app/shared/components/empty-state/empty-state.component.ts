import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IonIcon],
})
export class EmptyStateComponent {
  icon = input<string>('checkbox-outline');
  title = input<string>('Sin tareas');
  message = input<string>('Crea tu primera tarea para comenzar');
}