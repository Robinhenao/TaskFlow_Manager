import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TaskService } from '../../../../core/services/task.service';
import { map, Observable } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {

  stats$!: Observable<{
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
  }>;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.stats$ = this.taskService.tasks$.pipe(
      map(tasks => ({
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'COMPLETED').length,
        pending: tasks.filter(t => t.status === 'PENDING').length,
        inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length
      }))
    );
  }

  
}
