import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Expense, ExpenseSummary, ExpenseCategory, PaymentMethod } from '../models/expense.model';

/**
 * Service for managing expenses
 */
@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) { }

  /**
   * Create a new expense
   */
  createExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  /**
   * Get all expenses without pagination
   */
  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/all`);
  }

  /**
   * Get expense by ID
   */
  getExpenseById(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update expense
   */
  updateExpense(id: string, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, expense);
  }

  /**
   * Delete expense
   */
  deleteExpense(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get expenses by category
   */
  getExpensesByCategory(category: ExpenseCategory): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/category/${category}`);
  }

  /**
   * Get expenses by payment method
   */
  getExpensesByPaymentMethod(paymentMethod: PaymentMethod): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/payment-method/${paymentMethod}`);
  }

  /**
   * Get expenses by date
   */
  getExpensesByDate(date: string): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/date/${date}`);
  }

  /**
   * Get expenses by date range with optional filters
   */
  getExpensesByDateRange(
    startDate: string,
    endDate: string,
    category?: ExpenseCategory,
    paymentMethod?: PaymentMethod
  ): Observable<Expense[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    if (category) {
      params = params.set('category', category);
    }
    if (paymentMethod) {
      params = params.set('paymentMethod', paymentMethod);
    }

    return this.http.get<Expense[]>(`${this.apiUrl}/date-range`, { params });
  }

  /**
   * Search expenses by description
   */
  searchExpenses(keyword: string): Observable<Expense[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Expense[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Get expense summary
   */
  getExpenseSummary(startDate: string, endDate: string): Observable<ExpenseSummary> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<ExpenseSummary>(`${this.apiUrl}/summary`, { params });
  }
}
