import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../../../core/services/task.service';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    taskServiceMock = jasmine.createSpyObj('TaskService', ['addTask']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TaskFormComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Creación ─────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with loading = false', () => {
    expect(component.loading).toBeFalse();
  });

  it('should build form with title, description and status controls', () => {
    expect(component.form.get('title')).toBeTruthy();
    expect(component.form.get('description')).toBeTruthy();
    expect(component.form.get('status')).toBeTruthy();
  });

  it('should have PENDING as default status', () => {
    expect(component.form.get('status')?.value).toBe('PENDING');
  });

  it('should start with invalid form', () => {
    expect(component.form.invalid).toBeTrue();
  });

  // ─── Validaciones ────────────────────────────────────────────────

  it('title should be invalid when empty', () => {
    component.form.get('title')?.setValue('');
    expect(component.form.get('title')?.invalid).toBeTrue();
  });

  it('title should fail minlength with less than 3 chars', () => {
    component.form.get('title')?.setValue('ab');
    expect(component.form.get('title')?.errors?.['minlength']).toBeTruthy();
  });

  it('title should be valid with 3 or more chars', () => {
    component.form.get('title')?.setValue('Fix bug');
    expect(component.form.get('title')?.valid).toBeTrue();
  });

  it('description should be invalid when empty', () => {
    component.form.get('description')?.setValue('');
    expect(component.form.get('description')?.invalid).toBeTrue();
  });

  it('description should be valid when filled', () => {
    component.form.get('description')?.setValue('Some description');
    expect(component.form.get('description')?.valid).toBeTrue();
  });

  it('status should be invalid when empty', () => {
    component.form.get('status')?.setValue('');
    expect(component.form.get('status')?.invalid).toBeTrue();
  });

  it('form should be valid when all fields are filled correctly', () => {
    component.form.setValue({ title: 'Fix bug', description: 'Details here', status: 'PENDING' });
    expect(component.form.valid).toBeTrue();
  });

  // ─── submit() con formulario inválido ─────────────────────────────

  it('should mark all controls as touched when form is invalid', () => {
    spyOn(component.form, 'markAllAsTouched');
    component.submit();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should NOT call taskService.addTask when form is invalid', () => {
    component.submit();
    expect(taskServiceMock.addTask).not.toHaveBeenCalled();
  });

  it('should NOT navigate when form is invalid', () => {
    component.submit();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // ─── submit() con formulario válido ──────────────────────────────

  const fillValidForm = (component: TaskFormComponent) => {
    component.form.setValue({
      title: 'Fix bug',
      description: 'Details here',
      status: 'PENDING'
    });
  };

  it('should set loading to true while submitting', () => {
    let loadingDuringCall = false;
    taskServiceMock.addTask.and.callFake(() => {
      loadingDuringCall = component.loading;
      return of(void 0);
    });
    fillValidForm(component);
    component.submit();
    expect(loadingDuringCall).toBeTrue();
  });

  it('should call taskService.addTask with form values', () => {
    taskServiceMock.addTask.and.returnValue(of(void 0));
    fillValidForm(component);
    component.submit();
    expect(taskServiceMock.addTask).toHaveBeenCalledWith({
      title: 'Fix bug',
      description: 'Details here',
      status: 'PENDING'
    });
  });

  it('should navigate to /dashboard after successful submit', () => {
    taskServiceMock.addTask.and.returnValue(of(void 0));
    fillValidForm(component);
    component.submit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should set loading to false after successful submit', () => {
    taskServiceMock.addTask.and.returnValue(of(void 0));
    fillValidForm(component);
    component.submit();
    expect(component.loading).toBeFalse();
  });

  // ─── Status válidos ───────────────────────────────────────────────

  it('should accept PENDING as valid status', () => {
    component.form.setValue({ title: 'Task', description: 'Desc', status: 'PENDING' });
    expect(component.form.valid).toBeTrue();
  });

  it('should accept IN_PROGRESS as valid status', () => {
    component.form.setValue({ title: 'Task', description: 'Desc', status: 'IN_PROGRESS' });
    expect(component.form.valid).toBeTrue();
  });

  it('should accept COMPLETED as valid status', () => {
    component.form.setValue({ title: 'Task', description: 'Desc', status: 'COMPLETED' });
    expect(component.form.valid).toBeTrue();
  });
});
