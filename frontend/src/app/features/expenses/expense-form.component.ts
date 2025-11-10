import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpenseService } from '../../core/services/expense.service';
import {
  Expense,
  ExpenseCategory,
  PaymentMethod,
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS
} from '../../core/models/expense.model';

/**
 * Component for creating and editing expenses
 */
@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-light text-gray-900">
          {{ isEditMode ? 'Edit Expense' : 'Add New Expense' }}
        </h1>
        <p class="text-gray-600 mt-2">{{ isEditMode ? 'Update expense details' : 'Enter expense details below' }}</p>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="glass-card bg-red-50/30 border-red-200/50 p-4 mb-6">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Form -->
      <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()" class="glass-card p-6 space-y-6">
        <!-- Date -->
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
            Date <span class="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            formControlName="date"
            class="glass-input w-full px-4 py-2.5"
            [class.border-red-300]="isFieldInvalid('date')" />
          <p *ngIf="isFieldInvalid('date')" class="mt-1 text-sm text-red-600">
            Date is required
          </p>
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Category <span class="text-red-500">*</span>
          </label>
          <select
            id="category"
            formControlName="category"
            class="glass-input w-full px-4 py-2.5"
            [class.border-red-300]="isFieldInvalid('category')">
            <option value="">Select category</option>
            <option *ngFor="let cat of categories" [value]="cat.value">
              {{ cat.icon }} {{ cat.label }}
            </option>
          </select>
          <p *ngIf="isFieldInvalid('category')" class="mt-1 text-sm text-red-600">
            Category is required
          </p>
        </div>

        <!-- Other Category Name (shown only when category is OTHER) -->
        <div *ngIf="expenseForm.get('category')?.value === 'OTHER'">
          <label for="otherCategoryName" class="block text-sm font-medium text-gray-700 mb-2">
            Category Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="otherCategoryName"
            formControlName="otherCategoryName"
            placeholder="e.g., Gifts, Donations, etc."
            class="glass-input w-full px-4 py-2.5"
            [class.border-red-300]="isFieldInvalid('otherCategoryName')" />
          <p *ngIf="isFieldInvalid('otherCategoryName')" class="mt-1 text-sm text-red-600">
            Category name is required when selecting Other
          </p>
        </div>

        <!-- Amount -->
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700 mb-2">
            Amount (₹) <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="amount"
            formControlName="amount"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            class="glass-input w-full px-4 py-2.5"
            [class.border-red-300]="isFieldInvalid('amount')" />
          <p *ngIf="isFieldInvalid('amount')" class="mt-1 text-sm text-red-600">
            <span *ngIf="expenseForm.get('amount')?.hasError('required')">Amount is required</span>
            <span *ngIf="expenseForm.get('amount')?.hasError('min')">Amount must be greater than 0</span>
          </p>
        </div>

        <!-- Payment Method -->
        <div>
          <label for="paymentMethod" class="block text-sm font-medium text-gray-700 mb-2">
            Payment Method <span class="text-red-500">*</span>
          </label>
          <select
            id="paymentMethod"
            formControlName="paymentMethod"
            class="glass-input w-full px-4 py-2.5"
            [class.border-red-300]="isFieldInvalid('paymentMethod')">
            <option value="">Select payment method</option>
            <option *ngFor="let method of paymentMethods" [value]="method.value">
              {{ method.icon }} {{ method.label }}
            </option>
          </select>
          <p *ngIf="isFieldInvalid('paymentMethod')" class="mt-1 text-sm text-red-600">
            Payment method is required
          </p>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            formControlName="description"
            rows="3"
            placeholder="Add notes about this expense (optional)"
            class="glass-input w-full px-4 py-2.5 resize-none"></textarea>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            [disabled]="submitting"
            class="glass-button-primary flex-1 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="!submitting">{{ isEditMode ? 'Update Expense' : 'Add Expense' }}</span>
            <span *ngIf="submitting">{{ isEditMode ? 'Updating...' : 'Adding...' }}</span>
          </button>
          <button
            type="button"
            (click)="onCancel()"
            [disabled]="submitting"
            class="glass-button px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class ExpenseFormComponent implements OnInit {
  expenseForm!: FormGroup;
  isEditMode = false;
  expenseId: string | null = null;
  submitting = false;
  error: string | null = null;

  categories = EXPENSE_CATEGORIES;
  paymentMethods = PAYMENT_METHODS;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.expenseForm = this.fb.group({
      date: [today, Validators.required],
      category: ['', Validators.required],
      otherCategoryName: [''],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      paymentMethod: ['', Validators.required],
      description: ['']
    });

    // Add conditional validation for otherCategoryName
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
  }

  checkEditMode(): void {
    this.expenseId = this.route.snapshot.paramMap.get('id');
    if (this.expenseId) {
      this.isEditMode = true;
      this.loadExpense();
    }
  }

  loadExpense(): void {
    if (!this.expenseId) return;

    this.expenseService.getExpenseById(this.expenseId).subscribe({
      next: (expense: Expense) => {
        this.expenseForm.patchValue({
          date: expense.date,
          category: expense.category,
          otherCategoryName: expense.otherCategoryName || '',
          amount: expense.amount,
          paymentMethod: expense.paymentMethod,
          description: expense.description || ''
        });
      },
      error: (err: any) => {
        this.error = 'Failed to load expense. Please try again.';
        console.error('Error loading expense:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.expenseForm.invalid) {
      this.markFormGroupTouched(this.expenseForm);
      return;
    }

    this.submitting = true;
    this.error = null;

    const expenseData: Expense = this.expenseForm.value;

    const operation = this.isEditMode
      ? this.expenseService.updateExpense(this.expenseId!, expenseData)
      : this.expenseService.createExpense(expenseData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/expenses']);
      },
      error: (err: any) => {
        this.error = `Failed to ${this.isEditMode ? 'update' : 'create'} expense. Please try again.`;
        this.submitting = false;
        console.error('Error saving expense:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/expenses']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.expenseForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
