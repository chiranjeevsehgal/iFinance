import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../core/services/expense.service';
import {
  Expense,
  ExpenseCategory,
  PaymentMethod,
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
  getCategoryConfig,
  getPaymentMethodConfig
} from '../../core/models/expense.model';

/**
 * Component for listing and managing expenses
 */
@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-light text-gray-900">Expenses</h1>
        <a
          routerLink="/expenses/new"
          class="glass-button-primary px-6 py-2.5 text-sm font-medium">
          + Add Expense
        </a>
      </div>

      <!-- Filters -->
      <div class="glass-card p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              [(ngModel)]="filters.startDate"
              (change)="applyFilters()"
              class="glass-input w-full px-4 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              [(ngModel)]="filters.endDate"
              (change)="applyFilters()"
              class="glass-input w-full px-4 py-2 text-sm" />
          </div>

          <!-- Category Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              [(ngModel)]="filters.category"
              (change)="applyFilters()"
              class="glass-input w-full px-4 py-2 text-sm">
              <option [ngValue]="null">All Categories</option>
              <option *ngFor="let cat of categories" [value]="cat.value">
                {{ cat.icon }} {{ cat.label }}
              </option>
            </select>
          </div>

          <!-- Payment Method Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
              [(ngModel)]="filters.paymentMethod"
              (change)="applyFilters()"
              class="glass-input w-full px-4 py-2 text-sm">
              <option [ngValue]="null">All Methods</option>
              <option *ngFor="let method of paymentMethods" [value]="method.value">
                {{ method.icon }} {{ method.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Search -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Description</label>
          <input
            type="text"
            [(ngModel)]="searchKeyword"
            (input)="onSearch()"
            placeholder="Type to search..."
            class="glass-input w-full px-4 py-2 text-sm" />
        </div>

        <!-- Clear Filters -->
        <div class="mt-4 flex justify-end">
          <button
            (click)="clearFilters()"
            class="glass-button px-4 py-2 text-sm">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Total -->
      <div class="glass-card p-4 mb-6">
        <div class="flex items-center justify-between">
          <span class="text-lg font-light text-gray-700">Total Expenses:</span>
          <span class="text-2xl font-light text-gray-900">₹{{ calculateTotal() | number:'1.2-2' }}</span>
        </div>
        <div class="text-sm text-gray-600 mt-1">
          {{ filteredExpenses.length }} expense(s)
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-4 text-gray-600">Loading expenses...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="glass-card bg-red-50/30 border-red-200/50 p-4 mb-6">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Expense List -->
      <div *ngIf="!loading && filteredExpenses.length > 0" class="space-y-3">
        <div
          *ngFor="let expense of filteredExpenses"
          class="glass-card p-5 hover:bg-white/40 transition-all duration-300">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <!-- Category Badge -->
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  [ngClass]="getCategoryColorClass(expense.category)">
                  <span>{{ getCategoryIcon(expense.category) }}</span>
                  <span>{{ expense.category === 'OTHER' && expense.otherCategoryName ? expense.otherCategoryName : getCategoryLabel(expense.category) }}</span>
                </span>

                <!-- Payment Method -->
                <span class="text-xs text-gray-600">
                  {{ getPaymentMethodIcon(expense.paymentMethod) }}
                  {{ getPaymentMethodLabel(expense.paymentMethod) }}
                </span>

                <!-- Date -->
                <span class="text-xs text-gray-500">
                  {{ expense.date | date:'dd MMM yyyy' }}
                </span>
              </div>

              <!-- Description -->
              <p *ngIf="expense.description" class="text-sm text-gray-700 mb-2">
                {{ expense.description }}
              </p>

              <!-- Amount -->
              <div class="text-xl font-light text-gray-900">
                ₹{{ expense.amount | number:'1.2-2' }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 ml-4">
              <button
                (click)="editExpense(expense.id!)"
                class="glass-button px-3 py-1.5 text-sm hover:bg-indigo-100/20">
                Edit
              </button>
              <button
                (click)="deleteExpense(expense.id!)"
                class="glass-button px-3 py-1.5 text-sm hover:bg-red-100/20 text-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        *ngIf="!loading && filteredExpenses.length === 0"
        class="glass-card p-12 text-center">
        <p class="text-gray-600 text-lg mb-4">No expenses found</p>
        <p class="text-gray-500 text-sm mb-6">
          {{ expenses.length === 0 ? 'Start by adding your first expense' : 'Try adjusting your filters' }}
        </p>
        <a
          *ngIf="expenses.length === 0"
          routerLink="/expenses/new"
          class="glass-button-primary px-6 py-2.5 text-sm font-medium inline-block">
          Add Your First Expense
        </a>
      </div>
    </div>
  `,
  styles: [`
    .category-food { @apply bg-orange-100/60 text-orange-700 border border-orange-200/50; }
    .category-groceries { @apply bg-green-100/60 text-green-700 border border-green-200/50; }
    .category-entertainment { @apply bg-purple-100/60 text-purple-700 border border-purple-200/50; }
    .category-health { @apply bg-red-100/60 text-red-700 border border-red-200/50; }
    .category-utilities { @apply bg-blue-100/60 text-blue-700 border border-blue-200/50; }
    .category-shopping { @apply bg-pink-100/60 text-pink-700 border border-pink-200/50; }
    .category-education { @apply bg-indigo-100/60 text-indigo-700 border border-indigo-200/50; }
    .category-other { @apply bg-gray-100/60 text-gray-700 border border-gray-200/50; }
  `]
})
export class ExpenseComponent implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  loading = false;
  error: string | null = null;
  searchKeyword = '';

  categories = EXPENSE_CATEGORIES;
  paymentMethods = PAYMENT_METHODS;

  filters = {
    startDate: '',
    endDate: '',
    category: null as ExpenseCategory | null,
    paymentMethod: null as PaymentMethod | null
  };

  constructor(
    private expenseService: ExpenseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setDefaultDates();
    this.loadExpenses();
  }

  setDefaultDates(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.filters.startDate = firstDayOfMonth.toISOString().split('T')[0];
    this.filters.endDate = today.toISOString().split('T')[0];
  }

  loadExpenses(): void {
    this.loading = true;
    this.error = null;

    this.expenseService.getAllExpenses().subscribe({
      next: (data) => {
        this.expenses = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load expenses. Please try again.';
        this.loading = false;
        console.error('Error loading expenses:', err);
      }
    });
  }

  applyFilters(): void {
    this.filteredExpenses = this.expenses.filter(expense => {
      // Date range filter
      if (this.filters.startDate && expense.date < this.filters.startDate) {
        return false;
      }
      if (this.filters.endDate && expense.date > this.filters.endDate) {
        return false;
      }

      // Category filter
      if (this.filters.category && expense.category !== this.filters.category) {
        return false;
      }

      // Payment method filter
      if (this.filters.paymentMethod && expense.paymentMethod !== this.filters.paymentMethod) {
        return false;
      }

      // Search filter
      if (this.searchKeyword && expense.description) {
        return expense.description.toLowerCase().includes(this.searchKeyword.toLowerCase());
      }

      return true;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {
      startDate: '',
      endDate: '',
      category: null,
      paymentMethod: null
    };
    this.searchKeyword = '';
    this.setDefaultDates();
    this.applyFilters();
  }

  calculateTotal(): number {
    return this.filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  getCategoryConfig(category: ExpenseCategory) {
    return getCategoryConfig(category);
  }

  getCategoryLabel(category: ExpenseCategory): string {
    return this.getCategoryConfig(category).label;
  }

  getCategoryIcon(category: ExpenseCategory): string {
    return this.getCategoryConfig(category).icon;
  }

  getCategoryColorClass(category: ExpenseCategory): string {
    return `category-${this.getCategoryConfig(category).color}`;
  }

  getPaymentMethodConfig(method: PaymentMethod) {
    return getPaymentMethodConfig(method);
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    return this.getPaymentMethodConfig(method).label;
  }

  getPaymentMethodIcon(method: PaymentMethod): string {
    return this.getPaymentMethodConfig(method).icon;
  }

  editExpense(id: string): void {
    this.router.navigate(['/expenses/edit', id]);
  }

  deleteExpense(id: string): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => {
          this.expenses = this.expenses.filter(e => e.id !== id);
          this.applyFilters();
        },
        error: (err) => {
          this.error = 'Failed to delete expense. Please try again.';
          console.error('Error deleting expense:', err);
        }
      });
    }
  }
}
