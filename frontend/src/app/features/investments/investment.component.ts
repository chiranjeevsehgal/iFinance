import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InvestmentService } from '../../core/services/investment.service';
import {
  Investment,
  InvestmentCategory,
  INVESTMENT_CATEGORY_CONFIG
} from '../../core/models/investment.model';

/**
 * Component for listing and managing investments
 */
@Component({
  selector: 'app-investment',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-light text-gray-900">Investments & Savings</h1>
        <a
          routerLink="/investments/new"
          class="glass-button-primary px-6 py-2.5 text-sm font-medium">
          + Add Investment
        </a>
      </div>

      <!-- Filters -->
      <div class="glass-card p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <span class="text-lg font-light text-gray-700">Total Amount:</span>
          <span class="text-2xl font-light text-gray-900">₹{{ calculateTotal() | number:'1.2-2' }}</span>
        </div>
        <div class="text-sm text-gray-600 mt-1">
          {{ filteredInvestments.length }} investment(s)
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-4 text-gray-600">Loading investments...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="glass-card bg-red-50/30 border-red-200/50 p-4 mb-6">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Investment List -->
      <div *ngIf="!loading && filteredInvestments.length > 0" class="space-y-3">
        <div
          *ngFor="let investment of filteredInvestments"
          class="glass-card p-5 hover:bg-white/40 transition-all duration-300">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <!-- Category Badge -->
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  [ngClass]="getCategoryColorClass(investment.category)">
                  <span>{{ getCategoryIcon(investment.category) }}</span>
                  <span>{{ investment.category === 'OTHER' && investment.otherCategoryName ? investment.otherCategoryName : getCategoryLabel(investment.category) }}</span>
                </span>

                <!-- Date -->
                <span class="text-xs text-gray-500">
                  {{ investment.date | date:'dd MMM yyyy' }}
                </span>
              </div>

              <!-- Description -->
              <p *ngIf="investment.description" class="text-sm text-gray-700 mb-2">
                {{ investment.description }}
              </p>

              <!-- Amount -->
              <div class="text-xl font-light text-gray-900">
                ₹{{ investment.amount | number:'1.2-2' }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 ml-4">
              <button
                (click)="editInvestment(investment.id!)"
                class="glass-button px-3 py-1.5 text-sm hover:bg-indigo-100/20">
                Edit
              </button>
              <button
                (click)="deleteInvestment(investment.id!)"
                class="glass-button px-3 py-1.5 text-sm hover:bg-red-100/20 text-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        *ngIf="!loading && filteredInvestments.length === 0"
        class="glass-card p-12 text-center">
        <p class="text-gray-600 text-lg mb-4">No investments found</p>
        <p class="text-gray-500 text-sm mb-6">
          {{ investments.length === 0 ? 'Start by adding your first investment or savings record' : 'Try adjusting your filters' }}
        </p>
        <a
          *ngIf="investments.length === 0"
          routerLink="/investments/new"
          class="glass-button-primary px-6 py-2.5 text-sm font-medium inline-block">
          Add Your First Investment
        </a>
      </div>
    </div>
  `,
  styles: [`
    .category-stocks { @apply bg-green-100/60 text-green-700 border border-green-200/50; }
    .category-mutual_funds { @apply bg-blue-100/60 text-blue-700 border border-blue-200/50; }
    .category-fixed_deposit { @apply bg-indigo-100/60 text-indigo-700 border border-indigo-200/50; }
    .category-savings_account { @apply bg-yellow-100/60 text-yellow-700 border border-yellow-200/50; }
    .category-gold { @apply bg-amber-100/60 text-amber-700 border border-amber-200/50; }
    .category-real_estate { @apply bg-purple-100/60 text-purple-700 border border-purple-200/50; }
    .category-crypto { @apply bg-orange-100/60 text-orange-700 border border-orange-200/50; }
    .category-other { @apply bg-gray-100/60 text-gray-700 border border-gray-200/50; }
  `]
})
export class InvestmentComponent implements OnInit {
  investments: Investment[] = [];
  filteredInvestments: Investment[] = [];
  loading = false;
  error: string | null = null;
  searchKeyword = '';

  categories = Object.entries(INVESTMENT_CATEGORY_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
    icon: config.icon
  }));

  filters = {
    startDate: '',
    endDate: '',
    category: null as InvestmentCategory | null
  };

  constructor(
    private investmentService: InvestmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setDefaultDates();
    this.loadInvestments();
  }

  setDefaultDates(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.filters.startDate = firstDayOfMonth.toISOString().split('T')[0];
    this.filters.endDate = today.toISOString().split('T')[0];
  }

  loadInvestments(): void {
    this.loading = true;
    this.error = null;

    this.investmentService.getAllInvestments().subscribe({
      next: (data) => {
        this.investments = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load investments. Please try again.';
        this.loading = false;
        console.error('Error loading investments:', err);
      }
    });
  }

  applyFilters(): void {
    this.filteredInvestments = this.investments.filter(investment => {
      // Date range filter
      if (this.filters.startDate && investment.date < this.filters.startDate) {
        return false;
      }
      if (this.filters.endDate && investment.date > this.filters.endDate) {
        return false;
      }

      // Category filter
      if (this.filters.category && investment.category !== this.filters.category) {
        return false;
      }

      // Search filter
      if (this.searchKeyword && investment.description) {
        return investment.description.toLowerCase().includes(this.searchKeyword.toLowerCase());
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
      category: null
    };
    this.searchKeyword = '';
    this.setDefaultDates();
    this.applyFilters();
  }

  calculateTotal(): number {
    return this.filteredInvestments.reduce((sum, investment) => sum + investment.amount, 0);
  }

  getCategoryConfig(category: InvestmentCategory) {
    return INVESTMENT_CATEGORY_CONFIG[category];
  }

  getCategoryLabel(category: InvestmentCategory): string {
    return this.getCategoryConfig(category).label;
  }

  getCategoryIcon(category: InvestmentCategory): string {
    return this.getCategoryConfig(category).icon;
  }

  getCategoryColorClass(category: InvestmentCategory): string {
    const categoryKey = category.toLowerCase();
    return `category-${categoryKey}`;
  }

  editInvestment(id: string): void {
    this.router.navigate(['/investments/edit', id]);
  }

  deleteInvestment(id: string): void {
    if (confirm('Are you sure you want to delete this investment?')) {
      this.investmentService.deleteInvestment(id).subscribe({
        next: () => {
          this.investments = this.investments.filter(i => i.id !== id);
          this.applyFilters();
        },
        error: (err) => {
          this.error = 'Failed to delete investment. Please try again.';
          console.error('Error deleting investment:', err);
        }
      });
    }
  }
}
