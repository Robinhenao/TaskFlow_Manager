import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { authGuard } from '../../core/guards/auth.guard';
import { TaskFormComponent } from './pages/task-form/task-form.component';

const routes: Routes = [
  {
    path: '',
    component: TaskListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'create',
    component: TaskFormComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {}