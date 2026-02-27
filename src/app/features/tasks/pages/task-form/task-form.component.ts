import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../../../core/services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent {

  loading = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      status: ['PENDING', Validators.required]
    });
  }

  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.taskService.addTask(this.form.value as any)
      .subscribe(() => {
        this.loading = false;
        this.router.navigate(['/tasks']);
      });
  }
}