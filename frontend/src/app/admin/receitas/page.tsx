'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Modal from '@/components/ui/Modal';
import RevenueForm from '@/components/forms/RevenueForm';
import { useRevenues, Revenue, CreateRevenueData } from '@/hooks/useRevenues';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CurrencyDollarIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

export default function RevenuePage() {
  const { revenues, loading, createRevenue, updateRevenue, deleteRevenue } = useRevenues();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = () => {
    setEditingRevenue(null);
    setIsModalOpen(true);
  };

  const handleEdit = (revenue: Revenue) => {
    setEditingRevenue(revenue);
    setIsModalOpen(true);
  };

  const handleDelete = async (revenue: Revenue) => {
    if (confirm(`Tem certeza que deseja excluir a receita "${revenue.source}"?`)) {
      try {
        await deleteRevenue(revenue.id);
      } catch (error) {
        alert('Erro ao excluir receita');
      }
    }
  };

  const handleSubmit = async (data: CreateRevenueData) => {
    try {
      setSubmitting(true);
      if (editingRevenue) {
        await updateRevenue(editingRevenue.id, data);
      } else {
        await createRevenue(data);
      }
      setIsModalOpen(false);
      setEditingRevenue(null);
    } catch (error) {
      alert('Erro ao salvar receita');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRevenue(null);
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

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">Receitas</h1>
              <p className="mt-2 text-sm text-gray-700">
                Gerencie as receitas municipais
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                onClick={handleCreate}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Nova Receita
              </button>
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
                            Fonte
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descrição
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Categoria
                          </th>
                          <th className="relative px-6 py-3">
                            <span className="sr-only">Ações</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {revenues.map((revenue) => (
                          <tr key={revenue.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {revenue.source}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {revenue.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <CurrencyDollarIcon className="h-4 w-4 text-green-500 mr-1" />
                                {formatCurrency(revenue.amount)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                                {formatDate(revenue.date)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                {revenue.category}
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEdit(revenue)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Editar"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(revenue)}
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

                    {revenues.length === 0 && (
                      <div className="text-center py-12">
                        <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma receita</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Comece criando uma nova receita.
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={handleCreate}
                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                          >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Nova Receita
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
          title={editingRevenue ? 'Editar Receita' : 'Nova Receita'}
        >
          <RevenueForm
            revenue={editingRevenue || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={submitting}
          />
        </Modal>
      </AdminLayout>
    </ProtectedRoute>
  );
}
