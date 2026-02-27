import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import { TaskService, Task } from '../../../../core/services/task.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit {

  tasks$!: Observable<Task[]>;
  filter: 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' = 'ALL';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks$ = this.taskService.tasks$.pipe(
      map(tasks =>
        this.filter === 'ALL'
          ? tasks
          : tasks.filter(t => t.status === this.filter)
      )
    );
  }

  setFilter(filter: any) {
    this.filter = filter;
    this.loadTasks();
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe();
  }

  trackById(index: number, task: Task) {
    return task.id;
  }
}