import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TravelService } from '../../core/services/travel.service';
import { TravelRecord, TimeOfDay } from '../../core/models/travel-record.model';
import { FormsModule } from '@angular/forms';

interface DailyTravelRecord {
  date: string;
  morningRecord?: TravelRecord;
  eveningRecord?: TravelRecord;
  morningCost: number;
  eveningCost: number;
  dailyTotal: number;
}

@Component({
  selector: 'app-travel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="glass-card mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button 
              (click)="goBack()"
              class="glass-button px-4 py-2 rounded-lg"
            >
              ← Back
            </button>
            <div>
              <h1 class="text-2xl font-light text-gray-900">Travel Records 🚗</h1>
              <p class="text-sm text-gray-600">Track your daily commute expenses</p>
            </div>
          </div>
          <button 
            (click)="addNew()"
            class="glass-button-primary px-6 py-2.5 text-sm font-medium rounded-lg"
          >
            + Add Travel
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="glass-card p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input 
              type="date" 
              [(ngModel)]="filterStartDate"
              (change)="applyFilters()"
              class="glass-input w-full px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input 
              type="date" 
              [(ngModel)]="filterEndDate"
              (change)="applyFilters()"
              class="glass-input w-full px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Time of Day</label>
            <select 
              [(ngModel)]="filterTimeOfDay"
              (change)="applyFilters()"
              class="glass-input w-full px-4 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="MORNING">Morning</option>
              <option value="EVENING">Evening</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="glass-card p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-gray-600">Loading travel records...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && filteredRecords.length === 0" class="glass-card p-8 text-center">
        <div class="text-6xl mb-4">🚗</div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">No travel records yet</h3>
        <p class="text-gray-600 mb-4">Start tracking your daily commute expenses</p>
        <button 
          (click)="addNew()"
          class="glass-button-primary px-6 py-2.5 text-sm font-medium rounded-lg"
        >
          Add Your First Travel Record
        </button>
      </div>

      <!-- Records Table -->
      <div *ngIf="!loading && dailyRecords.length > 0" class="glass-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-white/20">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  🌅 Morning
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  🌆 Evening
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Daily Total
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/20">
              <tr *ngFor="let daily of dailyRecords" class="hover:bg-white/10 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ formatDate(daily.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                  <span *ngIf="daily.morningRecord" class="font-medium text-gray-900">
                    ₹{{ daily.morningCost.toFixed(2) }}
                  </span>
                  <span *ngIf="!daily.morningRecord" class="text-gray-400">
                    —
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                  <span *ngIf="daily.eveningRecord" class="font-medium text-gray-900">
                    ₹{{ daily.eveningCost.toFixed(2) }}
                  </span>
                  <span *ngIf="!daily.eveningRecord" class="text-gray-400">
                    —
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-indigo-700">
                  ₹{{ daily.dailyTotal.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-3">
                    <button 
                      (click)="editDailyRecord(daily)"
                      class="text-indigo-600 hover:text-indigo-900 font-medium"
                      title="Edit travel records for this day"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      (click)="deleteDailyRecord(daily)"
                      class="text-red-600 hover:text-red-900 font-medium"
                      title="Delete all records for this day"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary -->
        <div class="border-t border-white/20 bg-white/10 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              Total Days: <span class="font-medium text-gray-900">{{ dailyRecords.length }}</span>
              <span class="mx-2">•</span>
              Total Records: <span class="font-medium text-gray-900">{{ filteredRecords.length }}</span>
            </div>
            <div class="text-lg font-medium text-gray-900">
              Grand Total: <span class="text-indigo-600">₹{{ calculateTotal().toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TravelComponent implements OnInit {
  records: TravelRecord[] = [];
  filteredRecords: TravelRecord[] = [];
  dailyRecords: DailyTravelRecord[] = [];
  loading = false;

  filterStartDate = '';
  filterEndDate = '';
  filterTimeOfDay = '';

  constructor(
    private travelService: TravelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading = true;
    this.travelService.getAllTravelRecords().subscribe({
      next: (records) => {
        this.records = records;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading travel records:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredRecords = this.records.filter(record => {
      let matches = true;

      if (this.filterStartDate && record.date < this.filterStartDate) {
        matches = false;
      }

      if (this.filterEndDate && record.date > this.filterEndDate) {
        matches = false;
      }

      if (this.filterTimeOfDay && record.timeOfDay !== this.filterTimeOfDay) {
        matches = false;
      }

      return matches;
    });

    // Group by date
    this.groupRecordsByDate();
  }

  groupRecordsByDate(): void {
    const dateMap = new Map<string, DailyTravelRecord>();

    // Group records by date
    this.filteredRecords.forEach(record => {
      if (!dateMap.has(record.date)) {
        dateMap.set(record.date, {
          date: record.date,
          morningCost: 0,
          eveningCost: 0,
          dailyTotal: 0
        });
      }

      const dailyRecord = dateMap.get(record.date)!;
      
      if (record.timeOfDay === TimeOfDay.MORNING) {
        dailyRecord.morningRecord = record;
        dailyRecord.morningCost = record.cost;
      } else {
        dailyRecord.eveningRecord = record;
        dailyRecord.eveningCost = record.cost;
      }

      dailyRecord.dailyTotal = dailyRecord.morningCost + dailyRecord.eveningCost;
    });

    // Convert to array and sort by date (oldest first - ascending order)
    this.dailyRecords = Array.from(dateMap.values())
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  addNew(): void {
    this.router.navigate(['/travel/new']);
  }

  editRecord(record: TravelRecord): void {
    this.router.navigate(['/travel/edit', record.id]);
  }

  editDailyRecord(daily: DailyTravelRecord): void {
    // Navigate to edit form with the date
    // If both records exist, we'll edit both; if only one exists, we can add the other
    this.router.navigate(['/travel/edit-day'], { 
      queryParams: { 
        date: daily.date,
        morningId: daily.morningRecord?.id,
        eveningId: daily.eveningRecord?.id,
        morningCost: daily.morningRecord?.cost,
        eveningCost: daily.eveningRecord?.cost
      } 
    });
  }

  deleteRecord(record: TravelRecord): void {
    const timeOfDayLabel = record.timeOfDay === TimeOfDay.MORNING ? 'morning' : 'evening';
    if (confirm(`Are you sure you want to delete the ${timeOfDayLabel} record from ${this.formatDate(record.date)}?`)) {
      this.travelService.deleteTravelRecord(record.id!).subscribe({
        next: () => {
          this.loadRecords();
        },
        error: (error) => {
          console.error('Error deleting travel record:', error);
          alert('Failed to delete travel record');
        }
      });
    }
  }

  deleteDailyRecord(daily: DailyTravelRecord): void {
    const recordCount = (daily.morningRecord ? 1 : 0) + (daily.eveningRecord ? 1 : 0);
    const message = recordCount === 2 
      ? `Are you sure you want to delete both morning and evening records from ${this.formatDate(daily.date)}?`
      : `Are you sure you want to delete the ${daily.morningRecord ? 'morning' : 'evening'} record from ${this.formatDate(daily.date)}?`;
    
    if (confirm(message)) {
      const deleteRequests = [];
      
      if (daily.morningRecord) {
        deleteRequests.push(this.travelService.deleteTravelRecord(daily.morningRecord.id!));
      }
      
      if (daily.eveningRecord) {
        deleteRequests.push(this.travelService.deleteTravelRecord(daily.eveningRecord.id!));
      }

      // Use a simple counter to track completed deletions
      let completed = 0;
      const total = deleteRequests.length;

      deleteRequests.forEach(request => {
        request.subscribe({
          next: () => {
            completed++;
            if (completed === total) {
              this.loadRecords();
            }
          },
          error: (error) => {
            console.error('Error deleting travel record:', error);
            completed++;
            if (completed === total) {
              alert('Some records failed to delete');
              this.loadRecords();
            }
          }
        });
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  calculateTotal(): number {
    return this.filteredRecords.reduce((sum, record) => sum + record.cost, 0);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
