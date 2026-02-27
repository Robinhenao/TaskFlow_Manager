import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import { TaskService, Task } from '../../../../core/services/task.service';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
type TaskFilter = 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
type SortOption = 'A_Z' | 'Z_A';
@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent {
  filters: TaskFilter[] = ['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'];
  sortOptions: SortOption[] = ['A_Z', 'Z_A'];

  private filterSubject = new BehaviorSubject<TaskFilter>('ALL');
  private sortSubject = new BehaviorSubject<SortOption>('A_Z');
  tasks$!: Observable<Task[]>;

  constructor(private readonly taskService: TaskService) {}

  ngOnInit(): void {
    this.tasks$ = combineLatest([
      this.taskService.filteredTasks$, 
      this.filterSubject,
      this.sortSubject
    ]).pipe(
      map(([tasks, filter, sort]) => {
        const filtered =
          filter === 'ALL'
            ? tasks
            : tasks.filter(t => t.status === filter);

        return [...filtered].sort((a, b) => {
          return sort === 'A_Z'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        });
      })
    );
  }

  setFilter(filter: TaskFilter): void {
    this.filterSubject.next(filter);
  }

  setSort(sort: SortOption): void {
    this.sortSubject.next(sort);
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe();
  }

  trackById(index: number, task: Task): string {
    return task.id;
  }
}