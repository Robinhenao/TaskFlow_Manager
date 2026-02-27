import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);

  if (!auth.currentUser?.token) {
    return throwError(() => new Error('401 Unauthorized'));
  }

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${auth.currentUser.token}`
    }
  });

  return next(cloned);
};