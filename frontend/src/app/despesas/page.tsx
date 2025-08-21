'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  ChartBarIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface Expense {
  id: number;
  description: string;
  category: string;
  department: string;
  amount: number;
  date: string;
  supplier?: string;
  supplier_document?: string;
  process_number?: string;
  payment_method?: string;
  budget_code?: string;
}

export default function DespesasPage() {
  // const searchParams = useSearchParams(); // Será usado em implementações futuras
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: '',
    category: '',
    department: '',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    byCategory: {} as Record<string, number>,
    byDepartment: {} as Record<string, number>
  });

  const categories = [
    { value: 'pessoal', label: 'Pessoal' },
    { value: 'custeio', label: 'Custeio' },
    { value: 'investimentos', label: 'Investimentos' },
    { value: 'saude', label: 'Saúde' },
    { value: 'educacao', label: 'Educação' },
    { value: 'outros', label: 'Outros' }
  ];

  const departments = [
    { value: 'administracao', label: 'Administração' },
    { value: 'saude', label: 'Saúde' },
    { value: 'educacao', label: 'Educação' },
    { value: 'infraestrutura', label: 'Infraestrutura' },
    { value: 'assistencia', label: 'Assistência Social' }
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
    loadExpenses();
    loadStats();
  }, [filters]);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados
      const mockExpenses: Expense[] = [
        {
          id: 1,
          description: 'Pagamento de pessoal - Funcionários administrativos',
          category: 'pessoal',
          department: 'administracao',
          amount: 245000.75,
          date: '2024-08-15',
          process_number: '2024/005001',
          payment_method: 'Transferência bancária',
          budget_code: '3.1.90.11.00'
        },
        {
          id: 2,
          description: 'Medicamentos para unidades básicas de saúde',
          category: 'saude',
          department: 'saude',
          amount: 78500.50,
          date: '2024-08-14',
          supplier: 'Farmamed Distribuidora Ltda',
          supplier_document: '12.345.678/0001-90',
          process_number: '2024/005002',
          payment_method: 'Transferência bancária',
          budget_code: '3.3.90.30.00'
        },
        {
          id: 3,
          description: 'Material escolar para escolas municipais',
          category: 'educacao',
          department: 'educacao',
          amount: 35250.00,
          date: '2024-08-12',
          supplier: 'Papelaria Educativa S.A.',
          supplier_document: '23.456.789/0001-01',
          process_number: '2024/005003',
          payment_method: 'Transferência bancária',
          budget_code: '3.3.90.30.00'
        },
        {
          id: 4,
          description: 'Serviço de manutenção de vias urbanas',
          category: 'custeio',
          department: 'infraestrutura',
          amount: 145750.25,
          date: '2024-08-10',
          supplier: 'Construtora Cidade Nova Ltda',
          supplier_document: '34.567.890/0001-12',
          process_number: '2024/005004',
          payment_method: 'Transferência bancária',
          budget_code: '3.3.90.39.00'
        },
        {
          id: 5,
          description: 'Aquisição de equipamentos para hospital municipal',
          category: 'investimentos',
          department: 'saude',
          amount: 230000.00,
          date: '2024-08-08',
          supplier: 'MedTech Equipamentos Hospitalares',
          supplier_document: '45.678.901/0001-23',
          process_number: '2024/005005',
          payment_method: 'Transferência bancária',
          budget_code: '4.4.90.52.00'
        },
        {
          id: 6,
          description: 'Cestas básicas para programa social',
          category: 'outros',
          department: 'assistencia',
          amount: 42300.00,
          date: '2024-08-05',
          supplier: 'Alimentos & Cia',
          supplier_document: '56.789.012/0001-34',
          process_number: '2024/005006',
          payment_method: 'Transferência bancária',
          budget_code: '3.3.90.32.00'
        }
      ];

      setExpenses(mockExpenses);
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    // Simular carregamento de estatísticas
    setStats({
      total: 776800.50,
      thisMonth: 776800.50,
      lastMonth: 701500.00,
      byCategory: {
        'pessoal': 245000.75,
        'saude': 78500.50,
        'educacao': 35250.00,
        'custeio': 145750.25,
        'investimentos': 230000.00,
        'outros': 42300.00
      },
      byDepartment: {
        'administracao': 245000.75,
        'saude': 308500.50,
        'educacao': 35250.00,
        'infraestrutura': 145750.25,
        'assistencia': 42300.00
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

  const getDepartmentLabel = (department: string) => {
    const dept = departments.find(d => d.value === department);
    return dept ? dept.label : department;
  };

  const handleExport = () => {
    // Implementar exportação
    alert('Funcionalidade de exportação será implementada');
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = !filters.category || expense.category === filters.category;
    const matchesDepartment = !filters.department || expense.department === filters.department;
    const matchesSearch = !filters.search || 
      expense.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      expense.supplier?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesDepartment && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <ChartBarIcon className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Despesas Municipais</h1>
              <p className="text-gray-600">
                Acompanhe todas as despesas do município em tempo real
              </p>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500">
            <span>Início</span> / <span className="text-gray-900">Despesas</span>
          </nav>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total do Ano</p>
                <p className="text-2xl font-bold text-red-600">
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
                <UserCircleIcon className="h-6 w-6 text-purple-600" />
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
                Secretaria
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as secretarias</option>
                {departments.map(department => (
                  <option key={department.value} value={department.value}>
                    {department.label}
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
                  placeholder="Buscar despesas..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Distribution by category */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribuição de Despesas por Categoria
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map(category => {
              const amount = stats.byCategory[category.value] || 0;
              const percentage = stats.total > 0 ? (amount / stats.total) * 100 : 0;
              
              return (
                <div key={category.value} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{category.label}</span>
                    <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-right font-semibold">
                    {formatCurrency(amount)}
                  </div>
                </div>
              );
            })}
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

        {/* Expenses table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Lista de Despesas ({filteredExpenses.length} registros)
            </h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando despesas...</p>
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
                      Secretaria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fornecedor
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          {expense.process_number && (
                            <p className="text-gray-500 text-xs">
                              Processo: {expense.process_number}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          {getCategoryLabel(expense.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getDepartmentLabel(expense.department)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {expense.supplier && (
                          <div>
                            <p>{expense.supplier}</p>
                            {expense.supplier_document && (
                              <p className="text-gray-500 text-xs">
                                CNPJ: {expense.supplier_document}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 text-right">
                        {formatCurrency(expense.amount)}
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
                  sobre despesas municipais em tempo real.
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
