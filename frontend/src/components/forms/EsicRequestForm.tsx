import React, { useState } from 'react';
import { EsicRequest, CreateEsicRequestData } from '@/hooks/useEsicRequests';

interface EsicRequestFormProps {
  request?: EsicRequest;
  onSubmit: (data: CreateEsicRequestData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function EsicRequestForm({ request, onSubmit, onCancel, loading = false }: EsicRequestFormProps) {
  const [formData, setFormData] = useState<CreateEsicRequestData>({
    requester_name: request?.requester_name || '',
    requester_email: request?.requester_email || '',
    requester_document: request?.requester_document || '',
    request_subject: request?.request_subject || '',
    request_content: request?.request_content || '',
    status: request?.status || 'Pendente',
    response_content: request?.response_content || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.requester_name.trim()) {
      newErrors.requester_name = 'Nome do solicitante é obrigatório';
    }

    if (!formData.requester_email.trim()) {
      newErrors.requester_email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.requester_email)) {
      newErrors.requester_email = 'E-mail inválido';
    }

    if (!formData.requester_document.trim()) {
      newErrors.requester_document = 'Documento é obrigatório';
    }

    if (!formData.request_subject.trim()) {
      newErrors.request_subject = 'Assunto é obrigatório';
    }

    if (!formData.request_content.trim()) {
      newErrors.request_content = 'Conteúdo da solicitação é obrigatório';
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
      console.error('Erro ao salvar pedido e-SIC:', error);
    }
  };

  const handleChange = (field: keyof CreateEsicRequestData, value: string) => {
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
            Nome do Solicitante *
          </label>
          <input
            type="text"
            value={formData.requester_name}
            onChange={(e) => handleChange('requester_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.requester_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nome completo"
          />
          {errors.requester_name && <p className="text-red-500 text-xs mt-1">{errors.requester_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail *
          </label>
          <input
            type="email"
            value={formData.requester_email}
            onChange={(e) => handleChange('requester_email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.requester_email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="email@exemplo.com"
          />
          {errors.requester_email && <p className="text-red-500 text-xs mt-1">{errors.requester_email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Documento *
          </label>
          <input
            type="text"
            value={formData.requester_document}
            onChange={(e) => handleChange('requester_document', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.requester_document ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="CPF ou CNPJ"
          />
          {errors.requester_document && <p className="text-red-500 text-xs mt-1">{errors.requester_document}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pendente">Pendente</option>
            <option value="Em Análise">Em Análise</option>
            <option value="Respondido">Respondido</option>
            <option value="Negado">Negado</option>
            <option value="Parcialmente Atendido">Parcialmente Atendido</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assunto *
        </label>
        <input
          type="text"
          value={formData.request_subject}
          onChange={(e) => handleChange('request_subject', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.request_subject ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Assunto da solicitação"
        />
        {errors.request_subject && <p className="text-red-500 text-xs mt-1">{errors.request_subject}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Conteúdo da Solicitação *
        </label>
        <textarea
          value={formData.request_content}
          onChange={(e) => handleChange('request_content', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.request_content ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Descreva detalhadamente as informações solicitadas"
        />
        {errors.request_content && <p className="text-red-500 text-xs mt-1">{errors.request_content}</p>}
      </div>

      {(request || formData.status !== 'Pendente') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resposta
          </label>
          <textarea
            value={formData.response_content}
            onChange={(e) => handleChange('response_content', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Resposta à solicitação (opcional)"
          />
        </div>
      )}

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
          {loading ? 'Salvando...' : request ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
}
