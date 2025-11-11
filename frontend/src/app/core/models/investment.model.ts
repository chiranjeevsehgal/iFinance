/**
 * Investment category enum
 */
export enum InvestmentCategory {
  STOCKS = 'STOCKS',
  MUTUAL_FUNDS = 'MUTUAL_FUNDS',
  FIXED_DEPOSIT = 'FIXED_DEPOSIT',
  SAVINGS_ACCOUNT = 'SAVINGS_ACCOUNT',
  GOLD = 'GOLD',
  REAL_ESTATE = 'REAL_ESTATE',
  CRYPTO = 'CRYPTO',
  OTHER = 'OTHER'
}

/**
 * Investment category display configuration
 */
export const INVESTMENT_CATEGORY_CONFIG: Record<InvestmentCategory, { label: string; icon: string; color: string }> = {
  [InvestmentCategory.STOCKS]: {
    label: 'Stocks',
    icon: '📈',
    color: 'text-green-600'
  },
  [InvestmentCategory.MUTUAL_FUNDS]: {
    label: 'Mutual Funds',
    icon: '📊',
    color: 'text-blue-600'
  },
  [InvestmentCategory.FIXED_DEPOSIT]: {
    label: 'Fixed Deposit',
    icon: '🏦',
    color: 'text-indigo-600'
  },
  [InvestmentCategory.SAVINGS_ACCOUNT]: {
    label: 'Savings Account',
    icon: '💰',
    color: 'text-yellow-600'
  },
  [InvestmentCategory.GOLD]: {
    label: 'Gold',
    icon: '🪙',
    color: 'text-amber-600'
  },
  [InvestmentCategory.REAL_ESTATE]: {
    label: 'Real Estate',
    icon: '🏠',
    color: 'text-purple-600'
  },
  [InvestmentCategory.CRYPTO]: {
    label: 'Cryptocurrency',
    icon: '₿',
    color: 'text-orange-600'
  },
  [InvestmentCategory.OTHER]: {
    label: 'Other',
    icon: '📁',
    color: 'text-gray-600'
  }
};

/**
 * Investment model
 */
export interface Investment {
  id?: string;
  date: string;
  category: InvestmentCategory;
  amount: number;
  description?: string;
  otherCategoryName?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Investment summary model
 */
export interface InvestmentSummary {
  totalAmount: number;
  count: number;
  startDate: string;
  endDate: string;
  categoryBreakdown: { [key: string]: number };
}
