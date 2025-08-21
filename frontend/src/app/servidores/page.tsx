'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  UserIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

interface Servidor {
  id: string;
  nome: string;
  cargo: string;
  orgao: string;
  tipo: string; // 'Efetivo', 'Comissionado', 'Contratado'
  dataAdmissao: string;
  salarioBase: string;
  formacao: string;
  foto?: string;
}

// Dados de exemplo para servidores
const SERVIDORES: Servidor[] = [
  {
    id: '1',
    nome: 'Ana Silva Santos',
    cargo: 'Médica',
    orgao: 'Secretaria de Saúde',
    tipo: 'Efetivo',
    dataAdmissao: '2019-03-15',
    salarioBase: 'R$ 8.500,00',
    formacao: 'Medicina com especialização em Clínica Geral'
  },
  {
    id: '2',
    nome: 'Carlos Oliveira Mendes',
    cargo: 'Diretor de Departamento',
    orgao: 'Secretaria de Administração',
    tipo: 'Comissionado',
    dataAdmissao: '2021-01-10',
    salarioBase: 'R$ 6.800,00',
    formacao: 'Administração Pública'
  },
  {
    id: '3',
    nome: 'Mariana Costa Lima',
    cargo: 'Professora',
    orgao: 'Secretaria de Educação',
    tipo: 'Efetivo',
    dataAdmissao: '2018-02-05',
    salarioBase: 'R$ 4.200,00',
    formacao: 'Licenciatura em Matemática'
  },
  {
    id: '4',
    nome: 'Roberto Alves Pereira',
    cargo: 'Engenheiro Civil',
    orgao: 'Secretaria de Obras',
    tipo: 'Efetivo',
    dataAdmissao: '2020-06-22',
    salarioBase: 'R$ 7.300,00',
    formacao: 'Engenharia Civil'
  },
  {
    id: '5',
    nome: 'Patrícia Sousa Ribeiro',
    cargo: 'Assistente Social',
    orgao: 'Secretaria de Assistência Social',
    tipo: 'Contratado',
    dataAdmissao: '2022-04-18',
    salarioBase: 'R$ 4.500,00',
    formacao: 'Serviço Social'
  },
  {
    id: '6',
    nome: 'Fernando Martins Gomes',
    cargo: 'Fiscal de Tributos',
    orgao: 'Secretaria da Fazenda',
    tipo: 'Efetivo',
    dataAdmissao: '2017-08-30',
    salarioBase: 'R$ 5.800,00',
    formacao: 'Ciências Contábeis'
  },
  {
    id: '7',
    nome: 'Juliana Ferreira Santos',
    cargo: 'Procuradora Municipal',
    orgao: 'Procuradoria Geral do Município',
    tipo: 'Efetivo',
    dataAdmissao: '2016-11-07',
    salarioBase: 'R$ 9.200,00',
    formacao: 'Direito com especialização em Direito Público'
  },
  {
    id: '8',
    nome: 'Miguel Castro Almeida',
    cargo: 'Assessor de Comunicação',
    orgao: 'Gabinete do Prefeito',
    tipo: 'Comissionado',
    dataAdmissao: '2021-03-01',
    salarioBase: 'R$ 5.300,00',
    formacao: 'Jornalismo'
  }
];

// Lista de órgãos para filtro
const ORGAOS = [
  'Todos',
  'Secretaria de Saúde',
  'Secretaria de Educação',
  'Secretaria de Administração',
  'Secretaria de Obras',
  'Secretaria da Fazenda',
  'Secretaria de Assistência Social',
  'Gabinete do Prefeito',
  'Procuradoria Geral do Município'
];

// Lista de tipos de vínculo para filtro
const TIPOS_VINCULO = [
  'Todos',
  'Efetivo',
  'Comissionado',
  'Contratado'
];

export default function ServidoresPage() {
  const [filtros, setFiltros] = useState({
    termo: '',
    orgao: 'Todos',
    tipoVinculo: 'Todos'
  });
  const [ordenacao, setOrdenacao] = useState('nome');
  const [carregando, setCarregando] = useState(false);
  const [servidorSelecionado, setServidorSelecionado] = useState<Servidor | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  // Filtrar servidores com base nos filtros aplicados
  const servidoresFiltrados = SERVIDORES.filter(servidor => {
    // Filtro por termo de busca
    if (filtros.termo && 
        !servidor.nome.toLowerCase().includes(filtros.termo.toLowerCase()) && 
        !servidor.cargo.toLowerCase().includes(filtros.termo.toLowerCase())) {
      return false;
    }
    
    // Filtro por órgão
    if (filtros.orgao !== 'Todos' && servidor.orgao !== filtros.orgao) {
      return false;
    }
    
    // Filtro por tipo de vínculo
    if (filtros.tipoVinculo !== 'Todos' && servidor.tipo !== filtros.tipoVinculo) {
      return false;
    }
    
    return true;
  });

  // Ordenação de servidores
  const servidoresOrdenados = [...servidoresFiltrados].sort((a, b) => {
    if (ordenacao === 'nome') {
      return a.nome.localeCompare(b.nome);
    } else if (ordenacao === 'orgao') {
      return a.orgao.localeCompare(b.orgao);
    } else if (ordenacao === 'admissao') {
      return new Date(b.dataAdmissao).getTime() - new Date(a.dataAdmissao).getTime();
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
      orgao: 'Todos',
      tipoVinculo: 'Todos'
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

  const abrirDetalhesServidor = (servidor: Servidor) => {
    setServidorSelecionado(servidor);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setServidorSelecionado(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Cabeçalho da página */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Servidores Públicos</h1>
                <p className="text-gray-600">
                  Consulte informações sobre os servidores públicos municipais
                </p>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500">
              <span>Início</span> / <span className="text-gray-900">Servidores</span>
            </nav>
          </div>
          
          {/* Filtros */}
          <div className="mb-8 bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Filtrar Servidores</h3>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label htmlFor="termo" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome ou Cargo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="termo"
                        id="termo"
                        placeholder="Nome do servidor ou cargo"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={filtros.termo}
                        onChange={handleFiltroChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="orgao" className="block text-sm font-medium text-gray-700 mb-1">
                      Órgão/Secretaria
                    </label>
                    <select
                      id="orgao"
                      name="orgao"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={filtros.orgao}
                      onChange={handleFiltroChange}
                    >
                      {ORGAOS.map(orgao => (
                        <option key={orgao} value={orgao}>
                          {orgao}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="tipoVinculo" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Vínculo
                    </label>
                    <select
                      id="tipoVinculo"
                      name="tipoVinculo"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={filtros.tipoVinculo}
                      onChange={handleFiltroChange}
                    >
                      {TIPOS_VINCULO.map(tipo => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
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
                      <option value="nome">Nome (A-Z)</option>
                      <option value="orgao">Órgão/Secretaria</option>
                      <option value="admissao">Data de Admissão (mais recente)</option>
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
                {servidoresOrdenados.length} {servidoresOrdenados.length === 1 ? 'servidor encontrado' : 'servidores encontrados'}
              </h3>
            </div>
            
            {servidoresOrdenados.length === 0 ? (
              <div className="text-center py-12 bg-white shadow-sm rounded-lg">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum servidor encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tente modificar seus filtros de pesquisa para encontrar o que procura.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {servidoresOrdenados.map((servidor) => (
                  <div
                    key={servidor.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-center mb-4">
                        <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                          {servidor.foto ? (
                            <Image
                              src={servidor.foto}
                              alt={servidor.nome}
                              width={80}
                              height={80}
                              className="h-20 w-20 rounded-full object-cover"
                            />
                          ) : (
                            <UserIcon className="h-10 w-10 text-blue-600" />
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900">{servidor.nome}</h3>
                        <p className="text-sm text-gray-600">{servidor.cargo}</p>
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        <div className="flex items-start">
                          <BuildingOfficeIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                          <span className="ml-2 text-sm text-gray-600">{servidor.orgao}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              servidor.tipo === 'Efetivo' ? 'bg-green-100 text-green-800' :
                              servidor.tipo === 'Comissionado' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {servidor.tipo}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mr-1" />
                          <span>Desde {formatarData(servidor.dataAdmissao)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={() => abrirDetalhesServidor(servidor)}
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Paginação */}
            {servidoresOrdenados.length > 0 && (
              <nav
                className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow-sm"
                aria-label="Paginação"
              >
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">1</span> a{' '}
                    <span className="font-medium">{servidoresOrdenados.length}</span> de{' '}
                    <span className="font-medium">{servidoresOrdenados.length}</span> resultados
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

      {/* Modal de detalhes do servidor */}
      {modalAberto && servidorSelecionado && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <UserIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{servidorSelecionado.nome}</h3>
                    <div className="mt-2">
                      <div className="grid grid-cols-1 gap-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Cargo</p>
                          <p className="text-sm text-gray-900">{servidorSelecionado.cargo}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Órgão/Secretaria</p>
                          <p className="text-sm text-gray-900">{servidorSelecionado.orgao}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Tipo de Vínculo</p>
                          <p className="text-sm text-gray-900">{servidorSelecionado.tipo}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Data de Admissão</p>
                          <p className="text-sm text-gray-900">{formatarData(servidorSelecionado.dataAdmissao)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Formação</p>
                          <p className="text-sm text-gray-900">{servidorSelecionado.formacao}</p>
                        </div>
                        
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mr-1" />
                          <p className="text-sm font-medium text-gray-500">Salário Base: </p>
                          <p className="text-sm text-gray-900 ml-1">{servidorSelecionado.salarioBase}</p>
                        </div>
                        
                        <div className="mt-4">
                          <Link 
                            href={`/servidores/${servidorSelecionado.id}/remuneracao`}
                            className="text-sm text-blue-600 hover:text-blue-500"
                          >
                            Ver histórico completo de remuneração
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={fecharModal}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
