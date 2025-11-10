/**
 * Expense category enum
 */
export enum ExpenseCategory {
  FOOD = 'FOOD',
  GROCERIES = 'GROCERIES',
  ENTERTAINMENT = 'ENTERTAINMENT',
  HEALTH = 'HEALTH',
  UTILITIES = 'UTILITIES',
  SHOPPING = 'SHOPPING',
  EDUCATION = 'EDUCATION',
  OTHER = 'OTHER'
}

/**
 * Payment method enum
 */
export enum PaymentMethod {
  CASH = 'CASH',
  UPI = 'UPI',
  DEBIT_CARD = 'DEBIT_CARD',
  CREDIT_CARD = 'CREDIT_CARD',
  OTHER = 'OTHER'
}

/**
 * Expense category display configuration
 */
export const EXPENSE_CATEGORIES = [
  { value: ExpenseCategory.FOOD, label: 'Food', icon: '🍔', color: 'orange' },
  { value: ExpenseCategory.GROCERIES, label: 'Groceries', icon: '🛒', color: 'green' },
  { value: ExpenseCategory.ENTERTAINMENT, label: 'Entertainment', icon: '🎬', color: 'purple' },
  { value: ExpenseCategory.HEALTH, label: 'Health', icon: '🏥', color: 'red' },
  { value: ExpenseCategory.UTILITIES, label: 'Utilities', icon: '💡', color: 'blue' },
  { value: ExpenseCategory.SHOPPING, label: 'Shopping', icon: '🛍️', color: 'pink' },
  { value: ExpenseCategory.EDUCATION, label: 'Education', icon: '📚', color: 'indigo' },
  { value: ExpenseCategory.OTHER, label: 'Other', icon: '📝', color: 'gray' }
];

/**
 * Payment method display configuration
 */
export const PAYMENT_METHODS = [
  { value: PaymentMethod.CASH, label: 'Cash', icon: '💵' },
  { value: PaymentMethod.UPI, label: 'UPI', icon: '📱' },
  { value: PaymentMethod.DEBIT_CARD, label: 'Debit Card', icon: '💳' },
  { value: PaymentMethod.CREDIT_CARD, label: 'Credit Card', icon: '💳' },
  { value: PaymentMethod.OTHER, label: 'Other', icon: '💰' }
];

/**
 * Expense model
 */
export interface Expense {
  id?: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  paymentMethod: PaymentMethod;
  otherCategoryName?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Expense summary model
 */
export interface ExpenseSummary {
  totalAmount: number;
  count: number;
  startDate: string;
  endDate: string;
  categoryBreakdown: { [key in ExpenseCategory]?: number };
  paymentMethodBreakdown: { [key in PaymentMethod]?: number };
}

/**
 * Helper functions
 */
export function getCategoryConfig(category: ExpenseCategory) {
  return EXPENSE_CATEGORIES.find(c => c.value === category) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
}

export function getPaymentMethodConfig(method: PaymentMethod) {
  return PAYMENT_METHODS.find(p => p.value === method) || PAYMENT_METHODS[PAYMENT_METHODS.length - 1];
}
