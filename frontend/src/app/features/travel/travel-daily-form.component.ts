import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TravelService } from '../../core/services/travel.service';
import { TravelRecord, TimeOfDay } from '../../core/models/travel-record.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-travel-daily-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen p-4">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="glass-card mb-6">
          <div class="flex items-center gap-4">
            <button 
              (click)="goBack()"
              class="glass-button px-4 py-2 rounded-lg"
            >
              ← Back
            </button>
            <div>
              <h1 class="text-2xl font-light text-gray-900">
                Edit Daily Travel Records
              </h1>
              <p class="text-sm text-gray-600">
                Update morning and evening travel expenses for {{ formatDate(selectedDate) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="glass-card">
          <form [formGroup]="dailyForm" (ngSubmit)="onSubmit()">
            <div class="space-y-8">
              <!-- Date (Read-only) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input 
                  type="date" 
                  [value]="selectedDate"
                  disabled
                  class="glass-input w-full bg-gray-100/30 cursor-not-allowed"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Morning Record -->
                <div class="glass-card bg-yellow-50/30 border-2 border-yellow-200/50">
                  <div class="flex items-center gap-2 mb-4">
                    <span class="text-2xl">🌅</span>
                    <h3 class="text-lg font-medium text-gray-900">Morning Travel</h3>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Cost (₹)
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">₹</span>
                      <input 
                        type="number" 
                        formControlName="morningCost"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        class="glass-input w-full pl-8"
                        [class.border-red-400]="isFieldInvalid('morningCost')"
                      />
                    </div>
                    <p *ngIf="isFieldInvalid('morningCost')" class="mt-1 text-sm text-red-600">
                      <span *ngIf="dailyForm.get('morningCost')?.errors?.['min']">Cost must be 0 or greater</span>
                    </p>
                    <p class="mt-2 text-xs text-gray-600">
                      Leave as 0 if no morning travel
                    </p>
                  </div>
                </div>

                <!-- Evening Record -->
                <div class="glass-card bg-indigo-50/30 border-2 border-indigo-200/50">
                  <div class="flex items-center gap-2 mb-4">
                    <span class="text-2xl">🌆</span>
                    <h3 class="text-lg font-medium text-gray-900">Evening Travel</h3>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Cost (₹)
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">₹</span>
                      <input 
                        type="number" 
                        formControlName="eveningCost"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        class="glass-input w-full pl-8"
                        [class.border-red-400]="isFieldInvalid('eveningCost')"
                      />
                    </div>
                    <p *ngIf="isFieldInvalid('eveningCost')" class="mt-1 text-sm text-red-600">
                      <span *ngIf="dailyForm.get('eveningCost')?.errors?.['min']">Cost must be 0 or greater</span>
                    </p>
                    <p class="mt-2 text-xs text-gray-600">
                      Leave as 0 if no evening travel
                    </p>
                  </div>
                </div>
              </div>

              <!-- Daily Total -->
              <div class="glass-card bg-purple-50/30 border-2 border-purple-200/50">
                <div class="flex items-center justify-between">
                  <span class="text-lg font-medium text-gray-900">Daily Total</span>
                  <span class="text-2xl font-bold text-indigo-700">
                    ₹{{ calculateDailyTotal().toFixed(2) }}
                  </span>
                </div>
              </div>

              <!-- Submit Buttons -->
              <div class="flex gap-4 pt-4">
                <button 
                  type="submit"
                  [disabled]="submitting || !hasChanges()"
                  class="glass-button-primary flex-1 py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span *ngIf="!submitting">Save Changes</span>
                  <span *ngIf="submitting">Saving...</span>
                </button>
                <button 
                  type="button"
                  (click)="goBack()"
                  [disabled]="submitting"
                  class="glass-button px-6 py-3 rounded-lg font-medium disabled:opacity-50"
                >
                  Cancel
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
export class TravelDailyFormComponent implements OnInit {
  dailyForm!: FormGroup;
  selectedDate = '';
  morningRecordId?: string;
  eveningRecordId?: string;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private travelService: TravelService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedDate = params['date'] || '';
      this.morningRecordId = params['morningId'] || undefined;
      this.eveningRecordId = params['eveningId'] || undefined;

      // Set initial values
      const morningCost = params['morningCost'] ? parseFloat(params['morningCost']) : 0;
      const eveningCost = params['eveningCost'] ? parseFloat(params['eveningCost']) : 0;

      this.dailyForm.patchValue({
        morningCost: morningCost,
        eveningCost: eveningCost
      });
    });
  }

  initForm(): void {
    this.dailyForm = this.fb.group({
      morningCost: [0, [Validators.min(0)]],
      eveningCost: [0, [Validators.min(0)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.dailyForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  calculateDailyTotal(): number {
    const morning = this.dailyForm.get('morningCost')?.value || 0;
    const evening = this.dailyForm.get('eveningCost')?.value || 0;
    return morning + evening;
  }

  hasChanges(): boolean {
    return this.dailyForm.dirty;
  }

  onSubmit(): void {
    if (this.dailyForm.invalid) {
      Object.keys(this.dailyForm.controls).forEach(key => {
        this.dailyForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    const morningCost = this.dailyForm.get('morningCost')?.value || 0;
    const eveningCost = this.dailyForm.get('eveningCost')?.value || 0;

    const requests = [];

    // Handle Morning Record
    if (morningCost > 0) {
      const morningRecord: TravelRecord = {
        date: this.selectedDate,
        timeOfDay: TimeOfDay.MORNING,
        cost: morningCost
      };

      if (this.morningRecordId) {
        // Update existing morning record
        requests.push(this.travelService.updateTravelRecord(this.morningRecordId, morningRecord));
      } else {
        // Create new morning record
        requests.push(this.travelService.createTravelRecord(morningRecord));
      }
    } else if (this.morningRecordId && morningCost === 0) {
      // Delete morning record if cost is 0
      requests.push(this.travelService.deleteTravelRecord(this.morningRecordId));
    }

    // Handle Evening Record
    if (eveningCost > 0) {
      const eveningRecord: TravelRecord = {
        date: this.selectedDate,
        timeOfDay: TimeOfDay.EVENING,
        cost: eveningCost
      };

      if (this.eveningRecordId) {
        // Update existing evening record
        requests.push(this.travelService.updateTravelRecord(this.eveningRecordId, eveningRecord));
      } else {
        // Create new evening record
        requests.push(this.travelService.createTravelRecord(eveningRecord));
      }
    } else if (this.eveningRecordId && eveningCost === 0) {
      // Delete evening record if cost is 0
      requests.push(this.travelService.deleteTravelRecord(this.eveningRecordId));
    }

    if (requests.length === 0) {
      // No changes to save
      this.goBack();
      return;
    }

    forkJoin(requests).subscribe({
      next: () => {
        this.router.navigate(['/travel']);
      },
      error: (error) => {
        console.error('Error saving travel records:', error);
        alert('Failed to save travel records');
        this.submitting = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  goBack(): void {
    this.router.navigate(['/travel']);
  }
}
