import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from './src/app/core/services/user.service';
import { environment } from './src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  /**
   * Check if user is authenticated by attempting to fetch user profile
   */
  isAuthenticated(): Observable<boolean> {
    return this.userService.getUserProfile().pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  /**
   * Redirect to Google OAuth2 login
   */
  loginWithGoogle(): void {
    window.location.href = `${environment.authUrl}/oauth2/authorization/google`;
  }

  /**
   * Logout user
   */
  logout(): Observable<void> {
    // Clear user from service
    this.userService.clearCurrentUser();
    
    // Redirect to backend logout endpoint which will clear session
    window.location.href = `${environment.authUrl}/logout`;
    
    return of(undefined);
  }
}
