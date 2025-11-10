import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../../../auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen">
      <!-- Header -->
      <header class="glass-card m-4 p-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-light text-gray-900">iFinance</h1>
          </div>
          
          <div class="flex items-center gap-4" *ngIf="currentUser">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ currentUser.name }}</p>
              <p class="text-xs text-gray-600">{{ currentUser.email }}</p>
            </div>
            <img 
              [src]="currentUser.profilePicture" 
              [alt]="currentUser.name"
              class="w-10 h-10 rounded-full border-2 border-white/50"
            />
            <button
              (click)="logout()"
              class="glass-button px-4 py-2 rounded-lg text-sm font-medium text-gray-900 
                     hover:bg-white/60 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="p-4">
        <div class="glass-card p-8 text-center">
          <h2 class="text-3xl font-light text-gray-900 mb-4">
            Welcome to iFinance! 🎉
          </h2>
          <p class="text-gray-600 mb-6">
            Your personal finance management dashboard
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div class="glass-card p-6">
              <div class="text-4xl mb-3">🚗</div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Travel Records</h3>
              <p class="text-sm text-gray-600">Track your daily commute expenses</p>
            </div>
            
            <div class="glass-card p-6">
              <div class="text-4xl mb-3">💰</div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Expenses</h3>
              <p class="text-sm text-gray-600">Manage miscellaneous expenses</p>
            </div>
            
            <div class="glass-card p-6">
              <div class="text-4xl mb-3">💳</div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Credit Cards</h3>
              <p class="text-sm text-gray-600">Track credit card transactions</p>
            </div>
          </div>

          <div class="mt-8 text-sm text-gray-500">
            <p>Phase 1 (Authentication) completed! 🚀</p>
            <p class="mt-2">Ready to implement expense tracking features...</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
