import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const fakeUser = { id: '1', email: 'user@test.com', role: 'USER', token: 'abc' };

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerSpy },
        ChangeDetectorRef
      ],
      schemas: [NO_ERRORS_SCHEMA] // ✅ ignora app-input y app-button
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Creación ─────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with loading = false', () => {
    expect(component.loading()).toBeFalse();
  });

  it('should start with error = null', () => {
    expect(component.error()).toBeNull();
  });

  it('should build the form with email and password controls', () => {
    expect(component.form.get('email')).toBeTruthy();
    expect(component.form.get('password')).toBeTruthy();
  });

  it('should start with invalid form', () => {
    expect(component.form.invalid).toBeTrue();
  });

  // ─── Validaciones del formulario ──────────────────────────────────

  it('emailControl should be invalid when empty', () => {
    component.emailControl.setValue('');
    expect(component.emailControl.invalid).toBeTrue();
  });

  it('emailControl should be invalid with bad format', () => {
    component.emailControl.setValue('notanemail');
    expect(component.emailControl.errors?.['email']).toBeTrue();
  });

  it('emailControl should be valid with correct email', () => {
    component.emailControl.setValue('user@test.com');
    expect(component.emailControl.valid).toBeTrue();
  });

  it('passwordControl should be invalid when empty', () => {
    component.passwordControl.setValue('');
    expect(component.passwordControl.invalid).toBeTrue();
  });

  it('passwordControl should fail minlength under 8 chars', () => {
    component.passwordControl.setValue('Ab1!');
    expect(component.passwordControl.errors?.['minlength']).toBeTruthy();
  });

  it('passwordControl should fail strongPasswordValidator without uppercase', () => {
    component.passwordControl.setValue('abcd1234!');
    expect(component.passwordControl.errors?.['noUpperCase']).toBeTrue();
  });

  it('passwordControl should fail strongPasswordValidator without number', () => {
    component.passwordControl.setValue('Abcdefgh!');
    expect(component.passwordControl.errors?.['noNumber']).toBeTrue();
  });

  it('passwordControl should fail strongPasswordValidator without special char', () => {
    component.passwordControl.setValue('Abcdefg1');
    expect(component.passwordControl.errors?.['noSpecial']).toBeTrue();
  });

  it('passwordControl should be valid with strong password', () => {
    component.passwordControl.setValue('Abcdef1!');
    expect(component.passwordControl.valid).toBeTrue();
  });

  // ─── submit() con formulario inválido ─────────────────────────────

  it('should mark all fields as touched when form is invalid', () => {
    spyOn(component.form, 'markAllAsTouched');
    component.submit();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should NOT call authService.login when form is invalid', () => {
    component.submit();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should NOT navigate when form is invalid', () => {
    component.submit();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // ─── submit() con formulario válido ──────────────────────────────

  const fillValidForm = (component: LoginComponent) => {
    component.emailControl.setValue('user@test.com');
    component.passwordControl.setValue('Abcdef1!');
  };

  it('should set loading to true while submitting', () => {
    let loadingDuringCall = false;
    authServiceMock.login.and.callFake(() => {
      loadingDuringCall = component.loading();
      return of(fakeUser as any);
    });
    fillValidForm(component);
    component.submit();
    expect(loadingDuringCall).toBeTrue();
  });

  it('should call authService.login with correct credentials', () => {
    authServiceMock.login.and.returnValue(of(fakeUser as any));
    fillValidForm(component);
    component.submit();
    expect(authServiceMock.login).toHaveBeenCalledWith('user@test.com', 'Abcdef1!');
  });

  it('should navigate to /dashboard on successful login', () => {
    authServiceMock.login.and.returnValue(of(fakeUser as any));
    fillValidForm(component);
    component.submit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should set loading to false after successful login', () => {
    authServiceMock.login.and.returnValue(of(fakeUser as any));
    fillValidForm(component);
    component.submit();
    expect(component.loading()).toBeFalse();
  });

  it('should keep error null after successful login', () => {
    authServiceMock.login.and.returnValue(of(fakeUser as any));
    fillValidForm(component);
    component.submit();
    expect(component.error()).toBeNull();
  });

  // ─── submit() con error ───────────────────────────────────────────

  it('should set error message on login failure', () => {
    authServiceMock.login.and.returnValue(throwError(() => new Error('Invalid credentials')));
    fillValidForm(component);
    component.submit();
    expect(component.error()).toBe('Invalid credentials');
  });

  it('should set loading to false on login failure', () => {
    authServiceMock.login.and.returnValue(throwError(() => new Error('fail')));
    fillValidForm(component);
    component.submit();
    expect(component.loading()).toBeFalse();
  });

  it('should set fallback error message when err.message is undefined', () => {
    authServiceMock.login.and.returnValue(throwError(() => ({})));
    fillValidForm(component);
    component.submit();
    expect(component.error()).toBe('Error al iniciar sesión');
  });

  it('should NOT navigate on login failure', () => {
    authServiceMock.login.and.returnValue(throwError(() => new Error('fail')));
    fillValidForm(component);
    component.submit();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // ─── Getters ─────────────────────────────────────────────────────

  it('emailControl getter should return the email form control', () => {
    expect(component.emailControl).toBe(component.form.get('email')!);
  });

  it('passwordControl getter should return the password form control', () => {
    expect(component.passwordControl).toBe(component.form.get('password')!);
  });
});
