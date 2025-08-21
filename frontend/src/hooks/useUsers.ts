'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  department?: string;
  position?: string;
  bio?: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  role: string;
  tenant_id: number;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  username: string;
  email: string;
  full_name: string;
  password: string;
  phone?: string;
  department?: string;
  position?: string;
  bio?: string;
  is_active?: boolean;
  is_superuser?: boolean;
  role?: string;
  tenant_id: number;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  full_name?: string;
  password?: string;
  phone?: string;
  department?: string;
  position?: string;
  bio?: string;
  is_active?: boolean;
  is_superuser?: boolean;
  role?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (skip = 0, limit = 100, tenant_id?: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
      });
      
      if (tenant_id) {
        params.append('tenant_id', tenant_id.toString());
      }

      const response = await apiClient.get<User[]>(`/users?${params.toString()}`);
      setUsers(response);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || 'Erro ao carregar usuários';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: UserCreate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<User>('/users', userData);
      setUsers(prev => [...prev, response]);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || 'Erro ao criar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: number, userData: UserUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.put<User>(`/users/${userId}`, userData);
      setUsers(prev => 
        prev.map(user => user.id === userId ? response : user)
      );
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || 'Erro ao atualizar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || 'Erro ao deletar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<User>(`/users/${userId}`);
      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || 'Erro ao buscar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser
  };
};
