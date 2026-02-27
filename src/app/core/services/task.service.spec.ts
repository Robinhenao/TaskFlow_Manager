import { TestBed } from '@angular/core/testing';
import { TaskService, Task } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  const mockTask = (overrides: Partial<Task> = {}): Task => ({
    id: crypto.randomUUID(),
    title: 'Test Task',
    description: 'Test description',
    status: 'PENDING',
    ...overrides
  });

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  afterEach(() => localStorage.clear());

  // ─── Inicialización ───────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty tasks when localStorage is empty', (done) => {
    service.tasks$.subscribe(tasks => {
      expect(tasks).toEqual([]);
      done();
    });
  });

  it('should restore tasks from localStorage on init', () => {
    const stored = [mockTask({ id: '1', title: 'Stored Task' })];
    localStorage.setItem('tasks', JSON.stringify(stored));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const freshService = TestBed.inject(TaskService);

    freshService.tasks$.subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe('Stored Task');
    });
  });

  // ─── addTask() ────────────────────────────────────────────────────

  it('should add a task and return it', (done) => {
    service.addTask({ title: 'New Task', description: 'Desc', status: 'PENDING' }).subscribe(task => {
      expect(task).toBeTruthy();
      expect(task.title).toBe('New Task');
      done();
    });
  });

  it('should generate a unique id for each task', (done) => {
    service.addTask({ title: 'Task A', description: 'Desc', status: 'PENDING' }).subscribe(taskA => {
      service.addTask({ title: 'Task B', description: 'Desc', status: 'PENDING' }).subscribe(taskB => {
        expect(taskA.id).not.toBe(taskB.id);
        done();
      });
    });
  });

  it('should add task to tasks$ observable', (done) => {
    service.addTask({ title: 'New Task', description: 'Desc', status: 'PENDING' }).subscribe(() => {
      service.tasks$.subscribe(tasks => {
        expect(tasks.some(t => t.title === 'New Task')).toBeTrue();
        done();
      });
    });
  });

  it('should persist task to localStorage after adding', (done) => {
    service.addTask({ title: 'Persist Task', description: 'Desc', status: 'PENDING' }).subscribe(() => {
      const stored = JSON.parse(localStorage.getItem('tasks')!);
      expect(stored.some((t: Task) => t.title === 'Persist Task')).toBeTrue();
      done();
    });
  });

  it('should accumulate multiple tasks', (done) => {
    service.addTask({ title: 'Task 1', description: 'Desc', status: 'PENDING' }).subscribe(() => {
      service.addTask({ title: 'Task 2', description: 'Desc', status: 'PENDING' }).subscribe(() => {
        service.tasks$.subscribe(tasks => {
          expect(tasks.length).toBe(2);
          done();
        });
      });
    });
  });

  it('should add task with correct status', (done) => {
    service.addTask({ title: 'Task', description: 'Desc', status: 'IN_PROGRESS' }).subscribe(task => {
      expect(task.status).toBe('IN_PROGRESS');
      done();
    });
  });

  // ─── deleteTask() ─────────────────────────────────────────────────

  it('should delete a task by id', (done) => {
    service.addTask({ title: 'To Delete', description: 'Desc', status: 'PENDING' }).subscribe(task => {
      service.deleteTask(task.id).subscribe(() => {
        service.tasks$.subscribe(tasks => {
          expect(tasks.find(t => t.id === task.id)).toBeUndefined();
          done();
        });
      });
    });
  });

  it('should remove task from localStorage after delete', (done) => {
    service.addTask({ title: 'To Delete', description: 'Desc', status: 'PENDING' }).subscribe(task => {
      service.deleteTask(task.id).subscribe(() => {
        const stored = JSON.parse(localStorage.getItem('tasks')!);
        expect(stored.find((t: Task) => t.id === task.id)).toBeUndefined();
        done();
      });
    });
  });

  it('should keep other tasks when deleting one', (done) => {
    service.addTask({ title: 'Keep Me', description: 'Desc', status: 'PENDING' }).subscribe(taskA => {
      service.addTask({ title: 'Delete Me', description: 'Desc', status: 'PENDING' }).subscribe(taskB => {
        service.deleteTask(taskB.id).subscribe(() => {
          service.tasks$.subscribe(tasks => {
            expect(tasks.some(t => t.id === taskA.id)).toBeTrue();
            expect(tasks.some(t => t.id === taskB.id)).toBeFalse();
            done();
          });
        });
      });
    });
  });

  it('should do nothing when deleting a non-existent id', (done) => {
    service.addTask({ title: 'Task', description: 'Desc', status: 'PENDING' }).subscribe(() => {
      service.deleteTask('non-existent-id').subscribe(() => {
        service.tasks$.subscribe(tasks => {
          expect(tasks.length).toBe(1);
          done();
        });
      });
    });
  });

  it('deleteTask should return void observable', (done) => {
    service.addTask({ title: 'Task', description: 'Desc', status: 'PENDING' }).subscribe(task => {
      service.deleteTask(task.id).subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });
  });

  // ─── setSearchTerm() y filteredTasks$ ────────────────────────────

  it('should emit all tasks when search term is empty', (done) => {
    service.addTask({ title: 'Angular Guide', description: 'Desc', status: 'PENDING' }).subscribe(() => {
      service.addTask({ title: 'RxJS Tips', description: 'Desc', status: 'PENDING' }).subscribe(() => {
        service.setSearchTerm('');
        service.filteredTasks$.subscribe(tasks => {
          expect(tasks.length).toBe(2);
          done();
        });
      });
    });
  });

  it('should filter tasks by title', (done) => {
    service.addTask({ title: 'Angular Guide', description: 'Desc', status: 'PENDING' }).subscribe(() => {
      service.addTask({ title: 'RxJS Tips', description: 'Desc', status: 'PENDING' }).subscribe(() => {
        service.setSearchTerm('angular');
        service.filteredTasks$.subscribe(tasks => {
          expect(tasks.length).toBe(1);
          expect(tasks[0].title).toBe('Angular Guide');
          done();
        });
      });
    });
  });

  it('should filter tasks by description', (done) => {
    service.addTask({ title: 'Task A', description: 'Frontend stuff', status: 'PENDING' }).subscribe(() => {
      service.addTask({ title: 'Task B', description: 'Backend stuff', status: 'PENDING' }).subscribe(() => {
        service.setSearchTerm('frontend');
        service.filteredTasks$.subscribe(tasks => {
          expect(tasks.length).toBe(1);
          expect(tasks[0].title).toBe('Task A');
          done();
        });
      });
    });
  });

  it('should filter case-insensitively', (done) => {
    service.addTask({ title: 'ANGULAR TASK', description: 'Desc', status: 'PENDING' }).subscribe(() => {
      service.setSearchTerm('angular');
      service.filteredTasks$.subscribe(tasks => {
        expect(tasks.length).toBe(1);
        done();
      });
    });
  });

  it('should return empty array when no tasks match search', (done) => {
    service.addTask({ title: 'Angular Guide', description: 'Desc', status: 'PENDING' }).subscribe(() => {
      service.setSearchTerm('zzznomatch');
      service.filteredTasks$.subscribe(tasks => {
        expect(tasks.length).toBe(0);
        done();
      });
    });
  });

  it('should update filteredTasks$ when search term changes', (done) => {
    service.addTask({ title: 'Angular Guide', description: 'Desc', status: 'PENDING' }).subscribe(() => {
      service.addTask({ title: 'RxJS Tips', description: 'Desc', status: 'PENDING' }).subscribe(() => {
        service.setSearchTerm('rxjs');
        service.filteredTasks$.subscribe(tasks => {
          expect(tasks.length).toBe(1);
          expect(tasks[0].title).toBe('RxJS Tips');
          done();
        });
      });
    });
  });

  it('should update search$ observable when setSearchTerm is called', (done) => {
    service.setSearchTerm('test search');
    service.search$.subscribe(term => {
      if (term === 'test search') {
        expect(term).toBe('test search');
        done();
      }
    });
  });
});
