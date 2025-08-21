import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export interface Revenue {
  id: number;
  source: string;
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

export interface CreateRevenueData {
  source: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  account: string;
}

export const useRevenues = () => {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<Revenue[]>('/financial/revenues/');
      setRevenues(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar receitas');
    } finally {
      setLoading(false);
    }
  };

  const createRevenue = async (revenueData: CreateRevenueData) => {
    try {
      setLoading(true);
      setError(null);
      const newRevenue = await apiClient.post<Revenue>('/financial/revenues/', revenueData);
      setRevenues(prev => [...prev, newRevenue]);
      return newRevenue;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar receita');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRevenue = async (id: number, revenueData: Partial<CreateRevenueData>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedRevenue = await apiClient.put<Revenue>(`/financial/revenues/${id}`, revenueData);
      setRevenues(prev => prev.map(revenue => 
        revenue.id === id ? updatedRevenue : revenue
      ));
      return updatedRevenue;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar receita');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRevenue = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.delete(`/financial/revenues/${id}`);
      setRevenues(prev => prev.filter(revenue => revenue.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir receita');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenues();
  }, []);

  return {
    revenues,
    loading,
    error,
    fetchRevenues,
    createRevenue,
    updateRevenue,
    deleteRevenue
  };
};
