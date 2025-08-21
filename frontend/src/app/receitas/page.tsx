'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  CurrencyDollarIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  CalendarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Revenue {
  id: number;
  description: string;
  category: string;
  subcategory?: string;
  amount: number;
  date: string;
  budget_code?: string;
  source?: string;
  process_number?: string;
}

export default function ReceitasPage() {
  const searchParams = useSearchParams();
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: '',
    category: '',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    byCategory: {} as Record<string, number>
  });

  const categories = [
    { value: 'impostos', label: 'Impostos' },
    { value: 'transferencias', label: 'Transferências' },
    { value: 'servicos', label: 'Serviços' },
    { value: 'investimentos', label: 'Investimentos' },
    { value: 'outros', label: 'Outros' }
  ];

  const months = [
    { value: '', label: 'Todos os meses' },
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ];

  useEffect(() => {
    loadRevenues();
    loadStats();
  }, [filters]);

  const loadRevenues = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados
      const mockRevenues: Revenue[] = [
        {
          id: 1,
          description: 'IPTU - Imposto Predial e Territorial Urbano',
          category: 'impostos',
          subcategory: 'IPTU',
          amount: 125000.50,
          date: '2024-08-15',
          budget_code: '1.1.1.8.01.1.1',
          source: 'Arrecadação Própria',
          process_number: '2024/001234'
        },
        {
          id: 2,
          description: 'ISS - Imposto sobre Serviços',
          category: 'impostos',
          subcategory: 'ISS',
          amount: 89750.25,
          date: '2024-08-14',
          budget_code: '1.1.1.8.01.3.0',
          source: 'Arrecadação Própria',
          process_number: '2024/001235'
        },
        {
          id: 3,
          description: 'FPM - Fundo de Participação dos Municípios',
          category: 'transferencias',
          subcategory: 'União',
          amount: 450000.00,
          date: '2024-08-10',
          budget_code: '1.7.2.8.01.1.0',
          source: 'Transferência da União',
          process_number: '2024/001236'
        },
        {
          id: 4,
          description: 'ICMS - Transferência do Estado',
          category: 'transferencias',
          subcategory: 'Estado',
          amount: 320000.75,
          date: '2024-08-08',
          budget_code: '1.7.2.8.01.2.0',
          source: 'Transferência do Estado',
          process_number: '2024/001237'
        },
        {
          id: 5,
          description: 'Taxa de Coleta de Lixo',
          category: 'servicos',
          subcategory: 'Taxas',
          amount: 45000.00,
          date: '2024-08-05',
          budget_code: '1.1.1.8.01.4.0',
          source: 'Arrecadação Própria',
          process_number: '2024/001238'
        }
      ];

      setRevenues(mockRevenues);
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    // Simular carregamento de estatísticas
    setStats({
      total: 1029750.50,
      thisMonth: 1029750.50,
      lastMonth: 987500.25,
      byCategory: {
        'impostos': 214750.75,
        'transferencias': 770000.75,
        'servicos': 45000.00,
        'investimentos': 0,
        'outros': 0
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

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const handleExport = () => {
    // Implementar exportação
    alert('Funcionalidade de exportação será implementada');
  };

  const filteredRevenues = revenues.filter(revenue => {
    const matchesCategory = !filters.category || revenue.category === filters.category;
    const matchesSearch = !filters.search || 
      revenue.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      revenue.source?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Receitas Municipais</h1>
              <p className="text-gray-600">
                Acompanhe todas as receitas do município em tempo real
              </p>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500">
            <span>Início</span> / <span className="text-gray-900">Receitas</span>
          </nav>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total do Ano</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.total)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Este Mês</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.thisMonth)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Variação</p>
                <p className="text-2xl font-bold text-purple-600">
                  +{(((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100).toFixed(1)}%
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                Mês
              </label>
              <select
                value={filters.month}
                onChange={(e) => setFilters({...filters, month: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
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
                  placeholder="Buscar receitas..."
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

        {/* Revenues table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Lista de Receitas ({filteredRevenues.length} registros)
            </h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando receitas...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fonte
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRevenues.map((revenue) => (
                    <tr key={revenue.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(revenue.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{revenue.description}</p>
                          {revenue.process_number && (
                            <p className="text-gray-500 text-xs">
                              Processo: {revenue.process_number}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {getCategoryLabel(revenue.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {revenue.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                        {formatCurrency(revenue.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  Esta página atende aos requisitos da Lei Complementar nº 131/2009 (Lei da Transparência) 
                  e da Lei nº 12.527/2011 (Lei de Acesso à Informação), disponibilizando informações 
                  sobre receitas municipais em tempo real.
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

