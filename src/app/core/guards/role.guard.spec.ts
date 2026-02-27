import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const runGuard = (role: string) => {
    const route = { data: { role } } as unknown as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() =>
      roleGuard(route, {} as RouterStateSnapshot)
    );
  };

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

  // ─── Acceso ADMIN ────────────────────────────────────────────────

  it('should allow ADMIN user to access ADMIN route', () => {
    Object.defineProperty(authServiceMock, 'currentUser', { get: () => ({ role: 'ADMIN' }) });

    expect(runGuard('ADMIN')).toBeTrue();
  });

  it('should deny USER trying to access ADMIN route', () => {
    Object.defineProperty(authServiceMock, 'currentUser', { get: () => ({ role: 'USER' }) });

    expect(runGuard('ADMIN')).toBeFalse();
  });

  it('should redirect to /dashboard when USER tries to access ADMIN route', () => {
    Object.defineProperty(authServiceMock, 'currentUser', { get: () => ({ role: 'USER' }) });

    runGuard('ADMIN');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  // ─── Acceso USER ────────────────────────────────────────────────

  it('should allow USER to access USER route', () => {
    Object.defineProperty(authServiceMock, 'currentUser', { get: () => ({ role: 'USER' }) });

    expect(runGuard('USER')).toBeTrue();
  });

  it('should deny ADMIN trying to access USER-only route', () => {
    Object.defineProperty(authServiceMock, 'currentUser', { get: () => ({ role: 'ADMIN' }) });

    expect(runGuard('USER')).toBeFalse();
  });

  // ─── Sin sesión ────────────────────────────────────────────────

  it('should deny access when user is null', () => {
    Object.defineProperty(authServiceMock, 'currentUser', { get: () => null });

    expect(runGuard('ADMIN')).toBeFalse();
  });

  it('should redirect to /dashboard when user is null', () => {
    Object.defineProperty(authServiceMock, 'currentUser', { get: () => null });

    runGuard('ADMIN');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  // ─── Sin rol requerido ────────────────────────────────────────

  it('should deny access when route has no required role defined', () => {
    Object.defineProperty(authServiceMock, 'currentUser', { get: () => ({ role: 'ADMIN' }) });

    // undefined !== 'ADMIN' → debe bloquear
    expect(runGuard(undefined as any)).toBeFalse();
  });
});
