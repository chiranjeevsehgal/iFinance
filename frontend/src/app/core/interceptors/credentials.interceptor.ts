import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor to add withCredentials: true to all HTTP requests
 * This ensures cookies (session) are sent with cross-origin requests
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    withCredentials: true
  });
  
  return next(clonedRequest);
};
