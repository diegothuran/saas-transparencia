'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  CogIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ServerIcon,
  DeviceTabletIcon
} from '@heroicons/react/24/outline';

interface SettingsTab {
  name: string;
  icon: React.ElementType;
  id: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const tabs: SettingsTab[] = [
    { name: 'Geral', icon: CogIcon, id: 'general' },
    { name: 'Instituição', icon: BuildingOfficeIcon, id: 'institution' },
    { name: 'Portal Público', icon: GlobeAltIcon, id: 'portal' },
    { name: 'Aparência', icon: PaintBrushIcon, id: 'appearance' },
    { name: 'Email', icon: EnvelopeIcon, id: 'email' },
    { name: 'Segurança', icon: ShieldCheckIcon, id: 'security' },
    { name: 'Integrações', icon: ServerIcon, id: 'integrations' },
    { name: 'Mobile', icon: DeviceTabletIcon, id: 'mobile' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simular uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    
    // Mostrar mensagem de sucesso (em um sistema real)
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gerencie as configurações do portal de transparência
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <tab.icon className={`h-5 w-5 mr-2 ${
                      activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    {tab.name}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Configurações Gerais</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Configurações básicas do sistema de transparência.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="systemName" className="block text-sm font-medium text-gray-700">
                        Nome do Sistema
                      </label>
                      <input
                        type="text"
                        name="systemName"
                        id="systemName"
                        defaultValue="Portal de Transparência"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                        Email do Administrador
                      </label>
                      <input
                        type="email"
                        name="adminEmail"
                        id="adminEmail"
                        defaultValue="admin@prefeitura.gov.br"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                        Fuso Horário
                      </label>
                      <select
                        id="timezone"
                        name="timezone"
                        defaultValue="America/Sao_Paulo"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="America/Sao_Paulo">América/São Paulo</option>
                        <option value="America/Recife">América/Recife</option>
                        <option value="America/Manaus">América/Manaus</option>
                        <option value="America/Rio_Branco">América/Rio Branco</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                        Formato de Data
                      </label>
                      <select
                        id="dateFormat"
                        name="dateFormat"
                        defaultValue="DD/MM/YYYY"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                      Idioma Padrão
                    </label>
                    <select
                      id="language"
                      name="language"
                      defaultValue="pt-BR"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="pt-BR">Português do Brasil</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="enableMaintenanceMode"
                      name="enableMaintenanceMode"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="enableMaintenanceMode" className="ml-2 block text-sm text-gray-700">
                      Ativar modo de manutenção
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700">
                      Mensagem de Manutenção
                    </label>
                    <textarea
                      id="maintenanceMessage"
                      name="maintenanceMessage"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue="O portal está temporariamente indisponível para manutenção. Por favor, tente novamente mais tarde."
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 ${
                        isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Institution Settings */}
            {activeTab === 'institution' && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Dados da Instituição</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Informações sobre a instituição pública.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="orgName" className="block text-sm font-medium text-gray-700">
                        Nome da Instituição
                      </label>
                      <input
                        type="text"
                        name="orgName"
                        id="orgName"
                        defaultValue="Prefeitura Municipal de Exemplo"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                        CNPJ
                      </label>
                      <input
                        type="text"
                        name="cnpj"
                        id="cnpj"
                        defaultValue="00.000.000/0001-00"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Endereço
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        defaultValue="Rua da Prefeitura, 123 - Centro"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        Cidade/UF
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        defaultValue="Cidade Exemplo/UF"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Telefone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        defaultValue="(00) 0000-0000"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        Website Oficial
                      </label>
                      <input
                        type="text"
                        name="website"
                        id="website"
                        defaultValue="https://www.cidadeexemplo.gov.br"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Logo da Instituição</label>
                    <div className="mt-1 flex items-center">
                      <span className="inline-block h-12 w-12 overflow-hidden rounded-md bg-gray-100">
                        <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
                      </span>
                      <button
                        type="button"
                        className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Alterar
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue="Prefeitura Municipal comprometida com a transparência e o desenvolvimento sustentável."
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 ${
                        isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Portal Settings */}
            {activeTab === 'portal' && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Portal Público</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Configurações do portal público de transparência.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="portalTitle" className="block text-sm font-medium text-gray-700">
                        Título do Portal
                      </label>
                      <input
                        type="text"
                        name="portalTitle"
                        id="portalTitle"
                        defaultValue="Portal da Transparência - Cidade Exemplo"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="portalDomain" className="block text-sm font-medium text-gray-700">
                        Domínio
                      </label>
                      <input
                        type="text"
                        name="portalDomain"
                        id="portalDomain"
                        defaultValue="transparencia.cidadeexemplo.gov.br"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
                      Meta Descrição (SEO)
                    </label>
                    <textarea
                      id="metaDescription"
                      name="metaDescription"
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue="Portal oficial de transparência da Prefeitura Municipal de Cidade Exemplo. Acompanhe receitas, despesas e informações públicas."
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700">
                      Mensagem de Boas-vindas
                    </label>
                    <textarea
                      id="welcomeMessage"
                      name="welcomeMessage"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue="Bem-vindo ao Portal da Transparência. Aqui você encontra todas as informações sobre a gestão municipal, conforme determinado pela Lei de Acesso à Informação."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700">
                        Itens por Página
                      </label>
                      <select
                        id="itemsPerPage"
                        name="itemsPerPage"
                        defaultValue="20"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="dataUpdateInterval" className="block text-sm font-medium text-gray-700">
                        Intervalo de Atualização de Dados
                      </label>
                      <select
                        id="dataUpdateInterval"
                        name="dataUpdateInterval"
                        defaultValue="daily"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="hourly">A cada hora</option>
                        <option value="daily">Diário</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <fieldset>
                      <legend className="text-sm font-medium text-gray-700">Módulos Visíveis</legend>
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                        <div className="flex items-center">
                          <input
                            id="module-receipts"
                            name="modules"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="module-receipts" className="ml-2 block text-sm text-gray-700">
                            Receitas
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="module-expenses"
                            name="modules"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="module-expenses" className="ml-2 block text-sm text-gray-700">
                            Despesas
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="module-contracts"
                            name="modules"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="module-contracts" className="ml-2 block text-sm text-gray-700">
                            Contratos
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="module-bids"
                            name="modules"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="module-bids" className="ml-2 block text-sm text-gray-700">
                            Licitações
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="module-esic"
                            name="modules"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="module-esic" className="ml-2 block text-sm text-gray-700">
                            e-SIC
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="module-employees"
                            name="modules"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="module-employees" className="ml-2 block text-sm text-gray-700">
                            Servidores
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 ${
                        isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Placeholder for other tabs */}
            {activeTab !== 'general' && activeTab !== 'institution' && activeTab !== 'portal' && (
              <div className="py-10 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h3>
                <p className="text-gray-500">
                  Esta seção está em desenvolvimento.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
