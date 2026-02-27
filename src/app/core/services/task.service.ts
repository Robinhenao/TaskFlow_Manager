import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, combineLatest, map } from 'rxjs';

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

  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();

  filteredTasks$ = combineLatest([
    this.tasks$,
    this.search$
  ]).pipe(
    map(([tasks, search]) =>
      tasks.filter(task =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase())
      )
    )
  );

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

  setSearchTerm(term: string): void {
    this.searchSubject.next(term);
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