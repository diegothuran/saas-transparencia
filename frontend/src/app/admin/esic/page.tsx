'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Modal from '@/components/ui/Modal';
import EsicRequestForm from '@/components/forms/EsicRequestForm';
import { useEsicRequests, EsicRequest, CreateEsicRequestData } from '@/hooks/useEsicRequests';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  DocumentTextIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function EsicPage() {
  const { requests, loading, createRequest, updateRequest, deleteRequest } = useEsicRequests();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<EsicRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = () => {
    setEditingRequest(null);
    setIsModalOpen(true);
  };

  const handleEdit = (request: EsicRequest) => {
    setEditingRequest(request);
    setIsModalOpen(true);
  };

  const handleDelete = async (request: EsicRequest) => {
    if (confirm(`Tem certeza que deseja excluir a solicitação "${request.subject}"?`)) {
      try {
        await deleteRequest(request.id);
      } catch {
        alert('Erro ao excluir solicitação');
      }
    }
  };

  const handleSubmit = async (data: CreateEsicRequestData) => {
    try {
      setSubmitting(true);
      if (editingRequest) {
        await updateRequest(editingRequest.id, data);
      } else {
        await createRequest(data);
      }
      setIsModalOpen(false);
      setEditingRequest(null);
    } catch {
      alert('Erro ao salvar solicitação');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRequest(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
      case 'answered':
        return 'bg-green-50 text-green-700 ring-green-600/20';
      case 'overdue':
        return 'bg-red-50 text-red-700 ring-red-600/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-gray-600/20';
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
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  // Contagem de status
  const pendingCount = requests.filter((r: EsicRequest) => r.status === 'pending').length;
  const answeredCount = requests.filter((r: EsicRequest) => r.status === 'answered').length;
  const overdueCount = requests.filter((r: EsicRequest) => r.status === 'overdue').length;

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">e-SIC</h1>
              <p className="mt-2 text-sm text-gray-700">
                Sistema Eletrônico de Informações ao Cidadão
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                onClick={handleCreate}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Nova Solicitação
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>

          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Solicitação
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Solicitante
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="relative px-6 py-3">
                            <span className="sr-only">Ações</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {requests.map((request: EsicRequest) => (
                          <tr key={request.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="flex items-center">
                                {getStatusIcon(request.status)}
                                <div className="ml-3">
                                  <div className="font-medium">{request.subject}</div>
                                  <div className="text-gray-500">{request.protocol_number}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div>
                                <div className="font-medium">{request.requester_name}</div>
                                <div className="text-gray-500">{request.requester_email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <div>
                                  <div>{formatDate(request.request_date)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(request.status)}`}>
                                {getStatusText(request.status)}
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEdit(request)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Editar"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(request)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Excluir"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {requests.length === 0 && (
                      <div className="text-center py-12">
                        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma solicitação</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Comece criando uma nova solicitação.
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={handleCreate}
                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                          >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Nova Solicitação
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Modal
          open={isModalOpen}
          onClose={handleCancel}
          title={editingRequest ? 'Editar Solicitação' : 'Nova Solicitação'}
        >
          <EsicRequestForm
            request={editingRequest || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={submitting}
          />
        </Modal>
      </AdminLayout>
    </ProtectedRoute>
  );
}
