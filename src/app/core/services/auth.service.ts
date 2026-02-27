import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  login(email: string, password: string): Observable<User> {

    if (!email || !password) {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(800));
    }

    const fakeUser: User = {
      id: crypto.randomUUID(),
      email,
      role: email.includes('admin') ? 'ADMIN' : 'USER',
      token: btoa(`${email}-fake-jwt-token`)
    };

    localStorage.setItem('user', JSON.stringify(fakeUser));
    this.currentUserSubject.next(fakeUser);

    return of(fakeUser).pipe(delay(1000));
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getUserFromStorage(): User | null {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

}