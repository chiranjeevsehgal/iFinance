export interface FinancialSummary {
  startDate: string;
  endDate: string;
  totalTravel: number;
  totalExpenses: number;
  totalInvestments: number;
  grandTotal: number;
  travelCount: number;
  expenseCount: number;
  investmentCount: number;
  totalTransactions: number;
}

export interface RecentTransaction {
  type: 'TRAVEL' | 'EXPENSE' | 'INVESTMENT';
  date: string;
  amount: number;
  description: string;
  id: string;
  category?: string;
}

export interface RecentTransactionsResponse {
  transactions: RecentTransaction[];
}

export type PeriodType = 'daily' | 'weekly' | 'monthly';
