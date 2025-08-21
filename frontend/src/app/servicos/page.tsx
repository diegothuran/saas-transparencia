'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  WrenchIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  secretaria: string;
  tempoEstimado?: string;
  custo?: string;
  requisitos?: string[];
  etapas?: string[];
  documentos?: string[];
  urlExterna?: string;
  online: boolean;
}

// Dados de exemplo para serviços
const SERVICOS: Servico[] = [
  {
    id: '1',
    nome: 'Emissão de Certidão Negativa de Débitos Municipais',
    descricao: 'Documento que comprova a inexistência de débitos municipais como IPTU, ISS e taxas diversas.',
    categoria: 'Tributos',
    secretaria: 'Secretaria da Fazenda',
    tempoEstimado: 'Imediato (online) ou até 3 dias úteis (presencial)',
    custo: 'Gratuito',
    requisitos: [
      'Ser proprietário do imóvel ou responsável legal',
      'Estar em dia com os tributos municipais'
    ],
    documentos: [
      'Documento de identificação com foto (RG ou CNH)',
      'CPF',
      'Comprovante de residência'
    ],
    online: true,
    urlExterna: '#'
  },
  {
    id: '2',
    nome: 'Alvará de Funcionamento',
    descricao: 'Licença que autoriza o funcionamento de estabelecimentos comerciais, industriais e prestadores de serviço.',
    categoria: 'Empresas',
    secretaria: 'Secretaria de Planejamento',
    tempoEstimado: 'Até 15 dias úteis',
    custo: 'Variável conforme o tipo e tamanho do estabelecimento',
    requisitos: [
      'CNPJ ativo',
      'Inscrição Municipal',
      'Aprovação prévia do Corpo de Bombeiros',
      'Aprovação da Vigilância Sanitária (quando aplicável)'
    ],
    documentos: [
      'Requerimento preenchido',
      'Contrato Social',
      'CNPJ',
      'Documento do imóvel (contrato de locação ou escritura)',
      'Auto de Vistoria do Corpo de Bombeiros',
      'Licença sanitária (quando aplicável)'
    ],
    online: false
  },
  {
    id: '3',
    nome: 'Matrícula Escolar',
    descricao: 'Inscrição de crianças e adolescentes nas escolas municipais de ensino fundamental e educação infantil.',
    categoria: 'Educação',
    secretaria: 'Secretaria de Educação',
    tempoEstimado: 'Imediato',
    custo: 'Gratuito',
    requisitos: [
      'Criança em idade escolar (4 a 14 anos)',
      'Residência no município'
    ],
    documentos: [
      'Certidão de nascimento da criança',
      'RG e CPF do responsável',
      'Comprovante de residência',
      'Carteira de vacinação atualizada',
      'Histórico escolar (para transferências)'
    ],
    online: true,
    urlExterna: '#'
  },
  {
    id: '4',
    nome: 'Marcação de Consultas',
    descricao: 'Agendamento de consultas médicas nas unidades básicas de saúde e especialidades disponíveis na rede municipal.',
    categoria: 'Saúde',
    secretaria: 'Secretaria de Saúde',
    tempoEstimado: 'Imediato (agendamento)',
    custo: 'Gratuito',
    requisitos: [
      'Ser residente no município',
      'Possuir Cartão do SUS'
    ],
    documentos: [
      'Cartão do SUS',
      'Documento de identificação com foto',
      'Encaminhamento médico (para especialidades)'
    ],
    online: true,
    urlExterna: '#'
  },
  {
    id: '5',
    nome: 'Licença para Construção',
    descricao: 'Autorização para construção, reforma ou ampliação de imóveis no município.',
    categoria: 'Obras e Urbanismo',
    secretaria: 'Secretaria de Obras e Infraestrutura',
    tempoEstimado: 'Até 30 dias úteis',
    custo: 'Variável conforme a área construída',
    requisitos: [
      'Projeto arquitetônico assinado por profissional habilitado',
      'ART ou RRT do responsável técnico',
      'Imóvel regularizado'
    ],
    documentos: [
      'Requerimento preenchido',
      'Escritura do terreno ou contrato de compra e venda',
      'Projeto arquitetônico (3 vias)',
      'Memorial descritivo',
      'ART ou RRT de projeto e execução',
      'Certidão negativa de débitos do imóvel'
    ],
    online: false
  },
  {
    id: '6',
    nome: 'Emissão de Guia de IPTU',
    descricao: 'Emissão de guias para pagamento do Imposto Predial e Territorial Urbano.',
    categoria: 'Tributos',
    secretaria: 'Secretaria da Fazenda',
    tempoEstimado: 'Imediato',
    custo: 'Gratuito',
    requisitos: [
      'Ser proprietário ou responsável pelo imóvel'
    ],
    documentos: [
      'Número de inscrição do imóvel ou endereço completo',
      'Documento de identificação do proprietário'
    ],
    online: true,
    urlExterna: '#'
  },
  {
    id: '7',
    nome: 'Coleta de Entulhos',
    descricao: 'Serviço de coleta de resíduos de construção civil e entulhos.',
    categoria: 'Meio Ambiente',
    secretaria: 'Secretaria de Meio Ambiente',
    tempoEstimado: 'Até 5 dias úteis após o agendamento',
    custo: 'Variável conforme o volume',
    requisitos: [
      'Agendamento prévio',
      'Respeitar o limite de volume estabelecido'
    ],
    documentos: [
      'Comprovante de residência',
      'Documento de identificação'
    ],
    online: true,
    urlExterna: '#'
  },
  {
    id: '8',
    nome: 'Cadastro Único para Programas Sociais',
    descricao: 'Cadastramento de famílias de baixa renda para acesso aos programas sociais do governo.',
    categoria: 'Assistência Social',
    secretaria: 'Secretaria de Assistência Social',
    tempoEstimado: 'Imediato (cadastro) / Até 90 dias (análise)',
    custo: 'Gratuito',
    requisitos: [
      'Família com renda per capita de até meio salário mínimo',
      'Residência no município'
    ],
    documentos: [
      'RG e CPF de todos os membros da família',
      'Certidão de nascimento (crianças e adolescentes)',
      'Comprovante de residência',
      'Comprovantes de renda',
      'Declaração escolar (crianças e adolescentes)'
    ],
    online: false
  }
];

// Lista de categorias para filtro
const CATEGORIAS = [
  'Todas',
  'Tributos',
  'Empresas',
  'Educação',
  'Saúde',
  'Obras e Urbanismo',
  'Meio Ambiente',
  'Assistência Social'
];

export default function ServicosPage() {
  const [filtros, setFiltros] = useState({
    termo: '',
    categoria: 'Todas',
    online: 'todos'
  });
  const [carregando, setCarregando] = useState(false);

  // Filtrar serviços com base nos filtros aplicados
  const servicosFiltrados = SERVICOS.filter(servico => {
    // Filtro por termo de busca
    if (filtros.termo && 
        !servico.nome.toLowerCase().includes(filtros.termo.toLowerCase()) && 
        !servico.descricao.toLowerCase().includes(filtros.termo.toLowerCase())) {
      return false;
    }
    
    // Filtro por categoria
    if (filtros.categoria !== 'Todas' && servico.categoria !== filtros.categoria) {
      return false;
    }
    
    // Filtro por disponibilidade online
    if (filtros.online === 'online' && !servico.online) {
      return false;
    }
    
    if (filtros.online === 'presencial' && servico.online) {
      return false;
    }
    
    return true;
  });

  // Ordenar serviços por nome
  const servicosOrdenados = [...servicosFiltrados].sort((a, b) => a.nome.localeCompare(b.nome));

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFiltros({
      termo: '',
      categoria: 'Todas',
      online: 'todos'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    
    // Simular tempo de busca
    setTimeout(() => {
      setCarregando(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Cabeçalho da página */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <WrenchIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
                <p className="text-gray-600">
                  Consulte os serviços oferecidos pela prefeitura aos cidadãos e empresas
                </p>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500">
              <span>Início</span> / <span className="text-gray-900">Serviços</span>
            </nav>
          </div>
          
          {/* Filtros */}
          <div className="mb-8 bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Filtrar Serviços</h3>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="termo" className="block text-sm font-medium text-gray-700 mb-1">
                      Buscar serviço
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="termo"
                        id="termo"
                        placeholder="Nome ou descrição do serviço"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={filtros.termo}
                        onChange={handleFiltroChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria
                    </label>
                    <select
                      id="categoria"
                      name="categoria"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={filtros.categoria}
                      onChange={handleFiltroChange}
                    >
                      {CATEGORIAS.map(categoria => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="online" className="block text-sm font-medium text-gray-700 mb-1">
                      Disponibilidade
                    </label>
                    <select
                      id="online"
                      name="online"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={filtros.online}
                      onChange={handleFiltroChange}
                    >
                      <option value="todos">Todos os serviços</option>
                      <option value="online">Disponível online</option>
                      <option value="presencial">Somente presencial</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                  >
                    Limpar Filtros
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {carregando ? (
                      <>
                        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <MagnifyingGlassIcon className="-ml-1 mr-2 h-5 w-5" />
                        Buscar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Resultados */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {servicosOrdenados.length} {servicosOrdenados.length === 1 ? 'serviço encontrado' : 'serviços encontrados'}
              </h3>
            </div>
            
            {servicosOrdenados.length === 0 ? (
              <div className="text-center py-12 bg-white shadow-sm rounded-lg">
                <WrenchIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum serviço encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tente modificar seus filtros de pesquisa para encontrar o que procura.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {servicosOrdenados.map((servico) => (
                  <div
                    key={servico.id}
                    className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {servico.nome}
                        </h3>
                        {servico.online && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Disponível online
                          </span>
                        )}
                      </div>
                      
                      <p className="mt-2 text-gray-600">
                        {servico.descricao}
                      </p>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{servico.secretaria}</span>
                        </div>
                        
                        {servico.tempoEstimado && (
                          <div className="flex items-center">
                            <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">Prazo: {servico.tempoEstimado}</span>
                          </div>
                        )}
                        
                        {servico.custo && (
                          <div className="flex items-center">
                            <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">Custo: {servico.custo}</span>
                          </div>
                        )}
                      </div>
                      
                      <details className="mt-4">
                        <summary className="text-sm font-medium text-blue-600 cursor-pointer">
                          Ver detalhes e requisitos
                        </summary>
                        
                        <div className="mt-4 space-y-4">
                          {servico.requisitos && servico.requisitos.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Requisitos:</h4>
                              <ul className="mt-2 list-disc list-inside text-sm text-gray-600 space-y-1">
                                {servico.requisitos.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {servico.documentos && servico.documentos.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Documentos necessários:</h4>
                              <ul className="mt-2 list-disc list-inside text-sm text-gray-600 space-y-1">
                                {servico.documentos.map((doc, index) => (
                                  <li key={index} className="flex items-start">
                                    <DocumentTextIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                                    <span>{doc}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {servico.etapas && servico.etapas.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Etapas do serviço:</h4>
                              <ol className="mt-2 list-decimal list-inside text-sm text-gray-600 space-y-1">
                                {servico.etapas.map((etapa, index) => (
                                  <li key={index}>{etapa}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>
                      </details>
                      
                      <div className="mt-6 flex flex-wrap gap-2">
                        {servico.online && servico.urlExterna && (
                          <Link
                            href={servico.urlExterna}
                            target="_blank"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Acessar serviço online
                            <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
                          </Link>
                        )}
                        
                        <Link
                          href={`/servicos/${servico.id}`}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                          Instruções completas
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-12 bg-blue-50 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">Precisa de ajuda?</h3>
              </div>
              
              <p className="mt-2 text-gray-600">
                Nossa equipe de atendimento está disponível para auxiliar com informações sobre os serviços municipais.
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/contato"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Entrar em contato
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
