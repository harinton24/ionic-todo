import { Pipe, PipeTransform, inject } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';

@Pipe({
  name: 'categoryName',
  pure: true,
  standalone: true
})
export class CategoryNamePipe implements PipeTransform {
  private todoService = inject(TodoService);

  transform(categoryId: string): string {
    return (
      this.todoService.categories.find((c) => c.id === categoryId)?.name ||
      'Sin categoría'
    );
  }
}

@Pipe({
  name: 'categoryColor',
  pure: true,
  standalone: true
})
export class CategoryColorPipe implements PipeTransform {
  private todoService = inject(TodoService);

  transform(categoryId: string): string {
    return (
      this.todoService.categories.find((c) => c.id === categoryId)?.color ||
      'medium'
    );
  }
}
