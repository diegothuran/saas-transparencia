'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  InformationCircleIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface EsicRequest {
  id: number;
  protocol: string;
  subject: string;
  requesterName: string;
  requesterEmail: string;
  requestDate: string;
  dueDate: string;
  status: 'pending' | 'answered' | 'overdue' | 'extended';
  description: string;
  department: string;
  responseDate?: string;
  responseText?: string;
}

export default function EsicPage() {
  const [requests, setRequests] = useState<EsicRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dados simulados
      setRequests([
        {
          id: 1,
          protocol: '2024000001',
          subject: 'Informações sobre licitações de obras públicas',
          requesterName: 'João Silva',
          requesterEmail: 'joao.silva@email.com',
          requestDate: '2024-08-01',
          dueDate: '2024-08-21',
          status: 'answered',
          description: 'Solicito informações sobre as licitações de obras públicas realizadas no primeiro semestre de 2024.',
          department: 'Secretaria de Obras',
          responseDate: '2024-08-15',
          responseText: 'Prezado cidadão, seguem anexos os documentos referentes às licitações solicitadas...'
        },
        {
          id: 2,
          protocol: '2024000002',
          subject: 'Gastos com educação',
          requesterName: 'Maria Santos',
          requesterEmail: 'maria.santos@email.com',
          requestDate: '2024-08-05',
          dueDate: '2024-08-25',
          status: 'pending',
          description: 'Gostaria de receber informações detalhadas sobre os gastos com educação nos últimos 12 meses.',
          department: 'Secretaria de Educação'
        },
        {
          id: 3,
          protocol: '2024000003',
          subject: 'Folha de pagamento',
          requesterName: 'Carlos Oliveira',
          requesterEmail: 'carlos.oliveira@email.com',
          requestDate: '2024-07-25',
          dueDate: '2024-08-14',
          status: 'overdue',
          description: 'Solicito acesso aos dados da folha de pagamento de servidores públicos do município.',
          department: 'Recursos Humanos'
        },
        {
          id: 4,
          protocol: '2024000004',
          subject: 'Contratos de prestação de serviços',
          requesterName: 'Ana Pereira',
          requesterEmail: 'ana.pereira@email.com',
          requestDate: '2024-08-10',
          dueDate: '2024-08-30',
          status: 'pending',
          description: 'Gostaria de ter acesso aos contratos de prestação de serviços firmados pela prefeitura em 2024.',
          department: 'Secretaria de Administração'
        },
        {
          id: 5,
          protocol: '2024000005',
          subject: 'Orçamento da saúde',
          requesterName: 'Pedro Souza',
          requesterEmail: 'pedro.souza@email.com',
          requestDate: '2024-07-20',
          dueDate: '2024-08-09',
          status: 'overdue',
          description: 'Solicito informações sobre o orçamento da saúde e sua execução no corrente ano.',
          department: 'Secretaria de Saúde'
        },
        {
          id: 6,
          protocol: '2024000006',
          subject: 'Projetos ambientais',
          requesterName: 'Luciana Ferreira',
          requesterEmail: 'luciana.ferreira@email.com',
          requestDate: '2024-08-12',
          dueDate: '2024-09-01',
          status: 'pending',
          description: 'Gostaria de obter informações sobre os projetos ambientais em desenvolvimento no município.',
          department: 'Secretaria de Meio Ambiente'
        }
      ]);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getRemainingDays = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'answered':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'extended':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'answered':
        return 'Respondido';
      case 'overdue':
        return 'Em atraso';
      case 'extended':
        return 'Prazo prorrogado';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'answered':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case 'extended':
        return <ClockIcon className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || request.status === filterStatus;
    const matchesDepartment = filterDepartment === '' || request.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = Array.from(new Set(requests.map(request => request.department)));
  const statuses = ['pending', 'answered', 'overdue', 'extended'];

  const overdueCount = requests.filter(r => r.status === 'overdue').length;
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const answeredCount = requests.filter(r => r.status === 'answered').length;

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
            <h1 className="text-2xl font-bold text-gray-900">e-SIC</h1>
            <p className="mt-1 text-sm text-gray-600">
              Sistema Eletrônico do Serviço de Informações ao Cidadão
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Pending */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Overdue */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">Em atraso</p>
                  <p className="text-2xl font-bold text-gray-900">{overdueCount}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Answered */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">Respondidas</p>
                  <p className="text-2xl font-bold text-gray-900">{answeredCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert for overdue requests */}
        {overdueCount > 0 && (
          <div className="rounded-md bg-red-50 p-4 mb-6 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Atenção! Existem solicitações em atraso
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Há {overdueCount} solicitação(ões) que ultrapassaram o prazo legal de resposta.
                    É necessário responder com urgência para manter a conformidade com a LAI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-900 flex items-center">
              <FunnelIcon className="h-4 w-4 text-gray-500 mr-2" />
              Filtros
            </h3>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  placeholder="Buscar solicitações..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
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
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <select
                id="department"
                name="department"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Todos os departamentos</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end justify-between">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('');
                  setFilterDepartment('');
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Limpar Filtros
              </button>
              <button
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* ESIC Request Cards */}
        <div className="space-y-6">
          {filteredRequests.map((request) => {
            const remainingDays = getRemainingDays(request.dueDate);
            const isUrgent = remainingDays > 0 && remainingDays <= 3 && request.status === 'pending';
            
            return (
              <div 
                key={request.id} 
                className={`bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
                  isUrgent ? 'border-yellow-300' : (request.status === 'overdue' ? 'border-red-300' : '')
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="p-2 rounded-lg">
                        {getStatusIcon(request.status)}
                      </div>
                      <div className="ml-3">
                        <div className="flex items-center">
                          <h4 className="text-lg font-medium text-gray-900">{request.subject}</h4>
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Protocolo: {request.protocol}</p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Solicitante</p>
                      <p className="font-medium">{request.requesterName}</p>
                      <p className="text-gray-600">{request.requesterEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Departamento</p>
                      <p className="font-medium">{request.department}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Datas</p>
                      <div className="flex items-center justify-between">
                        <p>Recebido: <span className="font-medium">{formatDate(request.requestDate)}</span></p>
                        <p>Prazo: <span className={`font-medium ${
                          request.status === 'overdue' ? 'text-red-600' : (isUrgent ? 'text-yellow-600' : '')
                        }`}>
                          {formatDate(request.dueDate)}
                        </span></p>
                      </div>
                      {request.responseDate && (
                        <p>Respondido: <span className="font-medium text-green-600">{formatDate(request.responseDate)}</span></p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm text-gray-700">{request.description}</p>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    {request.status === 'pending' || request.status === 'overdue' ? (
                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Responder
                      </button>
                    ) : (
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Ver Resposta
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredRequests.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border py-10 text-center">
              <p className="text-gray-500">Nenhuma solicitação encontrada</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
