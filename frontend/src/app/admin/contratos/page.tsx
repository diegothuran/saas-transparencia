'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Modal from '@/components/ui/Modal';
import ContractForm from '@/components/forms/ContractForm';
import { useContracts, Contract, CreateContractData } from '@/hooks/useContracts';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

export default function ContractsPage() {
  const { contracts, loading, createContract, updateContract, deleteContract } = useContracts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = () => {
    setEditingContract(null);
    setIsModalOpen(true);
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setIsModalOpen(true);
  };

  const handleDelete = async (contract: Contract) => {
    if (confirm(`Tem certeza que deseja excluir o contrato "${contract.object}"?`)) {
      try {
        await deleteContract(contract.id);
      } catch {
        alert('Erro ao excluir contrato');
      }
    }
  };

  const handleSubmit = async (data: CreateContractData) => {
    try {
      setSubmitting(true);
      if (editingContract) {
        await updateContract(editingContract.id, data);
      } else {
        await createContract(data);
      }
      setIsModalOpen(false);
      setEditingContract(null);
    } catch {
      alert('Erro ao salvar contrato');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingContract(null);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 ring-green-600/20';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
      case 'completed':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'cancelled':
        return 'bg-red-50 text-red-700 ring-red-600/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-gray-600/20';
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

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">Contratos</h1>
              <p className="mt-2 text-sm text-gray-700">
                Gerencie os contratos municipais
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                onClick={handleCreate}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Novo Contrato
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
                            Contrato
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fornecedor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Período
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
                        {contracts.map((contract) => (
                          <tr key={contract.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="flex items-center">
                                <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-2" />
                                <div>
                                  <div className="font-medium">{contract.object}</div>
                                  <div className="text-gray-500">{contract.contract_number}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {contract.supplier}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <CurrencyDollarIcon className="h-4 w-4 text-green-500 mr-1" />
                                {formatCurrency(contract.value)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <div>
                                  <div>{formatDate(contract.start_date)}</div>
                                  <div className="text-xs">até {formatDate(contract.end_date)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(contract.status)}`}>
                                {getStatusText(contract.status)}
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEdit(contract)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Editar"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(contract)}
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

                    {contracts.length === 0 && (
                      <div className="text-center py-12">
                        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum contrato</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Comece criando um novo contrato.
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={handleCreate}
                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                          >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Novo Contrato
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
          title={editingContract ? 'Editar Contrato' : 'Novo Contrato'}
        >
          <ContractForm
            contract={editingContract || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={submitting}
          />
        </Modal>
      </AdminLayout>
    </ProtectedRoute>
  );
}
