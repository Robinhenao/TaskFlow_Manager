import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', [], { currentUser: null });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('should allow access when user is logged in', () => {
    // Simular usuario autenticado
    Object.defineProperty(authServiceMock, 'currentUser', { get: () => ({ id: '1', email: 'user@test.com', role: 'USER', token: 'abc' }) });

    const result = runGuard();

    expect(result).toBeTrue();
  });

  it('should deny access when user is NOT logged in', () => {
    Object.defineProperty(authServiceMock, 'currentUser', { get: () => null });

    const result = runGuard();

    expect(result).toBeFalse();
  });

  it('should redirect to /login when user is NOT logged in', () => {
    Object.defineProperty(authServiceMock, 'currentUser', { get: () => null });

    runGuard();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should NOT redirect when user IS logged in', () => {
    Object.defineProperty(authServiceMock, 'currentUser', { get: () => ({ id: '1', email: 'user@test.com', role: 'USER', token: 'abc' }) });

    runGuard();

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
