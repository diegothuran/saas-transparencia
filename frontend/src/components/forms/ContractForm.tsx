import React, { useState } from 'react';
import { Contract, CreateContractData } from '@/hooks/useContracts';

interface ContractFormProps {
  contract?: Contract;
  onSubmit: (data: CreateContractData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ContractForm({ contract, onSubmit, onCancel, loading = false }: ContractFormProps) {
  const [formData, setFormData] = useState<CreateContractData>({
    number: contract?.number || '',
    supplier: contract?.supplier || '',
    object: contract?.object || '',
    value: contract?.value || 0,
    start_date: contract?.start_date ? contract.start_date.split('T')[0] : '',
    end_date: contract?.end_date ? contract.end_date.split('T')[0] : '',
    status: contract?.status || 'Ativo',
    process_number: contract?.process_number || '',
    modality: contract?.modality || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.number.trim()) {
      newErrors.number = 'Número do contrato é obrigatório';
    }

    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Fornecedor é obrigatório';
    }

    if (!formData.object.trim()) {
      newErrors.object = 'Objeto é obrigatório';
    }

    if (formData.value <= 0) {
      newErrors.value = 'Valor deve ser maior que zero';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Data de início é obrigatória';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'Data de fim é obrigatória';
    }

    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = 'Data de fim deve ser posterior à data de início';
    }

    if (!formData.process_number.trim()) {
      newErrors.process_number = 'Número do processo é obrigatório';
    }

    if (!formData.modality.trim()) {
      newErrors.modality = 'Modalidade é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao salvar contrato:', error);
    }
  };

  const handleChange = (field: keyof CreateContractData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número do Contrato *
          </label>
          <input
            type="text"
            value={formData.number}
            onChange={(e) => handleChange('number', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.number ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: 001/2025"
          />
          {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número do Processo *
          </label>
          <input
            type="text"
            value={formData.process_number}
            onChange={(e) => handleChange('process_number', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.process_number ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: 2025.01.001"
          />
          {errors.process_number && <p className="text-red-500 text-xs mt-1">{errors.process_number}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fornecedor *
        </label>
        <input
          type="text"
          value={formData.supplier}
          onChange={(e) => handleChange('supplier', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.supplier ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Nome do fornecedor"
        />
        {errors.supplier && <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Objeto do Contrato *
        </label>
        <textarea
          value={formData.object}
          onChange={(e) => handleChange('object', e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.object ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Descrição do objeto do contrato"
        />
        {errors.object && <p className="text-red-500 text-xs mt-1">{errors.object}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor *
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.value}
            onChange={(e) => handleChange('value', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.value ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Início *
          </label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => handleChange('start_date', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.start_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Término *
          </label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => handleChange('end_date', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.end_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.status ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="Ativo">Ativo</option>
            <option value="Suspenso">Suspenso</option>
            <option value="Encerrado">Encerrado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modalidade *
          </label>
          <select
            value={formData.modality}
            onChange={(e) => handleChange('modality', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.modality ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione uma modalidade</option>
            <option value="Pregão Eletrônico">Pregão Eletrônico</option>
            <option value="Pregão Presencial">Pregão Presencial</option>
            <option value="Tomada de Preços">Tomada de Preços</option>
            <option value="Convite">Convite</option>
            <option value="Concorrência">Concorrência</option>
            <option value="Dispensa">Dispensa</option>
            <option value="Inexigibilidade">Inexigibilidade</option>
          </select>
          {errors.modality && <p className="text-red-500 text-xs mt-1">{errors.modality}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : contract ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
}
