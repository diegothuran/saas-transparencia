'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Licitacao {
  id: string;
  numero: string;
  modalidade: string;
  objeto: string;
  dataPublicacao: string;
  dataAbertura: string;
  situacao: string;
  secretaria: string;
  valorEstimado: string;
  arquivos?: {
    nome: string;
    tipo: string;
    tamanho: string;
    url: string;
  }[];
}

const TIPOS_LICITACAO = [
  { id: 'todas', nome: 'Todas' },
  { id: 'pregao', nome: 'Pregão Eletrônico' },
  { id: 'concorrencia', nome: 'Concorrência' },
  { id: 'tomada', nome: 'Tomada de Preços' },
  { id: 'convite', nome: 'Convite' },
  { id: 'leilao', nome: 'Leilão' },
  { id: 'dispensa', nome: 'Dispensa' },
  { id: 'inexigibilidade', nome: 'Inexigibilidade' }
];

const SITUACOES = [
  { id: 'todas', nome: 'Todas' },
  { id: 'aberta', nome: 'Aberta' },
  { id: 'encerrada', nome: 'Encerrada' },
  { id: 'suspensa', nome: 'Suspensa' },
  { id: 'anulada', nome: 'Anulada' },
  { id: 'revogada', nome: 'Revogada' }
];

// Dados de exemplo para licitações
const LICITACOES: Licitacao[] = [
  {
    id: '1',
    numero: '001/2023',
    modalidade: 'Pregão Eletrônico',
    objeto: 'Aquisição de materiais de escritório para as secretarias municipais',
    dataPublicacao: '2023-03-15',
    dataAbertura: '2023-04-01',
    situacao: 'Encerrada',
    secretaria: 'Administração',
    valorEstimado: 'R$ 50.000,00',
    arquivos: [
      {
        nome: 'Edital_001_2023.pdf',
        tipo: 'PDF',
        tamanho: '2.3 MB',
        url: '#'
      },
      {
        nome: 'Anexos_001_2023.zip',
        tipo: 'ZIP',
        tamanho: '5.1 MB',
        url: '#'
      },
      {
        nome: 'Ata_Julgamento_001_2023.pdf',
        tipo: 'PDF',
        tamanho: '1.7 MB',
        url: '#'
      }
    ]
  },
  {
    id: '2',
    numero: '002/2023',
    modalidade: 'Concorrência',
    objeto: 'Contratação de empresa especializada para pavimentação asfáltica de vias públicas',
    dataPublicacao: '2023-04-10',
    dataAbertura: '2023-05-10',
    situacao: 'Aberta',
    secretaria: 'Obras e Infraestrutura',
    valorEstimado: 'R$ 2.500.000,00',
    arquivos: [
      {
        nome: 'Edital_002_2023.pdf',
        tipo: 'PDF',
        tamanho: '8.5 MB',
        url: '#'
      },
      {
        nome: 'Projeto_Basico_002_2023.pdf',
        tipo: 'PDF',
        tamanho: '15.2 MB',
        url: '#'
      }
    ]
  },
  {
    id: '3',
    numero: '003/2023',
    modalidade: 'Tomada de Preços',
    objeto: 'Reforma e ampliação da Unidade Básica de Saúde do Bairro Central',
    dataPublicacao: '2023-05-05',
    dataAbertura: '2023-06-05',
    situacao: 'Aberta',
    secretaria: 'Saúde',
    valorEstimado: 'R$ 850.000,00',
    arquivos: [
      {
        nome: 'Edital_003_2023.pdf',
        tipo: 'PDF',
        tamanho: '5.7 MB',
        url: '#'
      }
    ]
  },
  {
    id: '4',
    numero: '004/2023',
    modalidade: 'Pregão Eletrônico',
    objeto: 'Aquisição de medicamentos para a Farmácia Básica Municipal',
    dataPublicacao: '2023-02-10',
    dataAbertura: '2023-03-10',
    situacao: 'Encerrada',
    secretaria: 'Saúde',
    valorEstimado: 'R$ 320.000,00',
    arquivos: [
      {
        nome: 'Edital_004_2023.pdf',
        tipo: 'PDF',
        tamanho: '3.2 MB',
        url: '#'
      },
      {
        nome: 'Resultado_004_2023.pdf',
        tipo: 'PDF',
        tamanho: '1.5 MB',
        url: '#'
      }
    ]
  },
  {
    id: '5',
    numero: '005/2023',
    modalidade: 'Dispensa',
    objeto: 'Contratação emergencial de serviços de limpeza urbana',
    dataPublicacao: '2023-06-01',
    dataAbertura: '2023-06-05',
    situacao: 'Encerrada',
    secretaria: 'Meio Ambiente',
    valorEstimado: 'R$ 75.000,00',
    arquivos: [
      {
        nome: 'Justificativa_005_2023.pdf',
        tipo: 'PDF',
        tamanho: '1.1 MB',
        url: '#'
      },
      {
        nome: 'Contrato_005_2023.pdf',
        tipo: 'PDF',
        tamanho: '2.3 MB',
        url: '#'
      }
    ]
  }
];

export default function LicitacoesPage() {
  const [filtros, setFiltros] = useState({
    termo: '',
    modalidade: 'todas',
    situacao: 'todas',
    ano: '',
    secretaria: ''
  });
  const [expandidoId, setExpandidoId] = useState<string | null>(null);
  const [ordenacao, setOrdenacao] = useState('dataPublicacao');
  const [carregando, setCarregando] = useState(false);

  // Função para filtrar as licitações
  const licitacoesFiltradas = LICITACOES.filter(licitacao => {
    // Filtro por termo de busca
    if (filtros.termo && 
        !licitacao.objeto.toLowerCase().includes(filtros.termo.toLowerCase()) && 
        !licitacao.numero.toLowerCase().includes(filtros.termo.toLowerCase())) {
      return false;
    }
    
    // Filtro por modalidade
    if (filtros.modalidade !== 'todas' && 
        !licitacao.modalidade.toLowerCase().includes(filtros.modalidade.toLowerCase())) {
      return false;
    }
    
    // Filtro por situação
    if (filtros.situacao !== 'todas' && 
        licitacao.situacao.toLowerCase() !== filtros.situacao.toLowerCase()) {
      return false;
    }
    
    // Filtro por ano
    if (filtros.ano && !licitacao.dataPublicacao.includes(filtros.ano)) {
      return false;
    }
    
    // Filtro por secretaria
    if (filtros.secretaria && 
        !licitacao.secretaria.toLowerCase().includes(filtros.secretaria.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Ordenação de licitações
  const licitacoesOrdenadas = [...licitacoesFiltradas].sort((a, b) => {
    if (ordenacao === 'dataPublicacao') {
      return new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime();
    } else if (ordenacao === 'dataAbertura') {
      return new Date(a.dataAbertura).getTime() - new Date(b.dataAbertura).getTime();
    } else if (ordenacao === 'numero') {
      return a.numero.localeCompare(b.numero);
    }
    return 0;
  });

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
      modalidade: 'todas',
      situacao: 'todas',
      ano: '',
      secretaria: ''
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

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  const toggleDetalhes = (id: string) => {
    if (expandidoId === id) {
      setExpandidoId(null);
    } else {
      setExpandidoId(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Cabeçalho da página */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Licitações</h1>
                <p className="text-gray-600">
                  Consulte todas as licitações e contratos realizados pelo município
                </p>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500">
              <span>Início</span> / <span className="text-gray-900">Licitações</span>
            </nav>
          </div>
          
          {/* Filtros */}
          <div className="mb-8 bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Filtrar Licitações</h3>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label htmlFor="termo" className="block text-sm font-medium text-gray-700 mb-1">
                      Termo de pesquisa
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="termo"
                        id="termo"
                        placeholder="Número ou objeto da licitação"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={filtros.termo}
                        onChange={handleFiltroChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="modalidade" className="block text-sm font-medium text-gray-700 mb-1">
                      Modalidade
                    </label>
                    <select
                      id="modalidade"
                      name="modalidade"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={filtros.modalidade}
                      onChange={handleFiltroChange}
                    >
                      {TIPOS_LICITACAO.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="situacao" className="block text-sm font-medium text-gray-700 mb-1">
                      Situação
                    </label>
                    <select
                      id="situacao"
                      name="situacao"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={filtros.situacao}
                      onChange={handleFiltroChange}
                    >
                      {SITUACOES.map(situacao => (
                        <option key={situacao.id} value={situacao.id}>
                          {situacao.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="ano" className="block text-sm font-medium text-gray-700 mb-1">
                      Ano
                    </label>
                    <select
                      id="ano"
                      name="ano"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={filtros.ano}
                      onChange={handleFiltroChange}
                    >
                      <option value="">Todos</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="secretaria" className="block text-sm font-medium text-gray-700 mb-1">
                      Secretaria
                    </label>
                    <input
                      type="text"
                      name="secretaria"
                      id="secretaria"
                      placeholder="Secretaria responsável"
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={filtros.secretaria}
                      onChange={handleFiltroChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="ordenacao" className="block text-sm font-medium text-gray-700 mb-1">
                      Ordenar por
                    </label>
                    <select
                      id="ordenacao"
                      name="ordenacao"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={ordenacao}
                      onChange={(e) => setOrdenacao(e.target.value)}
                    >
                      <option value="dataPublicacao">Data de Publicação (mais recente)</option>
                      <option value="dataAbertura">Data de Abertura (próximas)</option>
                      <option value="numero">Número da Licitação</option>
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
                {licitacoesOrdenadas.length} {licitacoesOrdenadas.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </h3>
            </div>
            
            {licitacoesOrdenadas.length === 0 ? (
              <div className="text-center py-12 bg-white shadow-sm rounded-lg">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma licitação encontrada</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tente modificar seus filtros de pesquisa para encontrar o que procura.
                </p>
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {licitacoesOrdenadas.map((licitacao) => (
                    <li key={licitacao.id} className="px-6 py-5">
                      <div>
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              licitacao.situacao === 'Aberta' ? 'bg-green-100 text-green-800' :
                              licitacao.situacao === 'Encerrada' ? 'bg-gray-100 text-gray-800' :
                              licitacao.situacao === 'Suspensa' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {licitacao.situacao}
                            </span>
                            <span className="ml-3 text-sm text-gray-500">
                              {licitacao.modalidade}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => toggleDetalhes(licitacao.id)}
                            className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                          >
                            {expandidoId === licitacao.id ? 'Menos detalhes' : 'Ver detalhes'}
                            <ChevronDownIcon
                              className={`ml-1 h-5 w-5 transform transition-transform ${
                                expandidoId === licitacao.id ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>
                        
                        <h4 className="mt-2 text-lg font-medium">
                          <Link href={`/licitacoes/${licitacao.id}`} className="text-blue-600 hover:underline">
                            Licitação {licitacao.numero}
                          </Link>
                        </h4>
                        
                        <p className="mt-2 text-sm text-gray-700">{licitacao.objeto}</p>
                        
                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <span>Publicação: {formatarData(licitacao.dataPublicacao)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <span>Abertura: {formatarData(licitacao.dataAbertura)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <BuildingOfficeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <span>{licitacao.secretaria}</span>
                          </div>
                        </div>
                        
                        {expandidoId === licitacao.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                              <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Valor Estimado</dt>
                                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                  <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                  {licitacao.valorEstimado}
                                </dd>
                              </div>
                              
                              {licitacao.arquivos && licitacao.arquivos.length > 0 && (
                                <div className="sm:col-span-2">
                                  <dt className="text-sm font-medium text-gray-500">Arquivos para Download</dt>
                                  <dd className="mt-1 text-sm text-gray-900">
                                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                      {licitacao.arquivos.map((arquivo, index) => (
                                        <li
                                          key={`${licitacao.id}-arquivo-${index}`}
                                          className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                                        >
                                          <div className="w-0 flex-1 flex items-center">
                                            <DocumentArrowDownIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                                            <span className="ml-2 flex-1 w-0 truncate">{arquivo.nome}</span>
                                          </div>
                                          <div className="ml-4 flex-shrink-0 flex items-center">
                                            <span className="mr-4 text-xs text-gray-500">{arquivo.tamanho}</span>
                                            <a
                                              href={arquivo.url}
                                              className="font-medium text-blue-600 hover:text-blue-500"
                                            >
                                              Download
                                            </a>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </dd>
                                </div>
                              )}
                              
                              <div className="sm:col-span-2 flex justify-end">
                                <Link 
                                  href={`/licitacoes/${licitacao.id}`}
                                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                >
                                  Ver página completa da licitação
                                </Link>
                              </div>
                            </dl>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Paginação */}
            {licitacoesOrdenadas.length > 0 && (
              <nav
                className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-sm"
                aria-label="Paginação"
              >
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">1</span> a{' '}
                    <span className="font-medium">{licitacoesOrdenadas.length}</span> de{' '}
                    <span className="font-medium">{licitacoesOrdenadas.length}</span> resultados
                  </p>
                </div>
                <div className="flex-1 flex justify-between sm:justify-end">
                  <button
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Anterior
                  </button>
                  <button
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Próxima
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
