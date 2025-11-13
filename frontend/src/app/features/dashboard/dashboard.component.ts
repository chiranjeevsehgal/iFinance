import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../../../auth.service';
import { ReportService } from '../../core/services/report.service';
import { User } from '../../core/models/user.model';
import { FinancialSummary, RecentTransaction, PeriodType } from '../../core/models/report.model';
import { QuickAddModalComponent } from '../../shared/components/quick-add-modal/quick-add-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, QuickAddModalComponent],
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
        <!-- Period Selector -->
        <div class="glass-card p-4 mb-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium text-gray-900">Financial Overview</h2>
            <div class="flex gap-2">
              <button
                (click)="openQuickEntryModal()"
                class="glass-button-primary px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300"
              >
                + Quick Add
              </button>
              <button
                (click)="setPeriod('daily')"
                [class]="selectedPeriod === 'daily' 
                  ? 'glass-button-primary px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300'
                  : 'glass-button px-4 py-2 rounded-lg text-sm font-medium text-gray-900 transition-all duration-300'"
              >
                Daily
              </button>
              <button
                (click)="setPeriod('weekly')"
                [class]="selectedPeriod === 'weekly' 
                  ? 'glass-button-primary px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300'
                  : 'glass-button px-4 py-2 rounded-lg text-sm font-medium text-gray-900 transition-all duration-300'"
              >
                Weekly
              </button>
              <button
                (click)="setPeriod('monthly')"
                [class]="selectedPeriod === 'monthly' 
                  ? 'glass-button-primary px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300'
                  : 'glass-button px-4 py-2 rounded-lg text-sm font-medium text-gray-900 transition-all duration-300'"
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="glass-card p-8 text-center">
          <p class="text-gray-600">Loading summary...</p>
        </div>

        <!-- Summary Cards -->
        <div *ngIf="!isLoading && summary" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Travel Card -->
          <div class="glass-card p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium text-gray-600">Travel</h3>
              <span class="text-2xl">🚗</span>
            </div>
            <p class="text-2xl font-light text-gray-900">₹{{ summary.totalTravel | number:'1.2-2' }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ summary.travelCount }} records</p>
          </div>

          <!-- Expenses Card -->
          <div class="glass-card p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium text-gray-600">Expenses</h3>
              <span class="text-2xl">💰</span>
            </div>
            <p class="text-2xl font-light text-gray-900">₹{{ summary.totalExpenses | number:'1.2-2' }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ summary.expenseCount }} records</p>
          </div>

          <!-- Investments Card -->
          <div class="glass-card p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium text-gray-600">Investments</h3>
              <span class="text-2xl">📈</span>
            </div>
            <p class="text-2xl font-light text-gray-900">₹{{ summary.totalInvestments | number:'1.2-2' }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ summary.investmentCount }} records</p>
          </div>

          <!-- Grand Total Card -->
          <div class="glass-card p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium text-gray-900">Grand Total</h3>
              <span class="text-2xl">💎</span>
            </div>
            <p class="text-2xl font-semibold text-gray-900">₹{{ summary.grandTotal | number:'1.2-2' }}</p>
            <p class="text-xs text-gray-600 mt-1">{{ summary.totalTransactions }} total transactions</p>
          </div>
        </div>

        <!-- Period Info -->
        <div *ngIf="!isLoading && summary" class="glass-card p-4 mb-6">
          <p class="text-sm text-gray-600 text-center">
            <span class="font-medium">Period:</span> 
            {{ summary.startDate | date:'MMM d, yyyy' }} - {{ summary.endDate | date:'MMM d, yyyy' }}
          </p>
        </div>

        <!-- Recent Transactions -->
        <div *ngIf="!isLoading && recentTransactions.length > 0" class="glass-card p-6 mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
          <div class="space-y-3">
            <div *ngFor="let transaction of recentTransactions" 
                 class="flex items-center justify-between p-3 bg-white/20 rounded-lg">
              <div class="flex items-center gap-3">
                <span class="text-xl" [innerHTML]="getTransactionIcon(transaction.type)"></span>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ transaction.description }}</p>
                  <p class="text-xs text-gray-600">{{ transaction.date | date:'MMM d, yyyy' }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">₹{{ transaction.amount | number:'1.2-2' }}</p>
                <p class="text-xs text-gray-500">{{ getTransactionTypeLabel(transaction.type) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="glass-card p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              (click)="navigateTo('/travel')"
              class="glass-card p-6 hover:scale-105 transition-transform cursor-pointer text-center"
            >
              <div class="text-4xl mb-3">�</div>
              <h4 class="text-lg font-medium text-gray-900 mb-2">Travel Records</h4>
              <p class="text-sm text-gray-600">Track your daily commute expenses</p>
            </button>
            
            <button 
              (click)="navigateTo('/expenses')"
              class="glass-card p-6 hover:scale-105 transition-transform cursor-pointer text-center"
            >
              <div class="text-4xl mb-3">💰</div>
              <h4 class="text-lg font-medium text-gray-900 mb-2">Expenses</h4>
              <p class="text-sm text-gray-600">Manage miscellaneous expenses</p>
            </button>
            
            <button 
              (click)="navigateTo('/investments')"
              class="glass-card p-6 hover:scale-105 transition-transform cursor-pointer text-center"
            >
              <div class="text-4xl mb-3">📈</div>
              <h4 class="text-lg font-medium text-gray-900 mb-2">Investments & Savings</h4>
              <p class="text-sm text-gray-600">Track your investments and savings</p>
            </button>
          </div>
        </div>
      </main>

      <!-- Quick Add Modal Component -->
      <app-quick-add-modal 
        [isOpen]="showQuickEntryModal"
        (closeModal)="closeQuickEntryModal()"
        (entrySaved)="onEntrySaved()">
      </app-quick-add-modal>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  selectedPeriod: PeriodType = 'weekly';
  summary: FinancialSummary | null = null;
  recentTransactions: RecentTransaction[] = [];
  isLoading = false;

  // Quick Entry Modal
  showQuickEntryModal = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadSummary();
    this.loadRecentTransactions();
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

  loadSummary(): void {
    this.isLoading = true;
    
    let summaryObservable;
    switch (this.selectedPeriod) {
      case 'daily':
        summaryObservable = this.reportService.getDailySummary();
        break;
      case 'weekly':
        summaryObservable = this.reportService.getWeeklySummary();
        break;
      case 'monthly':
        summaryObservable = this.reportService.getMonthlySummary();
        break;
    }

    summaryObservable.subscribe({
      next: (summary) => {
        this.summary = summary;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading summary:', error);
        this.isLoading = false;
      }
    });
  }

  loadRecentTransactions(): void {
    this.reportService.getRecentTransactions().subscribe({
      next: (response) => {
        this.recentTransactions = response.transactions;
      },
      error: (error) => {
        console.error('Error loading recent transactions:', error);
      }
    });
  }

  setPeriod(period: PeriodType): void {
    this.selectedPeriod = period;
    this.loadSummary();
  }

  getTransactionIcon(type: string): string {
    switch (type) {
      case 'TRAVEL': return '🚗';
      case 'EXPENSE': return '💰';
      case 'INVESTMENT': return '📈';
      default: return '💵';
    }
  }

  getTransactionTypeLabel(type: string): string {
    switch (type) {
      case 'TRAVEL': return 'Travel';
      case 'EXPENSE': return 'Expense';
      case 'INVESTMENT': return 'Investment';
      default: return 'Transaction';
    }
  }

  logout(): void {
    this.authService.logout();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // Quick Entry Modal Methods
  openQuickEntryModal(): void {
    this.showQuickEntryModal = true;
  }

  closeQuickEntryModal(): void {
    this.showQuickEntryModal = false;
  }

  onEntrySaved(): void {
    // Refresh summary and recent transactions after a new entry is saved
    this.loadSummary();
    this.loadRecentTransactions();
  }
}
