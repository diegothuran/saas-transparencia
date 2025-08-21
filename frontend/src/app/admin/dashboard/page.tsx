'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  UsersIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ArrowTrendingDownIcon as TrendingDownIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  revenues: {
    total: number;
    thisMonth: number;
    growth: number;
  };
  expenses: {
    total: number;
    thisMonth: number;
    growth: number;
  };
  contracts: {
    active: number;
    pending: number;
    total: number;
  };
  esic: {
    pending: number;
    overdue: number;
    answered: number;
    total: number;
  };
  users: {
    total: number;
    active: number;
  };
}

interface RecentActivity {
  id: number;
  type: 'revenue' | 'expense' | 'contract' | 'esic';
  description: string;
  amount?: number;
  date: string;
  status?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dados simulados
      setStats({
        revenues: {
          total: 15420000,
          thisMonth: 1250000,
          growth: 8.5
        },
        expenses: {
          total: 12350000,
          thisMonth: 980000,
          growth: -2.3
        },
        contracts: {
          active: 45,
          pending: 8,
          total: 156
        },
        esic: {
          pending: 12,
          overdue: 3,
          answered: 89,
          total: 104
        },
        users: {
          total: 15,
          active: 12
        }
      });

      setRecentActivity([
        {
          id: 1,
          type: 'revenue',
          description: 'IPTU - Arrecadação mensal',
          amount: 125000,
          date: '2024-08-19',
          status: 'confirmed'
        },
        {
          id: 2,
          type: 'expense',
          description: 'Pagamento de salários - Agosto',
          amount: 450000,
          date: '2024-08-18',
          status: 'paid'
        },
        {
          id: 3,
          type: 'contract',
          description: 'Contrato de limpeza urbana renovado',
          date: '2024-08-17',
          status: 'active'
        },
        {
          id: 4,
          type: 'esic',
          description: 'Nova solicitação de informação sobre obras',
          date: '2024-08-16',
          status: 'pending'
        },
        {
          id: 5,
          type: 'revenue',
          description: 'ISS - Serviços prestados',
          amount: 89750,
          date: '2024-08-15',
          status: 'confirmed'
        }
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'revenue':
        return CurrencyDollarIcon;
      case 'expense':
        return ChartBarIcon;
      case 'contract':
        return DocumentTextIcon;
      case 'esic':
        return InformationCircleIcon;
      default:
        return ClockIcon;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'revenue':
        return 'text-green-600 bg-green-100';
      case 'expense':
        return 'text-red-600 bg-red-100';
      case 'contract':
        return 'text-blue-600 bg-blue-100';
      case 'esic':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Visão geral do portal de transparência
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenues */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Receitas (Ano)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats && formatCurrency(stats.revenues.total)}
                </p>
                <div className="flex items-center mt-1">
                  {stats && stats.revenues.growth > 0 ? (
                    <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    stats && stats.revenues.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats && Math.abs(stats.revenues.growth)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Despesas (Ano)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats && formatCurrency(stats.expenses.total)}
                </p>
                <div className="flex items-center mt-1">
                  {stats && stats.expenses.growth > 0 ? (
                    <TrendingUpIcon className="h-4 w-4 text-red-500 mr-1" />
                  ) : (
                    <TrendingDownIcon className="h-4 w-4 text-green-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    stats && stats.expenses.growth > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {stats && Math.abs(stats.expenses.growth)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contracts */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Contratos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.contracts.active}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats?.contracts.pending} pendentes
                </p>
              </div>
            </div>
          </div>

          {/* e-SIC */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <InformationCircleIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">e-SIC Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.esic.pending}
                </p>
                {stats && stats.esic.overdue > 0 && (
                  <div className="flex items-center mt-1">
                    <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600">
                      {stats.esic.overdue} em atraso
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent activity */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Atividades Recentes
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start">
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            {formatDate(activity.date)}
                          </p>
                          {activity.amount && (
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(activity.amount)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Ações Rápidas
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Nova Receita</p>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <ChartBarIcon className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Nova Despesa</p>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Novo Contrato</p>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <UsersIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Novo Usuário</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {stats && stats.esic.overdue > 0 && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Atenção: Solicitações e-SIC em atraso
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  Existem {stats.esic.overdue} solicitações e-SIC que ultrapassaram o prazo legal de resposta.
                  É necessário responder urgentemente para manter a conformidade com a LAI.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

