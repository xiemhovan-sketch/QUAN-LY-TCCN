import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Budget, AppData } from '../types';

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (category: string, amount: number) => void;
  importData: (data: AppData, mode: 'merge' | 'replace') => void;
  exportData: () => void;
  resetData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEY = 'vietin_finance_data';

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget>({});

  // Load initial data
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed: AppData = JSON.parse(savedData);
        setTransactions(parsed.transactions || []);
        setBudgets(parsed.budgets || {});
      } catch (error) {
        console.error("Failed to load data", error);
      }
    }
  }, []);

  // Save data on change
  useEffect(() => {
    const data: AppData = { transactions, budgets };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [transactions, budgets]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateBudget = (category: string, amount: number) => {
    setBudgets(prev => ({
      ...prev,
      [category]: amount,
    }));
  };

  const importData = (data: AppData, mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      setTransactions(data.transactions || []);
      setBudgets(data.budgets || {});
    } else {
      // Merge: Add new transactions, overwrite budgets
      setTransactions(prev => {
        // Simple merge: just concat. For stricter merge, check IDs.
        // Assuming imported IDs might be different or we want to keep duplicates if intended.
        // To avoid exact duplicates, we could filter by ID.
        const existingIds = new Set(prev.map(t => t.id));
        const newTransactions = data.transactions.filter(t => !existingIds.has(t.id));
        return [...newTransactions, ...prev];
      });
      setBudgets(prev => ({ ...prev, ...data.budgets }));
    }
  };

  const exportData = () => {
    const data: AppData = { transactions, budgets };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vietin_finance_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetData = () => {
    setTransactions([]);
    setBudgets({});
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        addTransaction,
        deleteTransaction,
        updateBudget,
        importData,
        exportData,
        resetData
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};