/**
 * Enum representing time of day for travel records
 */
export enum TimeOfDay {
  MORNING = 'MORNING',
  EVENING = 'EVENING'
}

/**
 * Interface for Travel Record
 */
export interface TravelRecord {
  id?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  timeOfDay: TimeOfDay;
  cost: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Interface for Travel Summary
 */
export interface TravelSummary {
  startDate: string;
  endDate: string;
  totalCost: number;
  totalCount: number;
  morningCount: number;
  eveningCount: number;
  morningTotal: number;
  eveningTotal: number;
}
