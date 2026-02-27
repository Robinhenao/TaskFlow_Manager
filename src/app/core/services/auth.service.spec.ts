import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => localStorage.clear());

  // ─── Inicialización ───────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with null user when localStorage is empty', () => {
    expect(service.currentUser).toBeNull();
  });

  it('should restore user from localStorage on init', () => {
    const stored = { id: '1', email: 'test@test.com', role: 'USER', token: 'abc' };
    localStorage.setItem('user', JSON.stringify(stored));

    // Re-crear el servicio para que lea localStorage
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: Router, useValue: routerSpy }]
    });
    const freshService = TestBed.inject(AuthService);

    expect(freshService.currentUser?.email).toBe('test@test.com');
  });

  // ─── Login exitoso ────────────────────────────────────────────────

  it('should login and return a user', (done) => {
    service.login('user@test.com', 'password123').subscribe(user => {
      expect(user).toBeTruthy();
      expect(user.email).toBe('user@test.com');
      done();
    });
  });

  it('should assign role USER when email does not contain "admin"', (done) => {
    service.login('user@test.com', 'password123').subscribe(user => {
      expect(user.role).toBe('USER');
      done();
    });
  });

  it('should assign role ADMIN when email contains "admin"', (done) => {
    service.login('admin@test.com', 'password123').subscribe(user => {
      expect(user.role).toBe('ADMIN');
      done();
    });
  });

  it('should generate a base64 token on login', (done) => {
    service.login('user@test.com', 'password123').subscribe(user => {
      expect(user.token).toBeTruthy();
      // Verifica que es base64 decodificable
      expect(() => atob(user.token)).not.toThrow();
      done();
    });
  });

  it('should save user to localStorage after login', (done) => {
    service.login('user@test.com', 'password123').subscribe(() => {
      const stored = localStorage.getItem('user');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.email).toBe('user@test.com');
      done();
    });
  });

  it('should update currentUser$ after login', (done) => {
    service.login('user@test.com', 'password123').subscribe(user => {
      expect(service.currentUser?.email).toBe(user.email);
      done();
    });
  });

  it('should emit new user through currentUser$ observable', (done) => {
    service.currentUser$.subscribe(user => {
      if (user) {
        expect(user.email).toBe('user@test.com');
        done();
      }
    });
    service.login('user@test.com', 'password123').subscribe();
  });

  // ─── Login fallido ────────────────────────────────────────────────

  it('should throw error when email is empty', (done) => {
    service.login('', 'password123').subscribe({
      error: (err) => {
        expect(err.message).toBe('Invalid credentials');
        done();
      }
    });
  });

  it('should throw error when password is empty', (done) => {
    service.login('user@test.com', '').subscribe({
      error: (err) => {
        expect(err.message).toBe('Invalid credentials');
        done();
      }
    });
  });

  it('should throw error when both fields are empty', (done) => {
    service.login('', '').subscribe({
      error: (err) => {
        expect(err.message).toBe('Invalid credentials');
        done();
      }
    });
  });

  it('should NOT save to localStorage on failed login', (done) => {
    service.login('', '').subscribe({
      error: () => {
        expect(localStorage.getItem('user')).toBeNull();
        done();
      }
    });
  });

  // ─── Logout ───────────────────────────────────────────────────────

  it('should remove user from localStorage on logout', (done) => {
    service.login('user@test.com', 'password123').subscribe(() => {
      service.logout();
      expect(localStorage.getItem('user')).toBeNull();
      done();
    });
  });

  it('should set currentUser to null on logout', (done) => {
    service.login('user@test.com', 'password123').subscribe(() => {
      service.logout();
      expect(service.currentUser).toBeNull();
      done();
    });
  });

  it('should navigate to /login on logout', (done) => {
    service.login('user@test.com', 'password123').subscribe(() => {
      service.logout();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });

  it('should emit null through currentUser$ after logout', (done) => {
    service.login('user@test.com', 'password123').subscribe(() => {
      service.currentUser$.subscribe(user => {
        if (user === null) {
          expect(user).toBeNull();
          done();
        }
      });
      service.logout();
    });
  });
});
