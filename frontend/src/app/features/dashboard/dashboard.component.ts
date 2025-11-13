import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../../../auth.service';
import { ReportService } from '../../core/services/report.service';
import { TravelService } from '../../core/services/travel.service';
import { ExpenseService } from '../../core/services/expense.service';
import { InvestmentService } from '../../core/services/investment.service';
import { User } from '../../core/models/user.model';
import { FinancialSummary, RecentTransaction, PeriodType } from '../../core/models/report.model';
import { TimeOfDay } from '../../core/models/travel-record.model';
import { ExpenseCategory, PaymentMethod, EXPENSE_CATEGORIES, getCategoryConfig } from '../../core/models/expense.model';
import { InvestmentCategory, INVESTMENT_CATEGORY_CONFIG } from '../../core/models/investment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

      <!-- Quick Entry Modal -->
      <div *ngIf="showQuickEntryModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
           (click)="closeQuickEntryModal()">
        <div class="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-medium text-gray-900">Quick Add Entry</h3>
            <button (click)="closeQuickEntryModal()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>

          <!-- Entry Type Selector -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Entry Type</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                (click)="setEntryType('travel')"
                [class]="selectedEntryType === 'travel'
                  ? 'glass-button-primary px-4 py-3 rounded-lg text-sm font-medium text-white transition-all'
                  : 'glass-button px-4 py-3 rounded-lg text-sm font-medium text-gray-900 transition-all'"
              >
                🚗 Travel
              </button>
              <button
                (click)="setEntryType('expense')"
                [class]="selectedEntryType === 'expense'
                  ? 'glass-button-primary px-4 py-3 rounded-lg text-sm font-medium text-white transition-all'
                  : 'glass-button px-4 py-3 rounded-lg text-sm font-medium text-gray-900 transition-all'"
              >
                💰 Expense
              </button>
              <button
                (click)="setEntryType('investment')"
                [class]="selectedEntryType === 'investment'
                  ? 'glass-button-primary px-4 py-3 rounded-lg text-sm font-medium text-white transition-all'
                  : 'glass-button px-4 py-3 rounded-lg text-sm font-medium text-gray-900 transition-all'"
              >
                📈 Investment
              </button>
            </div>
          </div>

          <!-- Travel Form -->
          <form *ngIf="selectedEntryType === 'travel'" [formGroup]="travelForm" (ngSubmit)="submitTravelEntry()">
            <div class="space-y-4">
              <!-- Info message when editing existing records -->
              <div *ngIf="existingTravelRecords.morning || existingTravelRecords.evening" 
                   class="glass-card p-3 bg-blue-100/30 border border-blue-300/50">
                <p class="text-sm text-blue-800">
                  ℹ️ Existing travel records found for this date. Edit and save to update.
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input type="date" formControlName="date" 
                       class="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              </div>

              <!-- Morning Entry -->
              <div class="glass-card p-4">
                <div class="flex items-center mb-3">
                  <input type="checkbox" formControlName="includeMorning" class="mr-2">
                  <label class="text-sm font-medium text-gray-700">☀️ Morning Travel</label>
                </div>
                <div *ngIf="travelForm.get('includeMorning')?.value">
                  <input type="number" formControlName="morningCost" placeholder="Morning cost"
                         class="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                </div>
              </div>

              <!-- Evening Entry -->
              <div class="glass-card p-4">
                <div class="flex items-center mb-3">
                  <input type="checkbox" formControlName="includeEvening" class="mr-2">
                  <label class="text-sm font-medium text-gray-700">🌙 Evening Travel</label>
                </div>
                <div *ngIf="travelForm.get('includeEvening')?.value">
                  <input type="number" formControlName="eveningCost" placeholder="Evening cost"
                         class="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                </div>
              </div>

              <div class="flex gap-3 justify-end">
                <button type="button" (click)="closeQuickEntryModal()"
                        class="glass-button px-6 py-2 rounded-lg text-sm font-medium text-gray-900">
                  Cancel
                </button>
                <button type="submit" [disabled]="!travelForm.valid || isSubmitting"
                        class="glass-button-primary px-6 py-2 rounded-lg text-sm font-medium text-white">
                  {{ isSubmitting ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </div>
          </form>

          <!-- Expense Form -->
          <form *ngIf="selectedEntryType === 'expense'" [formGroup]="expenseForm" (ngSubmit)="submitExpenseEntry()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input type="date" formControlName="date"
                       class="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select formControlName="category"
                        class="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select category</option>
                  <option *ngFor="let cat of expenseCategories" [value]="cat.value">
                    {{ cat.icon }} {{ cat.label }}
                  </option>
                </select>
              </div>

              <div *ngIf="expenseForm.get('category')?.value === 'OTHER'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Other Category Name</label>
                <input type="text" formControlName="otherCategoryName" placeholder="Enter category name"
                       class="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                <input type="number" formControlName="amount" placeholder="0.00"
                       class="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select formControlName="paymentMethod"
                        class="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select payment method</option>
                  <option value="CASH">💵 Cash</option>
                  <option value="UPI">📱 UPI</option>
                  <option value="DEBIT_CARD">💳 Debit Card</option>
                  <option value="CREDIT_CARD">💳 Credit Card</option>
                  <option value="OTHER">🔄 Other</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea formControlName="description" rows="3" placeholder="Enter description"
                          class="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>

              <div class="flex gap-3 justify-end">
                <button type="button" (click)="closeQuickEntryModal()"
                        class="glass-button px-6 py-2 rounded-lg text-sm font-medium text-gray-900">
                  Cancel
                </button>
                <button type="submit" [disabled]="!expenseForm.valid || isSubmitting"
                        class="glass-button-primary px-6 py-2 rounded-lg text-sm font-medium text-white">
                  {{ isSubmitting ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </div>
          </form>

          <!-- Investment Form -->
          <form *ngIf="selectedEntryType === 'investment'" [formGroup]="investmentForm" (ngSubmit)="submitInvestmentEntry()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input type="date" formControlName="date"
                       class="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select formControlName="category"
                        class="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select category</option>
                  <option *ngFor="let cat of investmentCategories" [value]="cat.value">
                    {{ cat.icon }} {{ cat.label }}
                  </option>
                </select>
              </div>

              <div *ngIf="investmentForm.get('category')?.value === 'OTHER'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Other Category Name</label>
                <input type="text" formControlName="otherCategoryName" placeholder="Enter category name"
                       class="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                <input type="number" formControlName="amount" placeholder="0.00"
                       class="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea formControlName="description" rows="3" placeholder="Enter description"
                          class="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>

              <div class="flex gap-3 justify-end">
                <button type="button" (click)="closeQuickEntryModal()"
                        class="glass-button px-6 py-2 rounded-lg text-sm font-medium text-gray-900">
                  Cancel
                </button>
                <button type="submit" [disabled]="!investmentForm.valid || isSubmitting"
                        class="glass-button-primary px-6 py-2 rounded-lg text-sm font-medium text-white">
                  {{ isSubmitting ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
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
  selectedEntryType: 'travel' | 'expense' | 'investment' = 'travel';
  isSubmitting = false;
  existingTravelRecords: { morning?: any; evening?: any } = {};

  // Forms
  travelForm: FormGroup;
  expenseForm: FormGroup;
  investmentForm: FormGroup;

  // Categories for dropdowns
  expenseCategories = EXPENSE_CATEGORIES;
  investmentCategories = Object.entries(INVESTMENT_CATEGORY_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
    icon: config.icon
  }));

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private reportService: ReportService,
    private travelService: TravelService,
    private expenseService: ExpenseService,
    private investmentService: InvestmentService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialize forms
    this.travelForm = this.fb.group({
      date: [this.getTodayDate(), Validators.required],
      includeMorning: [false],
      morningCost: [null],
      includeEvening: [false],
      eveningCost: [null]
    });

    this.expenseForm = this.fb.group({
      date: [this.getTodayDate(), Validators.required],
      category: ['', Validators.required],
      otherCategoryName: [''],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      paymentMethod: ['', Validators.required],
      description: ['']
    });

    this.investmentForm = this.fb.group({
      date: [this.getTodayDate(), Validators.required],
      category: ['', Validators.required],
      otherCategoryName: [''],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      description: ['']
    });

    // Watch for category changes to handle "OTHER" validation
    this.expenseForm.get('category')?.valueChanges.subscribe(category => {
      const otherCategoryControl = this.expenseForm.get('otherCategoryName');
      if (category === 'OTHER') {
        otherCategoryControl?.setValidators([Validators.required]);
      } else {
        otherCategoryControl?.clearValidators();
        otherCategoryControl?.setValue('');
      }
      otherCategoryControl?.updateValueAndValidity();
    });

    this.investmentForm.get('category')?.valueChanges.subscribe(category => {
      const otherCategoryControl = this.investmentForm.get('otherCategoryName');
      if (category === 'OTHER') {
        otherCategoryControl?.setValidators([Validators.required]);
      } else {
        otherCategoryControl?.clearValidators();
        otherCategoryControl?.setValue('');
      }
      otherCategoryControl?.updateValueAndValidity();
    });

    // Watch for travel date changes to pre-populate existing data
    this.travelForm.get('date')?.valueChanges.subscribe(date => {
      if (date && this.showQuickEntryModal && this.selectedEntryType === 'travel') {
        this.loadExistingTravelData(date);
      }
    });
  }

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
    this.selectedEntryType = 'travel';
    this.resetForms();
    // Load existing travel data for today when opening modal
    this.loadExistingTravelData(this.getTodayDate());
  }

  closeQuickEntryModal(): void {
    this.showQuickEntryModal = false;
    this.resetForms();
  }

  setEntryType(type: 'travel' | 'expense' | 'investment'): void {
    this.selectedEntryType = type;
    this.resetForms();
    // If switching to travel, load existing data
    if (type === 'travel') {
      this.loadExistingTravelData(this.travelForm.get('date')?.value || this.getTodayDate());
    }
  }

  loadExistingTravelData(date: string): void {
    this.travelService.getTravelRecordsByDate(date).subscribe({
      next: (records) => {
        // Find morning and evening records
        const morningRecord = records.find(r => r.timeOfDay === 'MORNING');
        const eveningRecord = records.find(r => r.timeOfDay === 'EVENING');

        // Store existing records for update
        this.existingTravelRecords = {
          morning: morningRecord,
          evening: eveningRecord
        };

        // Pre-populate form with existing data
        this.travelForm.patchValue({
          includeMorning: !!morningRecord,
          morningCost: morningRecord?.cost || null,
          includeEvening: !!eveningRecord,
          eveningCost: eveningRecord?.cost || null
        }, { emitEvent: false });
      },
      error: (error) => {
        console.error('Error loading existing travel data:', error);
        // Reset checkboxes and costs if error or no data
        this.existingTravelRecords = {};
        this.travelForm.patchValue({
          includeMorning: false,
          morningCost: null,
          includeEvening: false,
          eveningCost: null
        }, { emitEvent: false });
      }
    });
  }

  resetForms(): void {
    this.travelForm.reset({
      date: this.getTodayDate(),
      includeMorning: false,
      includeEvening: false
    });
    this.expenseForm.reset({
      date: this.getTodayDate()
    });
    this.investmentForm.reset({
      date: this.getTodayDate()
    });
    this.isSubmitting = false;
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Submit Methods
  submitTravelEntry(): void {
    if (!this.travelForm.valid) return;

    const formValue = this.travelForm.value;
    const saveRequests: any[] = [];

    // Handle Morning Entry
    if (formValue.includeMorning && formValue.morningCost) {
      if (this.existingTravelRecords.morning) {
        // Update existing morning record
        const updatedRecord = {
          ...this.existingTravelRecords.morning,
          cost: formValue.morningCost,
          date: formValue.date
        };
        saveRequests.push(
          this.travelService.updateTravelRecord(this.existingTravelRecords.morning.id, updatedRecord)
        );
      } else {
        // Create new morning record
        saveRequests.push(
          this.travelService.createTravelRecord({
            date: formValue.date,
            timeOfDay: TimeOfDay.MORNING,
            cost: formValue.morningCost
          })
        );
      }
    } else if (this.existingTravelRecords.morning && !formValue.includeMorning) {
      // Delete existing morning record if unchecked
      saveRequests.push(
        this.travelService.deleteTravelRecord(this.existingTravelRecords.morning.id)
      );
    }

    // Handle Evening Entry
    if (formValue.includeEvening && formValue.eveningCost) {
      if (this.existingTravelRecords.evening) {
        // Update existing evening record
        const updatedRecord = {
          ...this.existingTravelRecords.evening,
          cost: formValue.eveningCost,
          date: formValue.date
        };
        saveRequests.push(
          this.travelService.updateTravelRecord(this.existingTravelRecords.evening.id, updatedRecord)
        );
      } else {
        // Create new evening record
        saveRequests.push(
          this.travelService.createTravelRecord({
            date: formValue.date,
            timeOfDay: TimeOfDay.EVENING,
            cost: formValue.eveningCost
          })
        );
      }
    } else if (this.existingTravelRecords.evening && !formValue.includeEvening) {
      // Delete existing evening record if unchecked
      saveRequests.push(
        this.travelService.deleteTravelRecord(this.existingTravelRecords.evening.id)
      );
    }

    if (saveRequests.length === 0) {
      alert('Please select at least one travel entry (Morning or Evening) or make changes to existing records');
      return;
    }

    this.isSubmitting = true;

    // Wait for all to complete
    Promise.all(saveRequests.map(req => req.toPromise())).then(
      () => {
        alert('Travel record(s) saved successfully!');
        this.closeQuickEntryModal();
        this.loadSummary();
        this.loadRecentTransactions();
      },
      (error) => {
        console.error('Error saving travel records:', error);
        alert('Error saving travel records. Please try again.');
        this.isSubmitting = false;
      }
    );
  }

  submitExpenseEntry(): void {
    if (!this.expenseForm.valid) return;

    this.isSubmitting = true;
    const expenseData = this.expenseForm.value;

    this.expenseService.createExpense(expenseData).subscribe({
      next: () => {
        alert('Expense saved successfully!');
        this.closeQuickEntryModal();
        this.loadSummary();
        this.loadRecentTransactions();
      },
      error: (error) => {
        console.error('Error saving expense:', error);
        alert('Error saving expense. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  submitInvestmentEntry(): void {
    if (!this.investmentForm.valid) return;

    this.isSubmitting = true;
    const investmentData = this.investmentForm.value;

    this.investmentService.createInvestment(investmentData).subscribe({
      next: () => {
        alert('Investment saved successfully!');
        this.closeQuickEntryModal();
        this.loadSummary();
        this.loadRecentTransactions();
      },
      error: (error) => {
        console.error('Error saving investment:', error);
        alert('Error saving investment. Please try again.');
        this.isSubmitting = false;
      }
    });
  }
}
