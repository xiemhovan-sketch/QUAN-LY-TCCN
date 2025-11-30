export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: string; // YYYY-MM-DD
}

export interface Budget {
  [category: string]: number;
}

export interface AppData {
  transactions: Transaction[];
  budgets: Budget;
}

export enum AppRoutes {
  HOME = '/',
  TRANSACTIONS = '/transactions',
  BUDGET = '/budget',
  BACKUP = '/backup'
}

export interface CategoryOption {
  id: string;
  label: string;
}