'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitting(false);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <EnvelopeIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Fale Conosco</h1>
                <p className="text-gray-600">
                  Entre em contato com a nossa equipe
                </p>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500">
              <span>Início</span> / <span className="text-gray-900">Contato</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact information */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Informações de Contato</h3>
                </div>
                <div className="px-6 py-5">
                  <dl className="space-y-6">
                    <div>
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <MapPinIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <dt className="text-sm font-medium text-gray-900">Endereço</dt>
                          <dd className="mt-1 text-sm text-gray-600">
                            Rua da Prefeitura, 123<br />
                            Centro, Cidade Exemplo - UF<br />
                            CEP: 00000-000
                          </dd>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <PhoneIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <dt className="text-sm font-medium text-gray-900">Telefone</dt>
                          <dd className="mt-1 text-sm text-gray-600">
                            <a href="tel:+550000000000" className="text-blue-600 hover:text-blue-500">
                              (00) 0000-0000
                            </a>
                          </dd>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <EnvelopeIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <dt className="text-sm font-medium text-gray-900">E-mail</dt>
                          <dd className="mt-1 text-sm text-gray-600">
                            <a href="mailto:contato@municipio.gov.br" className="text-blue-600 hover:text-blue-500">
                              contato@municipio.gov.br
                            </a>
                          </dd>
                        </div>
                      </div>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Horário de Atendimento</h3>
                </div>
                <div className="px-6 py-5">
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-900">Segunda a Sexta</dt>
                      <dd className="text-sm text-gray-600">8h às 17h</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-900">Sábado</dt>
                      <dd className="text-sm text-gray-600">Fechado</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-900">Domingo</dt>
                      <dd className="text-sm text-gray-600">Fechado</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Formulário de Contato</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Preencha o formulário abaixo para entrar em contato conosco. Responderemos o mais breve possível.
                  </p>
                </div>
                
                <div className="px-6 py-5">
                  {submitted ? (
                    <div className="text-center py-10">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <PaperAirplaneIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="mt-3 text-lg font-medium text-gray-900">Mensagem enviada com sucesso!</h3>
                      <p className="mt-2 text-sm text-gray-600">
                        Agradecemos seu contato. Nossa equipe responderá em breve.
                      </p>
                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={() => setSubmitted(false)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Enviar nova mensagem
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nome *
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
                              placeholder="Seu nome"
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
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Telefone
                          </label>
                          <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <PhoneIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="tel"
                              name="phone"
                              id="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="(00) 00000-0000"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                            Assunto *
                          </label>
                          <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                              id="subject"
                              name="subject"
                              required
                              value={formData.subject}
                              onChange={handleChange}
                              className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="">Selecione um assunto</option>
                              <option value="Informações Gerais">Informações Gerais</option>
                              <option value="Dúvidas">Dúvidas</option>
                              <option value="Reclamações">Reclamações</option>
                              <option value="Sugestões">Sugestões</option>
                              <option value="Elogios">Elogios</option>
                              <option value="Outro">Outro</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                          Mensagem *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          required
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Digite sua mensagem aqui"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        ></textarea>
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
                          Concordo com a <a href="/privacidade" className="text-blue-600 hover:text-blue-500">Política de Privacidade</a>
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
                              <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                              <span>Enviar Mensagem</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Map section */}
          <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Localização</h3>
              <p className="mt-1 text-sm text-gray-600">
                Encontre-nos facilmente através do mapa abaixo
              </p>
            </div>
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="mt-2 text-sm text-gray-600">
                  Mapa indisponível no momento. Visualize nosso endereço acima.
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
