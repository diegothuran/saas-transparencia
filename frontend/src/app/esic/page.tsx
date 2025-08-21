'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  InformationCircleIcon,
  DocumentTextIcon,
  ArrowRightCircleIcon,
  UserCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';

export default function ESICPage() {
  const [activeTab, setActiveTab] = useState('solicitar');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    document: '',
    subject: '',
    description: '',
    attachment: null as File | null
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        attachment: e.target.files[0]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simular envio de solicitação
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('Solicitação enviada com sucesso! Você receberá um número de protocolo por e-mail.');
    
    setFormData({
      name: '',
      email: '',
      document: '',
      subject: '',
      description: '',
      attachment: null
    });
    
    setSubmitting(false);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Funcionalidade de acompanhamento em desenvolvimento.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <InformationCircleIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Serviço de Informação ao Cidadão (e-SIC)</h1>
                <p className="text-gray-600">
                  Solicite e acompanhe pedidos de informação ao órgão público
                </p>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500">
              <span>Início</span> / <span className="text-gray-900">e-SIC</span>
            </nav>
          </div>

          {/* Info box */}
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  O que é o e-SIC?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    O Serviço de Informação ao Cidadão (e-SIC) permite que qualquer pessoa, física ou jurídica,
                    encaminhe pedidos de acesso à informação para órgãos e entidades do Poder Executivo Municipal.
                    Por meio do sistema, além de fazer o pedido, é possível acompanhar o prazo de resposta,
                    receber a resposta e entrar com recursos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('solicitar')}
                  className={`px-6 py-4 text-center border-b-2 font-medium text-sm sm:text-base ${
                    activeTab === 'solicitar'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Fazer Solicitação
                </button>
                <button
                  onClick={() => setActiveTab('acompanhar')}
                  className={`px-6 py-4 text-center border-b-2 font-medium text-sm sm:text-base ${
                    activeTab === 'acompanhar'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Acompanhar Solicitação
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`px-6 py-4 text-center border-b-2 font-medium text-sm sm:text-base ${
                    activeTab === 'faq'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Perguntas Frequentes
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Solicitation Form */}
              {activeTab === 'solicitar' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Faça sua Solicitação de Informação
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Preencha o formulário abaixo para solicitar informações ao órgão público.
                      As respostas serão enviadas para o e-mail informado.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nome Completo *
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserCircleIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Seu nome completo"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        E-mail *
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="seu.email@exemplo.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="document" className="block text-sm font-medium text-gray-700">
                        CPF/CNPJ *
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IdentificationIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="document"
                          id="document"
                          required
                          value={formData.document}
                          onChange={handleChange}
                          className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                        Assunto *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Selecione um assunto</option>
                        <option value="Orçamento">Orçamento e Finanças</option>
                        <option value="Contratos">Contratos e Licitações</option>
                        <option value="Obras">Obras e Infraestrutura</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Educação">Educação</option>
                        <option value="Servidores">Servidores Públicos</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Descrição da Solicitação *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={5}
                      required
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Descreva de forma clara e objetiva a informação que você deseja obter"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">
                      Seja específico em sua solicitação para que possamos fornecer a informação correta.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Anexo (opcional)
                    </label>
                    <div className="mt-1">
                      <input
                        type="file"
                        id="attachment"
                        name="attachment"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Formatos aceitos: PDF, DOC, DOCX, JPG, PNG (máx. 5MB)
                    </p>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="privacy-policy"
                      name="privacy-policy"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="privacy-policy" className="ml-2 block text-sm text-gray-900">
                      Concordo com a <a href="/privacidade" className="text-blue-600 hover:text-blue-500">Política de Privacidade</a> e com o tratamento dos meus dados pessoais
                    </label>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <ArrowRightCircleIcon className="h-5 w-5 mr-2" />
                          <span>Enviar Solicitação</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Track Request */}
              {activeTab === 'acompanhar' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Acompanhe sua Solicitação
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Informe o protocolo e e-mail cadastrados para consultar o status da sua solicitação.
                  </p>

                  <form onSubmit={handleTrackSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="protocol" className="block text-sm font-medium text-gray-700">
                          Número do Protocolo
                        </label>
                        <div className="mt-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="protocol"
                            name="protocol"
                            required
                            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Ex: 2024.000123"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="track-email" className="block text-sm font-medium text-gray-700">
                          E-mail
                        </label>
                        <div className="mt-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="track-email"
                            name="email"
                            required
                            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="E-mail utilizado na solicitação"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        type="submit"
                        className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <LockClosedIcon className="h-5 w-5 mr-2" />
                        Consultar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* FAQ */}
              {activeTab === 'faq' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Perguntas Frequentes
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">
                        1. O que é o e-SIC?
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        O Serviço de Informação ao Cidadão (e-SIC) é o sistema que permite que qualquer pessoa, 
                        física ou jurídica, encaminhe pedidos de acesso à informação para órgãos e entidades do 
                        Poder Executivo Municipal, conforme determina a Lei de Acesso à Informação (Lei nº 12.527/2011).
                      </p>
                    </div>

                    <div>
                      <h4 className="text-base font-medium text-gray-900">
                        2. Qual o prazo para resposta?
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        O prazo para resposta é de até 20 (vinte) dias, prorrogável por mais 10 (dez) dias, 
                        mediante justificativa expressa, da qual será cientificado o requerente.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-base font-medium text-gray-900">
                        3. Posso recorrer caso não esteja satisfeito com a resposta?
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Sim. Caso não concorde com a resposta, você pode apresentar um recurso no prazo de 10 (dez) 
                        dias a contar da ciência da decisão. O recurso será dirigido à autoridade hierarquicamente 
                        superior à que adotou a decisão.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-base font-medium text-gray-900">
                        4. Quais informações posso solicitar?
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Você pode solicitar qualquer informação pública produzida ou custodiada pelo município 
                        que não esteja classificada como sigilosa. Exemplos: gastos públicos, contratos, licitações, 
                        programas, projetos, etc.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-base font-medium text-gray-900">
                        5. Quais informações não podem ser fornecidas?
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Informações pessoais, informações classificadas como sigilosas conforme legislação específica 
                        (como sigilo fiscal, bancário, industrial), e pedidos genéricos, desproporcionais ou que 
                        exijam trabalhos adicionais de análise, interpretação ou consolidação de dados que não sejam 
                        de competência do órgão ou entidade.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legal compliance note */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Sobre o Direito de Acesso à Informação
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    O acesso à informação é um direito garantido pela Constituição Federal e regulamentado 
                    pela Lei nº 12.527/2011, conhecida como Lei de Acesso à Informação (LAI). A LAI estabelece 
                    que qualquer pessoa, física ou jurídica, pode solicitar e receber informações públicas dos 
                    órgãos e entidades públicas, sem necessidade de apresentar motivo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
