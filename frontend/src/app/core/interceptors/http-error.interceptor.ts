import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor to handle HTTP errors globally
 * Redirects to login on 401 Unauthorized
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - redirect to login
        router.navigate(['/login']);
      } else if (error.status === 403) {
        // Forbidden
        console.error('Access forbidden:', error);
      } else if (error.status === 500) {
        // Server error
        console.error('Server error:', error);
      }
      
      return throwError(() => error);
    })
  );
};
