import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Investment, InvestmentSummary, InvestmentCategory } from '../models/investment.model';

/**
 * Service for managing investments and savings
 */
@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  private apiUrl = `${environment.apiUrl}/investments`;

  constructor(private http: HttpClient) { }

  /**
   * Create a new investment
   */
  createInvestment(investment: Investment): Observable<Investment> {
    return this.http.post<Investment>(this.apiUrl, investment);
  }

  /**
   * Get all investments without pagination
   */
  getAllInvestments(): Observable<Investment[]> {
    return this.http.get<Investment[]>(`${this.apiUrl}/all`);
  }

  /**
   * Get investment by ID
   */
  getInvestmentById(id: string): Observable<Investment> {
    return this.http.get<Investment>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update investment
   */
  updateInvestment(id: string, investment: Investment): Observable<Investment> {
    return this.http.put<Investment>(`${this.apiUrl}/${id}`, investment);
  }

  /**
   * Delete investment
   */
  deleteInvestment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get investments by category
   */
  getInvestmentsByCategory(category: InvestmentCategory): Observable<Investment[]> {
    return this.http.get<Investment[]>(`${this.apiUrl}/category/${category}`);
  }

  /**
   * Get investments by date
   */
  getInvestmentsByDate(date: string): Observable<Investment[]> {
    return this.http.get<Investment[]>(`${this.apiUrl}/date/${date}`);
  }

  /**
   * Get investments by date range with optional category filter
   */
  getInvestmentsByDateRange(
    startDate: string,
    endDate: string,
    category?: InvestmentCategory
  ): Observable<Investment[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<Investment[]>(`${this.apiUrl}/date-range`, { params });
  }

  /**
   * Search investments by description
   */
  searchInvestments(keyword: string): Observable<Investment[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Investment[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Get investment summary
   */
  getInvestmentSummary(startDate: string, endDate: string): Observable<InvestmentSummary> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<InvestmentSummary>(`${this.apiUrl}/summary`, { params });
  }
}
