'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface SecretariaOuDepartamento {
  id: string;
  nome: string;
  descricao: string;
  responsavel?: string;
  cargo?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  horarioAtendimento?: string;
  atribuicoes?: string[];
  departamentos?: SecretariaOuDepartamento[];
  expanded?: boolean;
}

// Dados de exemplo para estrutura organizacional
const ESTRUTURA_ORGANIZACIONAL: SecretariaOuDepartamento[] = [
  {
    id: 'gab',
    nome: 'Gabinete do Prefeito',
    descricao: 'Órgão central da administração municipal responsável pela gestão executiva do município.',
    responsavel: 'Carlos Oliveira',
    cargo: 'Prefeito Municipal',
    endereco: 'Rua da Prefeitura, 123, Centro',
    telefone: '(00) 0000-0000',
    email: 'gabinete@municipio.gov.br',
    horarioAtendimento: 'Segunda a Sexta, das 8h às 17h',
    atribuicoes: [
      'Representar o município em suas relações jurídicas, políticas e administrativas',
      'Exercer a direção superior da Administração Pública Municipal',
      'Iniciar o processo legislativo, na forma e nos casos previstos na Lei Orgânica',
      'Sancionar, promulgar e fazer publicar as leis, bem como expedir decretos e regulamentos'
    ],
    departamentos: [
      {
        id: 'gab-vice',
        nome: 'Gabinete do Vice-Prefeito',
        descricao: 'Órgão de apoio e substituição do Prefeito em suas funções.',
        responsavel: 'Ana Silva',
        cargo: 'Vice-Prefeita',
        email: 'vice@municipio.gov.br'
      },
      {
        id: 'gab-com',
        nome: 'Comunicação Social',
        descricao: 'Departamento responsável pela comunicação oficial da prefeitura com a população.',
        responsavel: 'Miguel Castro',
        cargo: 'Diretor de Comunicação',
        email: 'comunicacao@municipio.gov.br'
      }
    ]
  },
  {
    id: 'sec-adm',
    nome: 'Secretaria de Administração',
    descricao: 'Responsável pela gestão administrativa e de recursos humanos do município.',
    responsavel: 'Roberto Mendes',
    cargo: 'Secretário de Administração',
    endereco: 'Rua da Prefeitura, 123, Centro, Anexo I',
    telefone: '(00) 0000-0001',
    email: 'administracao@municipio.gov.br',
    horarioAtendimento: 'Segunda a Sexta, das 8h às 17h',
    atribuicoes: [
      'Planejar, coordenar e executar as atividades relativas à administração de pessoal',
      'Coordenar o recrutamento, seleção, treinamento e avaliação de desempenho dos servidores',
      'Elaborar folha de pagamento e controle de frequência',
      'Gerenciar os bens patrimoniais e o almoxarifado central'
    ],
    departamentos: [
      {
        id: 'adm-rh',
        nome: 'Departamento de Recursos Humanos',
        descricao: 'Responsável pela gestão de pessoal do município.',
        responsavel: 'Carla Santos',
        cargo: 'Diretora de Recursos Humanos',
        email: 'rh@municipio.gov.br'
      },
      {
        id: 'adm-comp',
        nome: 'Departamento de Compras e Licitações',
        descricao: 'Responsável pelos processos de compras e licitações do município.',
        responsavel: 'Paulo Roberto',
        cargo: 'Diretor de Compras',
        email: 'compras@municipio.gov.br'
      },
      {
        id: 'adm-pat',
        nome: 'Departamento de Patrimônio',
        descricao: 'Responsável pelo gerenciamento dos bens patrimoniais do município.',
        responsavel: 'Luciana Ferreira',
        cargo: 'Diretora de Patrimônio',
        email: 'patrimonio@municipio.gov.br'
      }
    ]
  },
  {
    id: 'sec-faz',
    nome: 'Secretaria da Fazenda',
    descricao: 'Responsável pela gestão financeira, contábil e tributária do município.',
    responsavel: 'Marcelo Gomes',
    cargo: 'Secretário da Fazenda',
    endereco: 'Rua da Prefeitura, 123, Centro, Anexo II',
    telefone: '(00) 0000-0002',
    email: 'fazenda@municipio.gov.br',
    horarioAtendimento: 'Segunda a Sexta, das 8h às 17h',
    atribuicoes: [
      'Planejar e executar a política financeira, tributária e fiscal do Município',
      'Elaborar a proposta orçamentária em colaboração com outros órgãos',
      'Controlar a execução orçamentária',
      'Administrar a dívida pública municipal'
    ],
    departamentos: [
      {
        id: 'faz-cont',
        nome: 'Departamento de Contabilidade',
        descricao: 'Responsável pela contabilidade pública municipal.',
        responsavel: 'Marina Pereira',
        cargo: 'Diretora de Contabilidade',
        email: 'contabilidade@municipio.gov.br'
      },
      {
        id: 'faz-trib',
        nome: 'Departamento de Tributos',
        descricao: 'Responsável pela arrecadação e fiscalização tributária.',
        responsavel: 'Fernando Oliveira',
        cargo: 'Diretor de Tributos',
        email: 'tributos@municipio.gov.br'
      }
    ]
  },
  {
    id: 'sec-obras',
    nome: 'Secretaria de Obras e Infraestrutura',
    descricao: 'Responsável pelo planejamento, execução e fiscalização de obras públicas.',
    responsavel: 'José Carlos Mendes',
    cargo: 'Secretário de Obras',
    endereco: 'Rua das Obras, 500, Centro',
    telefone: '(00) 0000-0003',
    email: 'obras@municipio.gov.br',
    horarioAtendimento: 'Segunda a Sexta, das 7h às 16h',
    atribuicoes: [
      'Planejar, projetar, orçar, coordenar e fiscalizar a construção de próprios municipais',
      'Executar obras de pavimentação, construção civil, drenagem e calçamento',
      'Supervisionar a elaboração de projetos e o acompanhamento técnico das obras municipais',
      'Coordenar a manutenção de estradas vicinais'
    ]
  },
  {
    id: 'sec-saude',
    nome: 'Secretaria de Saúde',
    descricao: 'Responsável pela gestão do sistema municipal de saúde.',
    responsavel: 'Dra. Maria Helena Silva',
    cargo: 'Secretária de Saúde',
    endereco: 'Av. da Saúde, 200, Centro',
    telefone: '(00) 0000-0004',
    email: 'saude@municipio.gov.br',
    horarioAtendimento: 'Segunda a Sexta, das 8h às 18h',
    atribuicoes: [
      'Planejar, organizar, controlar e avaliar as ações e os serviços públicos de saúde',
      'Gerir e executar os serviços públicos de saúde',
      'Participar do planejamento, programação e organização da rede regionalizada e hierarquizada do SUS',
      'Coordenar ações de vigilância sanitária e epidemiológica'
    ],
    departamentos: [
      {
        id: 'saude-atbas',
        nome: 'Departamento de Atenção Básica',
        descricao: 'Responsável pelas unidades básicas de saúde e estratégias de saúde da família.',
        responsavel: 'Dr. Paulo Santos',
        cargo: 'Diretor de Atenção Básica',
        email: 'atencaobasica@municipio.gov.br'
      },
      {
        id: 'saude-vig',
        nome: 'Departamento de Vigilância em Saúde',
        descricao: 'Responsável pelas ações de vigilância sanitária, epidemiológica e ambiental.',
        responsavel: 'Dra. Luísa Mendes',
        cargo: 'Diretora de Vigilância',
        email: 'vigilancia@municipio.gov.br'
      },
      {
        id: 'saude-farm',
        nome: 'Assistência Farmacêutica',
        descricao: 'Responsável pela distribuição de medicamentos à população.',
        responsavel: 'Dr. Roberto Almeida',
        cargo: 'Diretor de Assistência Farmacêutica',
        email: 'farmacia@municipio.gov.br'
      }
    ]
  },
  {
    id: 'sec-educ',
    nome: 'Secretaria de Educação',
    descricao: 'Responsável pela gestão da rede municipal de ensino.',
    responsavel: 'Profª. Claudia Ferreira',
    cargo: 'Secretária de Educação',
    endereco: 'Rua da Educação, 100, Centro',
    telefone: '(00) 0000-0005',
    email: 'educacao@municipio.gov.br',
    horarioAtendimento: 'Segunda a Sexta, das 8h às 17h',
    atribuicoes: [
      'Organizar, manter e desenvolver a rede municipal de ensino',
      'Elaborar e executar políticas e planos educacionais',
      'Autorizar, credenciar e supervisionar os estabelecimentos do sistema municipal de educação',
      'Oferecer educação infantil e ensino fundamental'
    ]
  }
];

export default function EstruturaPage() {
  const [estrutura, setEstrutura] = useState(ESTRUTURA_ORGANIZACIONAL);
  const [orgaoSelecionado, setOrgaoSelecionado] = useState<SecretariaOuDepartamento | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const toggleExpand = (id: string) => {
    setEstrutura(prev => {
      return prev.map(item => {
        if (item.id === id) {
          return { ...item, expanded: !item.expanded };
        } else if (item.departamentos) {
          const deptos = item.departamentos.map(depto => {
            if (depto.id === id) {
              return { ...depto, expanded: !depto.expanded };
            }
            return depto;
          });
          return { ...item, departamentos: deptos };
        }
        return item;
      });
    });
  };

  const abrirDetalhes = (orgao: SecretariaOuDepartamento) => {
    setOrgaoSelecionado(orgao);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setOrgaoSelecionado(null);
  };

  const renderDepartamentos = (departamentos?: SecretariaOuDepartamento[]) => {
    if (!departamentos || departamentos.length === 0) return null;

    return (
      <ul className="pl-6 mt-2 space-y-2">
        {departamentos.map(depto => (
          <li key={depto.id} className="border-l-2 border-gray-200 pl-4">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => abrirDetalhes(depto)} 
                className="text-gray-800 hover:text-blue-600 text-sm font-medium flex items-center"
              >
                {depto.nome}
                <ChevronRightIcon className="ml-2 h-4 w-4 text-gray-400" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Cabeçalho da página */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Estrutura Organizacional</h1>
                <p className="text-gray-600">
                  Conheça a organização administrativa da Prefeitura Municipal
                </p>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500">
              <span>Início</span> / <span className="text-gray-900">Estrutura</span>
            </nav>
          </div>
          
          {/* Conteúdo principal */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Sidebar / Índice */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Órgãos e Secretarias</h3>
                </div>
                
                <div className="px-6 py-5">
                  <nav className="space-y-3">
                    {estrutura.map(item => (
                      <div key={item.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <button 
                            onClick={() => abrirDetalhes(item)} 
                            className="text-gray-800 hover:text-blue-600 font-medium flex items-center"
                          >
                            {item.nome}
                            <ChevronRightIcon className="ml-1 h-4 w-4 text-gray-400" />
                          </button>
                          
                          {item.departamentos && item.departamentos.length > 0 && (
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <ChevronDownIcon className={`h-5 w-5 transform ${item.expanded ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>
                        
                        {item.expanded && renderDepartamentos(item.departamentos)}
                      </div>
                    ))}
                  </nav>
                </div>
              </div>

              <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Downloads</h3>
                </div>
                
                <div className="px-6 py-5">
                  <ul className="space-y-2">
                    <li>
                      <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Organograma Completo (PDF)
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Lei da Estrutura Administrativa (PDF)
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Quadro de Servidores (PDF)
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Conteúdo principal */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Visão Geral da Estrutura</h3>
                </div>
                
                <div className="px-6 py-5">
                  <div className="prose max-w-none">
                    <p>
                      A estrutura organizacional da Prefeitura Municipal é composta por órgãos da administração direta e indireta,
                      conforme estabelecido na Lei Municipal nº 123/2021, que dispõe sobre a organização administrativa do Poder Executivo Municipal.
                    </p>
                    <p className="mt-4">
                      A administração direta é composta pelo Gabinete do Prefeito e pelas Secretarias Municipais, que são os órgãos 
                      responsáveis pela execução das políticas públicas em suas respectivas áreas de atuação. Cada Secretaria Municipal
                      é subdividida em departamentos e setores, conforme a necessidade de especialização dos serviços prestados.
                    </p>
                    <p className="mt-4">
                      Para conhecer a estrutura detalhada de cada órgão, clique nos links do menu lateral ou visualize o organograma completo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Principais Órgãos</h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {estrutura.slice(0, 4).map(orgao => (
                    <div 
                      key={orgao.id} 
                      className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="px-6 py-5 border-b border-gray-200">
                        <h4 className="font-medium text-blue-600">{orgao.nome}</h4>
                      </div>
                      
                      <div className="px-6 py-4">
                        <p className="text-sm text-gray-600 mb-4">
                          {orgao.descricao}
                        </p>
                        
                        {orgao.responsavel && (
                          <div className="flex items-start text-sm mb-2">
                            <UserIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                            <div className="ml-2">
                              <span className="text-gray-900">{orgao.responsavel}</span>
                              <span className="text-gray-600 block">{orgao.cargo}</span>
                            </div>
                          </div>
                        )}
                        
                        <button
                          onClick={() => abrirDetalhes(orgao)}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        >
                          Ver detalhes
                          <ChevronRightIcon className="ml-1 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver todos os órgãos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de detalhes do órgão */}
      {modalAberto && orgaoSelecionado && (
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
                    <BuildingOfficeIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{orgaoSelecionado.nome}</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {orgaoSelecionado.descricao}
                      </p>
                      
                      <div className="mt-4 grid grid-cols-1 gap-y-4">
                        {orgaoSelecionado.responsavel && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Responsável</h4>
                            <div className="flex items-center mt-1">
                              <UserIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mr-1" />
                              <p className="text-sm text-gray-900">
                                {orgaoSelecionado.responsavel}
                                {orgaoSelecionado.cargo && (
                                  <span className="text-gray-600"> - {orgaoSelecionado.cargo}</span>
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {orgaoSelecionado.endereco && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Endereço</h4>
                            <div className="flex items-center mt-1">
                              <MapPinIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mr-1" />
                              <p className="text-sm text-gray-900">{orgaoSelecionado.endereco}</p>
                            </div>
                          </div>
                        )}
                        
                        {orgaoSelecionado.telefone && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
                            <div className="flex items-center mt-1">
                              <PhoneIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mr-1" />
                              <p className="text-sm text-gray-900">{orgaoSelecionado.telefone}</p>
                            </div>
                          </div>
                        )}
                        
                        {orgaoSelecionado.email && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">E-mail</h4>
                            <div className="flex items-center mt-1">
                              <EnvelopeIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mr-1" />
                              <a href={`mailto:${orgaoSelecionado.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                                {orgaoSelecionado.email}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {orgaoSelecionado.horarioAtendimento && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Horário de Atendimento</h4>
                            <div className="flex items-center mt-1">
                              <ClockIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mr-1" />
                              <p className="text-sm text-gray-900">{orgaoSelecionado.horarioAtendimento}</p>
                            </div>
                          </div>
                        )}
                        
                        {orgaoSelecionado.atribuicoes && orgaoSelecionado.atribuicoes.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Atribuições</h4>
                            <ul className="mt-1 text-sm text-gray-600 list-disc list-inside space-y-1">
                              {orgaoSelecionado.atribuicoes.map((atribuicao, index) => (
                                <li key={index}>{atribuicao}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {orgaoSelecionado.departamentos && orgaoSelecionado.departamentos.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Departamentos</h4>
                            <ul className="mt-1 text-sm text-gray-900 space-y-1">
                              {orgaoSelecionado.departamentos.map((depto) => (
                                <li key={depto.id} className="flex items-center">
                                  <ChevronRightIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1" />
                                  <span>{depto.nome}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
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
