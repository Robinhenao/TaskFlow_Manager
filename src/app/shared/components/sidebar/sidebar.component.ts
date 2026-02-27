import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { map, Observable } from 'rxjs';
@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  user$!: Observable<any>;
  
  constructor(
    private authService: AuthService,
    private taskService: TaskService,
  ) { }
  ngOnInit(): void {
    this.user$ = this.authService.currentUser$;
   
  }
  logout() {
    this.authService.logout();
  }
}
