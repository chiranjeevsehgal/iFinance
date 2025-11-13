import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TravelService } from '../../core/services/travel.service';
import { TravelRecord, TimeOfDay } from '../../core/models/travel-record.model';

@Component({
  selector: 'app-travel-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen p-4">
      <div class="max-w-2xl mx-auto">
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
                {{ isEditMode ? 'Edit' : 'Add' }} Travel Record
              </h1>
              <p class="text-sm text-gray-600">
                {{ isEditMode ? 'Update' : 'Create a new' }} travel expense entry
              </p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="glass-card">
          <form [formGroup]="travelForm" (ngSubmit)="onSubmit()">
            <div class="space-y-6">
              <!-- Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date <span class="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  formControlName="date"
                  class="glass-input w-full"
                  [class.border-red-400]="isFieldInvalid('date')"
                />
                <p *ngIf="isFieldInvalid('date')" class="mt-1 text-sm text-red-600">
                  Date is required
                </p>
              </div>

              <!-- Time of Day -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Time of Day <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    (click)="selectTimeOfDay('MORNING')"
                    class="glass-button py-4 px-6 rounded-lg transition-all"
                    [class.bg-yellow-100/50]="travelForm.get('timeOfDay')?.value === 'MORNING'"
                    [class.border-2]="travelForm.get('timeOfDay')?.value === 'MORNING'"
                    [class.border-yellow-400]="travelForm.get('timeOfDay')?.value === 'MORNING'"
                  >
                    <div class="text-3xl mb-2">🌅</div>
                    <div class="font-medium">Morning</div>
                  </button>
                  <button
                    type="button"
                    (click)="selectTimeOfDay('EVENING')"
                    class="glass-button py-4 px-6 rounded-lg transition-all"
                    [class.bg-indigo-100/50]="travelForm.get('timeOfDay')?.value === 'EVENING'"
                    [class.border-2]="travelForm.get('timeOfDay')?.value === 'EVENING'"
                    [class.border-indigo-400]="travelForm.get('timeOfDay')?.value === 'EVENING'"
                  >
                    <div class="text-3xl mb-2">🌆</div>
                    <div class="font-medium">Evening</div>
                  </button>
                </div>
                <p *ngIf="isFieldInvalid('timeOfDay')" class="mt-1 text-sm text-red-600">
                  Time of day is required
                </p>
              </div>

              <!-- Cost -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cost (₹) <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">₹</span>
                  <input 
                    type="number" 
                    formControlName="cost"
                    step="1"
                    min="0"
                    placeholder="0.00"
                    class="glass-input w-full pl-8"
                    [class.border-red-400]="isFieldInvalid('cost')"
                  />
                </div>
                <p *ngIf="isFieldInvalid('cost')" class="mt-1 text-sm text-red-600">
                  <span *ngIf="travelForm.get('cost')?.errors?.['required']">Cost is required</span>
                  <span *ngIf="travelForm.get('cost')?.errors?.['min']">Cost must be 0 or greater</span>
                </p>
              </div>

              <!-- Submit Buttons -->
              <div class="flex gap-4 pt-4">
                <button 
                  type="submit"
                  [disabled]="submitting"
                  class="glass-button-primary flex-1 py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span *ngIf="!submitting">{{ isEditMode ? 'Update' : 'Create' }} Travel Record</span>
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
export class TravelFormComponent implements OnInit {
  travelForm!: FormGroup;
  isEditMode = false;
  recordId?: string;
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
    this.recordId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEditMode = !!this.recordId;

    if (this.isEditMode && this.recordId) {
      this.loadRecord(this.recordId);
    } else {
      // Set today's date as default
      const today = new Date().toISOString().split('T')[0];
      this.travelForm.patchValue({ date: today });
    }
  }

  initForm(): void {
    this.travelForm = this.fb.group({
      date: ['', Validators.required],
      timeOfDay: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(0)]]
    });
  }

  loadRecord(id: string): void {
    this.travelService.getTravelRecordById(id).subscribe({
      next: (record) => {
        this.travelForm.patchValue({
          date: record.date,
          timeOfDay: record.timeOfDay,
          cost: record.cost
        });
      },
      error: (error) => {
        console.error('Error loading travel record:', error);
        alert('Failed to load travel record');
        this.goBack();
      }
    });
  }

  selectTimeOfDay(timeOfDay: string): void {
    this.travelForm.patchValue({ timeOfDay });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.travelForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.travelForm.invalid) {
      Object.keys(this.travelForm.controls).forEach(key => {
        this.travelForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    const travelRecord: TravelRecord = this.travelForm.value;

    const saveObservable = this.isEditMode && this.recordId
      ? this.travelService.updateTravelRecord(this.recordId, travelRecord)
      : this.travelService.createTravelRecord(travelRecord);

    saveObservable.subscribe({
      next: () => {
        this.router.navigate(['/travel']);
      },
      error: (error) => {
        console.error('Error saving travel record:', error);
        alert('Failed to save travel record');
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/travel']);
  }
}
