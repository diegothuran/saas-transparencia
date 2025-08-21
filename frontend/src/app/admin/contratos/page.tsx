'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

interface Contract {
  id: number;
  number: string;
  title: string;
  description: string;
  supplier: string;
  value: number;
  startDate: string;
  endDate: string;
  type: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dados simulados
      setContracts([
        {
          id: 1,
          number: '2024/001',
          title: 'Contrato de Limpeza Urbana',
          description: 'Serviços de coleta de resíduos e limpeza urbana',
          supplier: 'Empresa de Limpeza ABC Ltda',
          value: 1250000,
          startDate: '2024-01-15',
          endDate: '2024-12-31',
          type: 'Serviço',
          status: 'active'
        },
        {
          id: 2,
          number: '2024/002',
          title: 'Construção de UBS',
          description: 'Construção de Unidade Básica de Saúde no Bairro Norte',
          supplier: 'Construtora XYZ S.A.',
          value: 3500000,
          startDate: '2024-03-10',
          endDate: '2025-03-10',
          type: 'Obra',
          status: 'active'
        },
        {
          id: 3,
          number: '2024/003',
          title: 'Fornecimento de Material Escolar',
          description: 'Fornecimento de kits de material escolar para escolas municipais',
          supplier: 'Papelaria Educativa Ltda',
          value: 750000,
          startDate: '2024-01-05',
          endDate: '2024-02-28',
          type: 'Fornecimento',
          status: 'completed'
        },
        {
          id: 4,
          number: '2024/004',
          title: 'Consultoria em Gestão Pública',
          description: 'Serviços de consultoria em gestão e otimização de processos',
          supplier: 'Consultores Associados ME',
          value: 180000,
          startDate: '2024-04-01',
          endDate: '2024-09-30',
          type: 'Serviço',
          status: 'active'
        },
        {
          id: 5,
          number: '2024/005',
          title: 'Manutenção de Estradas Vicinais',
          description: 'Manutenção e recuperação de estradas vicinais do município',
          supplier: 'Infraestrutura Viária Ltda',
          value: 1800000,
          startDate: '2024-05-15',
          endDate: '2024-11-15',
          type: 'Obra',
          status: 'active'
        },
        {
          id: 6,
          number: '2024/006',
          title: 'Aquisição de Equipamentos de Informática',
          description: 'Compra de computadores e equipamentos para setores administrativos',
          supplier: 'Tech Solutions S.A.',
          value: 320000,
          startDate: '2024-06-01',
          endDate: '2024-06-30',
          type: 'Fornecimento',
          status: 'pending'
        }
      ]);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'pending':
        return 'Pendente';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = searchTerm === '' || 
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || contract.status === filterStatus;
    const matchesType = filterType === '' || contract.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const types = Array.from(new Set(contracts.map(contract => contract.type)));
  const statuses = Array.from(new Set(contracts.map(contract => contract.status)));
  const totalValue = filteredContracts.reduce((sum, contract) => sum + contract.value, 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gerenciamento de contratos e licitações
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Novo Contrato
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-2" />
              Resumo de Contratos
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalValue)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Quantidade</p>
                <p className="text-3xl font-bold text-gray-900">
                  {filteredContracts.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {filteredContracts.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-900 flex items-center">
              <FunnelIcon className="h-4 w-4 text-gray-500 mr-2" />
              Filtros
            </h3>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10"
                  placeholder="Buscar contratos..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                id="type"
                name="type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Todos os tipos</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Todos os status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('');
                  setFilterType('');
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Limpar Filtros
              </button>
            </div>
            <div className="flex items-end justify-end">
              <button
                onClick={() => {
                  setLoading(true);
                  loadContracts();
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Atualizar
              </button>
              <button
                className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Contracts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredContracts.map((contract) => (
            <div key={contract.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                    <DocumentIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(contract.status)}`}>
                    {getStatusText(contract.status)}
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-medium text-gray-900">{contract.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{contract.number}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{contract.description}</p>
                </div>
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-medium text-gray-700">Fornecedor:</p>
                  <p className="text-sm text-gray-600">{contract.supplier}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Valor:</p>
                  <p className="text-sm text-gray-900 font-bold">{formatCurrency(contract.value)}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Período:</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(contract.startDate)} a {formatDate(contract.endDate)}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Ver Detalhes
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredContracts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border py-10 text-center">
            <p className="text-gray-500">Nenhum contrato encontrado</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm border px-6 py-3 mt-4">
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{filteredContracts.length}</span> contratos
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
