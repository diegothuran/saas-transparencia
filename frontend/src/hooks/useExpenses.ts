import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export interface Expense {
  id: number;
  supplier: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  account: string;
  is_active: boolean;
  tenant_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseData {
  supplier: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  account: string;
}

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<Expense[]>('/financial/expenses/');
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar despesas');
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (expenseData: CreateExpenseData) => {
    try {
      setLoading(true);
      setError(null);
      const newExpense = await apiClient.post<Expense>('/financial/expenses/', expenseData);
      setExpenses(prev => [...prev, newExpense]);
      return newExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar despesa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id: number, expenseData: Partial<CreateExpenseData>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedExpense = await apiClient.put<Expense>(`/financial/expenses/${id}`, expenseData);
      setExpenses(prev => prev.map(expense => 
        expense.id === id ? updatedExpense : expense
      ));
      return updatedExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar despesa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.delete(`/financial/expenses/${id}`);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir despesa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  };
};
