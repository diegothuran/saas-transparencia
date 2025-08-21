import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export interface EsicRequest {
  id: number;
  protocol_number: string;
  requester_name: string;
  requester_email: string;
  requester_document: string;
  request_subject: string;
  request_content: string;
  status: string;
  response_content: string | null;
  request_date: string;
  response_date: string | null;
  due_date: string;
  is_active: boolean;
  tenant_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateEsicRequestData {
  requester_name: string;
  requester_email: string;
  requester_document: string;
  request_subject: string;
  request_content: string;
  status?: string;
  response_content?: string;
}

export const useEsicRequests = () => {
  const [requests, setRequests] = useState<EsicRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<EsicRequest[]>('/esic/');
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos e-SIC');
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData: CreateEsicRequestData) => {
    try {
      setLoading(true);
      setError(null);
      const newRequest = await apiClient.post<EsicRequest>('/esic/', requestData);
      setRequests(prev => [...prev, newRequest]);
      return newRequest;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pedido e-SIC');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (id: number, requestData: Partial<CreateEsicRequestData>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedRequest = await apiClient.put<EsicRequest>(`/esic/${id}`, requestData);
      setRequests(prev => prev.map(request => 
        request.id === id ? updatedRequest : request
      ));
      return updatedRequest;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pedido e-SIC');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.delete(`/esic/${id}`);
      setRequests(prev => prev.filter(request => request.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir pedido e-SIC');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    updateRequest,
    deleteRequest
  };
};
