import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TravelRecord, TravelSummary } from '../models/travel-record.model';
import { environment } from '../../../environments/environment';

/**
 * Service for managing travel records
 */
@Injectable({
  providedIn: 'root'
})
export class TravelService {
  private apiUrl = `${environment.apiUrl}/travel`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new travel record
   */
  createTravelRecord(record: TravelRecord): Observable<TravelRecord> {
    return this.http.post<TravelRecord>(this.apiUrl, record);
  }

  /**
   * Get all travel records (without pagination)
   */
  getAllTravelRecords(): Observable<TravelRecord[]> {
    return this.http.get<TravelRecord[]>(`${this.apiUrl}/all`);
  }

  /**
   * Get all travel records with pagination
   */
  getTravelRecordsPaginated(page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'date,desc');
    
    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * Get a travel record by ID
   */
  getTravelRecordById(id: string): Observable<TravelRecord> {
    return this.http.get<TravelRecord>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get travel records for a specific date
   */
  getTravelRecordsByDate(date: string): Observable<TravelRecord[]> {
    return this.http.get<TravelRecord[]>(`${this.apiUrl}/date/${date}`);
  }

  /**
   * Get travel records for a date range
   */
  getTravelRecordsByDateRange(startDate: string, endDate: string): Observable<TravelRecord[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<TravelRecord[]>(`${this.apiUrl}/range`, { params });
  }

  /**
   * Update a travel record
   */
  updateTravelRecord(id: string, record: TravelRecord): Observable<TravelRecord> {
    return this.http.put<TravelRecord>(`${this.apiUrl}/${id}`, record);
  }

  /**
   * Delete a travel record
   */
  deleteTravelRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get travel summary for a date range
   */
  getTravelSummary(startDate: string, endDate: string): Observable<TravelSummary> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<TravelSummary>(`${this.apiUrl}/summary`, { params });
  }
}
