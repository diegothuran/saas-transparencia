import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export interface Contract {
  id: number;
  number: string;
  supplier: string;
  object: string;
  value: number;
  start_date: string;
  end_date: string;
  status: string;
  process_number: string;
  modality: string;
  is_active: boolean;
  tenant_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateContractData {
  number: string;
  supplier: string;
  object: string;
  value: number;
  start_date: string;
  end_date: string;
  status: string;
  process_number: string;
  modality: string;
}

export const useContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<Contract[]>('/contracts/');
      setContracts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar contratos');
    } finally {
      setLoading(false);
    }
  };

  const createContract = async (contractData: CreateContractData) => {
    try {
      setLoading(true);
      setError(null);
      const newContract = await apiClient.post<Contract>('/contracts/', contractData);
      setContracts(prev => [...prev, newContract]);
      return newContract;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar contrato');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContract = async (id: number, contractData: Partial<CreateContractData>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedContract = await apiClient.put<Contract>(`/contracts/${id}`, contractData);
      setContracts(prev => prev.map(contract => 
        contract.id === id ? updatedContract : contract
      ));
      return updatedContract;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar contrato');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteContract = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.delete(`/contracts/${id}`);
      setContracts(prev => prev.filter(contract => contract.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir contrato');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return {
    contracts,
    loading,
    error,
    fetchContracts,
    createContract,
    updateContract,
    deleteContract
  };
};
