import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get current user profile from backend
   */
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  /**
   * Update user profile
   */
  updateUserProfile(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/user/me`, user).pipe(
      tap(updatedUser => this.currentUserSubject.next(updatedUser))
    );
  }

  /**
   * Get current user value
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Clear current user (on logout)
   */
  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }
}
