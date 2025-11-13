import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FinancialSummary, RecentTransactionsResponse } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  /**
   * Get daily summary (today)
   */
  getDailySummary(): Observable<FinancialSummary> {
    return this.http.get<FinancialSummary>(`${this.apiUrl}/daily`);
  }

  /**
   * Get weekly summary (Monday to Sunday)
   */
  getWeeklySummary(): Observable<FinancialSummary> {
    return this.http.get<FinancialSummary>(`${this.apiUrl}/weekly`);
  }

  /**
   * Get monthly summary (current month)
   */
  getMonthlySummary(): Observable<FinancialSummary> {
    return this.http.get<FinancialSummary>(`${this.apiUrl}/monthly`);
  }

  /**
   * Get custom date range summary
   */
  getCustomSummary(startDate: string, endDate: string): Observable<FinancialSummary> {
    return this.http.get<FinancialSummary>(`${this.apiUrl}/custom`, {
      params: { startDate, endDate }
    });
  }

  /**
   * Get recent transactions (last 5)
   */
  getRecentTransactions(): Observable<RecentTransactionsResponse> {
    return this.http.get<RecentTransactionsResponse>(`${this.apiUrl}/recent-transactions`);
  }
}
