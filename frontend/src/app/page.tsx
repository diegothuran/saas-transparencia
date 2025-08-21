'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  InformationCircleIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalRevenues: 0,
    totalExpenses: 0,
    activeContracts: 0,
    esicRequests: 0
  });

  // Dados simulados do município
  const tenantData = {
    name: 'Prefeitura Municipal de Exemplo',
    logo_url: undefined,
    primary_color: '#1976d2',
    email: 'contato@exemplo.gov.br',
    phone: '(11) 1234-5678',
    address: 'Rua Principal, 123',
    city: 'Exemplo',
    state: 'SP',
    website: 'https://exemplo.gov.br',
    lai_email: 'lai@exemplo.gov.br',
    ouvidoria_email: 'ouvidoria@exemplo.gov.br'
  };

  useEffect(() => {
    // Simular carregamento de estatísticas
    setStats({
      totalRevenues: 15420000,
      totalExpenses: 12350000,
      activeContracts: 45,
      esicRequests: 23
    });
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const quickLinks = [
    {
      title: 'Receitas',
      description: 'Consulte todas as receitas municipais',
      icon: CurrencyDollarIcon,
      href: '/receitas',
      color: 'bg-green-500'
    },
    {
      title: 'Despesas',
      description: 'Acompanhe os gastos públicos em tempo real',
      icon: ChartBarIcon,
      href: '/despesas',
      color: 'bg-red-500'
    },
    {
      title: 'Licitações',
      description: 'Processos licitatórios e contratos',
      icon: DocumentTextIcon,
      href: '/licitacoes',
      color: 'bg-blue-500'
    },
    {
      title: 'Servidores',
      description: 'Informações sobre recursos humanos',
      icon: UsersIcon,
      href: '/servidores',
      color: 'bg-purple-500'
    },
    {
      title: 'Estrutura',
      description: 'Organização administrativa',
      icon: BuildingOfficeIcon,
      href: '/estrutura',
      color: 'bg-indigo-500'
    },
    {
      title: 'e-SIC',
      description: 'Serviço de Informação ao Cidadão',
      icon: InformationCircleIcon,
      href: '/esic',
      color: 'bg-orange-500'
    }
  ];

  const legalLinks = [
    {
      title: 'Lei de Acesso à Informação',
      description: 'Lei nº 12.527/2011',
      href: '/lai'
    },
    {
      title: 'Lei da Transparência',
      description: 'Lei Complementar nº 131/2009',
      href: '/transparencia'
    },
    {
      title: 'Dados Abertos',
      description: 'Downloads em formatos abertos',
      href: '/dados-abertos'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header tenantData={tenantData} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Transparência Pública
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Acesse informações sobre gastos públicos, licitações, contratos e muito mais
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar informações, fornecedores, contratos..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors">
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Receitas (2024)</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(stats.totalRevenues)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-red-600">Despesas (2024)</p>
                  <p className="text-2xl font-bold text-red-900">
                    {formatCurrency(stats.totalExpenses)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">Contratos Ativos</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats.activeContracts}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center">
                <InformationCircleIcon className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-orange-600">Pedidos e-SIC</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {stats.esicRequests}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Acesso Rápido
            </h3>
            <p className="text-lg text-gray-600">
              Encontre rapidamente as informações que você precisa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 group"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${link.color}`}>
                    <link.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="ml-4 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                    {link.title}
                  </h4>
                </div>
                <p className="text-gray-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Compliance */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Conformidade Legal
            </h3>
            <p className="text-lg text-gray-600">
              Este portal atende integralmente à legislação brasileira
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {legalLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {link.title}
                </h4>
                <p className="text-gray-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer tenantData={tenantData} />
    </div>
  );
}

