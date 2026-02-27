import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

@Injectable({ providedIn: 'root' })
export class TaskService {

  private tasksSubject = new BehaviorSubject<Task[]>(this.loadTasks());
  tasks$ = this.tasksSubject.asObservable();

  addTask(task: Omit<Task, 'id'>): Observable<Task> {

    const newTask: Task = {
      ...task,
      id: crypto.randomUUID()
    };

    const updated = [...this.tasksSubject.value, newTask];

    this.persist(updated);

    return of(newTask).pipe(delay(800));
  }

  deleteTask(id: string): Observable<void> {
    const updated = this.tasksSubject.value.filter(t => t.id !== id);
    this.persist(updated);
    return of(void 0).pipe(delay(500));
  }

  private persist(tasks: Task[]) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

  private loadTasks(): Task[] {
    const data = localStorage.getItem('tasks');
    return data ? JSON.parse(data) : [];
  }
}