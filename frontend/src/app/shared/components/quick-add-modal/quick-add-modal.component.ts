import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TravelService } from '../../../core/services/travel.service';
import { ExpenseService } from '../../../core/services/expense.service';
import { InvestmentService } from '../../../core/services/investment.service';
import { TimeOfDay } from '../../../core/models/travel-record.model';
import { EXPENSE_CATEGORIES } from '../../../core/models/expense.model';
import { INVESTMENT_CATEGORY_CONFIG } from '../../../core/models/investment.model';

@Component({
  selector: 'app-quick-add-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Quick Entry Modal -->
    <div *ngIf="isOpen" class="fixed inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
         (click)="onBackdropClick()">
      <div class="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-light text-gray-900">Quick Add Entry</h3>
          <button (click)="close()" class="text-gray-400 hover:text-gray-600 text-3xl leading-none transition-colors">&times;</button>
        </div>

        <!-- Entry Type Selector -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">Entry Type</label>
          <div class="grid grid-cols-3 gap-3">
            <button
              type="button"
              (click)="setEntryType('travel')"
              [class]="selectedEntryType === 'travel'
                ? 'glass-button-primary px-4 py-3 rounded-lg text-sm font-medium text-white transition-all'
                : 'glass-button px-4 py-3 rounded-lg text-sm font-medium text-gray-900 transition-all'"
            >
              🚗 Travel
            </button>
            <button
              type="button"
              (click)="setEntryType('expense')"
              [class]="selectedEntryType === 'expense'
                ? 'glass-button-primary px-4 py-3 rounded-lg text-sm font-medium text-white transition-all'
                : 'glass-button px-4 py-3 rounded-lg text-sm font-medium text-gray-900 transition-all'"
            >
              💰 Expense
            </button>
            <button
              type="button"
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
          <div class="space-y-6">
            <!-- Info message when editing existing records -->
            <div *ngIf="existingTravelRecords.morning || existingTravelRecords.evening" 
                 class="bg-blue-50/50 backdrop-blur-sm border border-blue-200/50 rounded-lg p-3">
              <p class="text-sm text-blue-700">
                ℹ️ Existing travel records found for this date. Edit and save to update.
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" formControlName="date" 
                     class="glass-input w-full">
            </div>

            <!-- Morning Entry -->
            <div class="bg-white/30 backdrop-blur-sm border-2 border-gray-300/60 rounded-lg p-4">
              <div class="flex items-center mb-3">
                <input type="checkbox" formControlName="includeMorning" 
                       class="w-5 h-5 rounded border-2 border-gray-400 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer">
                <label class="ml-2 text-sm font-medium text-gray-700 cursor-pointer">☀️ Morning Travel</label>
              </div>
              <div *ngIf="travelForm.get('includeMorning')?.value">
                <input type="number" formControlName="morningCost" placeholder="Morning cost"
                       class="glass-input w-full">
              </div>
            </div>

            <!-- Evening Entry -->
            <div class="bg-white/30 backdrop-blur-sm border-2 border-gray-300/60 rounded-lg p-4">
              <div class="flex items-center mb-3">
                <input type="checkbox" formControlName="includeEvening" 
                       class="w-5 h-5 rounded border-2 border-gray-400 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer">
                <label class="ml-2 text-sm font-medium text-gray-700 cursor-pointer">🌙 Evening Travel</label>
              </div>
              <div *ngIf="travelForm.get('includeEvening')?.value">
                <input type="number" formControlName="eveningCost" placeholder="Evening cost"
                       class="glass-input w-full">
              </div>
            </div>

            <div class="flex gap-4 pt-4">
              <button 
                type="submit"
                [disabled]="isSubmitting"
                class="glass-button-primary flex-1 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isSubmitting">Save Travel</span>
                <span *ngIf="isSubmitting">Saving...</span>
              </button>
              <button 
                type="button"
                (click)="close()"
                [disabled]="isSubmitting"
                class="glass-button py-3 px-6 rounded-lg font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

        <!-- Expense Form -->
        <form *ngIf="selectedEntryType === 'expense'" [formGroup]="expenseForm" (ngSubmit)="submitExpenseEntry()">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" formControlName="date"
                     class="glass-input w-full">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select formControlName="category"
                      class="glass-input w-full">
                <option value="">Select category</option>
                <option *ngFor="let cat of expenseCategories" [value]="cat.value">
                  {{ cat.icon }} {{ cat.label }}
                </option>
              </select>
            </div>

            <div *ngIf="expenseForm.get('category')?.value === 'OTHER'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Other Category Name</label>
              <input type="text" formControlName="otherCategoryName" placeholder="Enter category name"
                     class="glass-input w-full">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
              <input type="number" formControlName="amount" placeholder="0.00"
                     class="glass-input w-full">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select formControlName="paymentMethod"
                      class="glass-input w-full">
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
                        class="glass-input w-full resize-none"></textarea>
            </div>

            <div class="flex gap-4 pt-4">
              <button 
                type="submit"
                [disabled]="isSubmitting"
                class="glass-button-primary flex-1 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isSubmitting">Save Expense</span>
                <span *ngIf="isSubmitting">Saving...</span>
              </button>
              <button 
                type="button"
                (click)="close()"
                [disabled]="isSubmitting"
                class="glass-button py-3 px-6 rounded-lg font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

        <!-- Investment Form -->
        <form *ngIf="selectedEntryType === 'investment'" [formGroup]="investmentForm" (ngSubmit)="submitInvestmentEntry()">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" formControlName="date"
                     class="glass-input w-full">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select formControlName="category"
                      class="glass-input w-full">
                <option value="">Select category</option>
                <option *ngFor="let cat of investmentCategories" [value]="cat.value">
                  {{ cat.icon }} {{ cat.label }}
                </option>
              </select>
            </div>

            <div *ngIf="investmentForm.get('category')?.value === 'OTHER'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Other Category Name</label>
              <input type="text" formControlName="otherCategoryName" placeholder="Enter category name"
                     class="glass-input w-full">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
              <input type="number" formControlName="amount" placeholder="0.00"
                     class="glass-input w-full">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea formControlName="description" rows="3" placeholder="Enter description"
                        class="glass-input w-full resize-none"></textarea>
            </div>

            <div class="flex gap-4 pt-4">
              <button 
                type="submit"
                [disabled]="isSubmitting"
                class="glass-button-primary flex-1 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isSubmitting">Save Investment</span>
                <span *ngIf="isSubmitting">Saving...</span>
              </button>
              <button 
                type="button"
                (click)="close()"
                [disabled]="isSubmitting"
                class="glass-button py-3 px-6 rounded-lg font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class QuickAddModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() entrySaved = new EventEmitter<void>();

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
    private fb: FormBuilder,
    private travelService: TravelService,
    private expenseService: ExpenseService,
    private investmentService: InvestmentService
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
      if (date && this.isOpen && this.selectedEntryType === 'travel') {
        this.loadExistingTravelData(date);
      }
    });
  }

  ngOnInit(): void {
    // Initial load is now handled by ngOnChanges
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Load existing travel data when modal opens (isOpen changes from false to true)
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      if (this.selectedEntryType === 'travel') {
        const currentDate = this.travelForm.get('date')?.value || this.getTodayDate();
        this.loadExistingTravelData(currentDate);
      }
    }
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
        // Handle both empty array response and records found
        const morningRecord = records?.find(r => r.timeOfDay === 'MORNING');
        const eveningRecord = records?.find(r => r.timeOfDay === 'EVENING');

        // Store existing records for update (undefined if no records)
        this.existingTravelRecords = {
          morning: morningRecord,
          evening: eveningRecord
        };

        // If we have existing records, pre-populate the form
        if (morningRecord || eveningRecord) {
          this.travelForm.patchValue({
            includeMorning: !!morningRecord,
            morningCost: morningRecord?.cost || null,
            includeEvening: !!eveningRecord,
            eveningCost: eveningRecord?.cost || null
          }, { emitEvent: false });
        } else {
          // No existing records - reset to empty state for new entry
          this.travelForm.patchValue({
            includeMorning: false,
            morningCost: null,
            includeEvening: false,
            eveningCost: null
          }, { emitEvent: false });
        }
      },
      error: (error) => {
        // Error loading data (network issue, etc.) - treat as no existing records
        console.log('No existing travel data for date:', date, error);
        this.existingTravelRecords = {};
        // Reset to empty state for new entry
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

  onBackdropClick(): void {
    if (!this.isSubmitting) {
      this.close();
    }
  }

  close(): void {
    this.closeModal.emit();
    this.resetForms();
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
        this.entrySaved.emit();
        this.close();
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
        this.entrySaved.emit();
        this.close();
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
        this.entrySaved.emit();
        this.close();
      },
      error: (error) => {
        console.error('Error saving investment:', error);
        alert('Error saving investment. Please try again.');
        this.isSubmitting = false;
      }
    });
  }
}
