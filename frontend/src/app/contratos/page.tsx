'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  DocumentTextIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';

interface Contract {
  id: number;
  number: string;
  object: string;
  supplier: string;
  supplier_document: string;
  initial_value: number;
  current_value: number;
  signature_date: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'canceled';
  department: string;
  modality: string;
  process_number: string;
}

export default function ContratosPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    status: '',
    department: '',
    modality: '',
    search: ''
  });
  const [stats, setStats] = useState({
    totalActive: 0,
    totalAmount: 0,
    avgDuration: 0,
    countByDepartment: {} as Record<string, number>,
    countByModality: {} as Record<string, number>
  });

  const departments = [
    { value: '', label: 'Todas as Secretarias' },
    { value: 'administracao', label: 'Administração' },
    { value: 'saude', label: 'Saúde' },
    { value: 'educacao', label: 'Educação' },
    { value: 'infraestrutura', label: 'Infraestrutura' },
    { value: 'assistencia', label: 'Assistência Social' }
  ];

  const modalities = [
    { value: '', label: 'Todas as Modalidades' },
    { value: 'pregao', label: 'Pregão Eletrônico' },
    { value: 'concorrencia', label: 'Concorrência Pública' },
    { value: 'tomada', label: 'Tomada de Preços' },
    { value: 'convite', label: 'Carta Convite' },
    { value: 'dispensa', label: 'Dispensa de Licitação' },
    { value: 'inexigibilidade', label: 'Inexigibilidade' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'active', label: 'Em Vigência' },
    { value: 'completed', label: 'Concluído' },
    { value: 'canceled', label: 'Cancelado' }
  ];

  useEffect(() => {
    loadContracts();
    loadStats();
  }, [filters]);

  const loadContracts = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados
      const mockContracts: Contract[] = [
        {
          id: 1,
          number: '2024/001',
          object: 'Fornecimento de material de escritório para unidades administrativas',
          supplier: 'Papelaria Central Ltda',
          supplier_document: '12.345.678/0001-90',
          initial_value: 85000.00,
          current_value: 85000.00,
          signature_date: '2024-02-10',
          start_date: '2024-02-15',
          end_date: '2025-02-14',
          status: 'active',
          department: 'administracao',
          modality: 'pregao',
          process_number: '2024/PR-001'
        },
        {
          id: 2,
          number: '2024/002',
          object: 'Aquisição de medicamentos para as unidades básicas de saúde',
          supplier: 'Farmamed Distribuidora S.A.',
          supplier_document: '23.456.789/0001-01',
          initial_value: 320000.00,
          current_value: 345000.00,
          signature_date: '2024-01-20',
          start_date: '2024-02-01',
          end_date: '2025-01-31',
          status: 'active',
          department: 'saude',
          modality: 'pregao',
          process_number: '2024/PR-002'
        },
        {
          id: 3,
          number: '2024/003',
          object: 'Reforma e ampliação da Escola Municipal José da Silva',
          supplier: 'Construtora Nova Era Ltda',
          supplier_document: '34.567.890/0001-12',
          initial_value: 750000.00,
          current_value: 750000.00,
          signature_date: '2024-03-05',
          start_date: '2024-03-15',
          end_date: '2024-12-15',
          status: 'active',
          department: 'educacao',
          modality: 'concorrencia',
          process_number: '2024/CP-001'
        },
        {
          id: 4,
          number: '2024/004',
          object: 'Serviço de manutenção da iluminação pública',
          supplier: 'LuzTec Serviços Elétricos ME',
          supplier_document: '45.678.901/0001-23',
          initial_value: 195000.00,
          current_value: 195000.00,
          signature_date: '2024-04-10',
          start_date: '2024-04-15',
          end_date: '2025-04-14',
          status: 'active',
          department: 'infraestrutura',
          modality: 'tomada',
          process_number: '2024/TP-001'
        },
        {
          id: 5,
          number: '2023/045',
          object: 'Fornecimento de cestas básicas para programa social',
          supplier: 'Alimentos Brasil S.A.',
          supplier_document: '56.789.012/0001-34',
          initial_value: 125000.00,
          current_value: 125000.00,
          signature_date: '2023-10-15',
          start_date: '2023-11-01',
          end_date: '2024-04-30',
          status: 'completed',
          department: 'assistencia',
          modality: 'pregao',
          process_number: '2023/PR-045'
        },
        {
          id: 6,
          number: '2023/032',
          object: 'Consultoria especializada para revisão do plano diretor',
          supplier: 'Urbaniza Consultoria Ltda',
          supplier_document: '67.890.123/0001-45',
          initial_value: 230000.00,
          current_value: 0.00,
          signature_date: '2023-08-20',
          start_date: '2023-09-01',
          end_date: '2024-02-28',
          status: 'canceled',
          department: 'administracao',
          modality: 'tomada',
          process_number: '2023/TP-032'
        }
      ];

      setContracts(mockContracts);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    // Simular carregamento de estatísticas
    setStats({
      totalActive: 4,
      totalAmount: 1375000.00,
      avgDuration: 365,
      countByDepartment: {
        'administracao': 2,
        'saude': 1,
        'educacao': 1,
        'infraestrutura': 1,
        'assistencia': 1
      },
      countByModality: {
        'pregao': 3,
        'concorrencia': 1,
        'tomada': 2
      }
    });
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.label : status;
  };

  const getDepartmentLabel = (department: string) => {
    const dept = departments.find(d => d.value === department);
    return dept ? dept.label : department;
  };

  const getModalityLabel = (modality: string) => {
    const mod = modalities.find(m => m.value === modality);
    return mod ? mod.label : modality;
  };

  const handleExport = () => {
    // Implementar exportação
    alert('Funcionalidade de exportação será implementada');
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesStatus = !filters.status || contract.status === filters.status;
    const matchesDepartment = !filters.department || contract.department === filters.department;
    const matchesModality = !filters.modality || contract.modality === filters.modality;
    const matchesSearch = !filters.search || 
      contract.object.toLowerCase().includes(filters.search.toLowerCase()) ||
      contract.supplier.toLowerCase().includes(filters.search.toLowerCase()) ||
      contract.number.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesDepartment && matchesModality && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contratos</h1>
              <p className="text-gray-600">
                Contratos e licitações do município
              </p>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500">
            <span>Início</span> / <span className="text-gray-900">Contratos</span>
          </nav>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contratos Ativos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalActive}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <IdentificationIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Duração Média</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.avgDuration} dias
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="flex items-center mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ano
              </label>
              <select
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secretaria
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departments.map(department => (
                  <option key={department.value} value={department.value}>
                    {department.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modalidade
              </label>
              <select
                value={filters.modality}
                onChange={(e) => setFilters({...filters, modality: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {modalities.map(modality => (
                  <option key={modality.value} value={modality.value}>
                    {modality.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar contratos..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Export button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Exportar Dados
          </button>
        </div>

        {/* Contracts list */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Lista de Contratos ({filteredContracts.length} registros)
            </h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando contratos...</p>
            </div>
          ) : filteredContracts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Objeto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fornecedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Período
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {contract.number}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{contract.object}</p>
                          <p className="text-gray-500 text-xs">
                            {getDepartmentLabel(contract.department)} | {getModalityLabel(contract.modality)}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Processo: {contract.process_number}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <p>{contract.supplier}</p>
                          <p className="text-gray-500 text-xs">
                            CNPJ: {contract.supplier_document}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <p>Início: {formatDate(contract.start_date)}</p>
                          <p>Fim: {formatDate(contract.end_date)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(contract.status)}`}>
                          {getStatusLabel(contract.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {contract.status !== 'canceled' 
                          ? formatCurrency(contract.current_value) 
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600">Nenhum contrato encontrado com os filtros aplicados.</p>
            </div>
          )}
        </div>

        {/* Legal compliance note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Conformidade Legal
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Esta página atende aos requisitos da Lei nº 8.666/93 (Lei de Licitações), 
                  Lei nº 14.133/2021 (Nova Lei de Licitações), Lei Complementar nº 131/2009 (Lei da Transparência) 
                  e da Lei nº 12.527/2011 (Lei de Acesso à Informação), disponibilizando informações 
                  sobre contratos e licitações do município.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
