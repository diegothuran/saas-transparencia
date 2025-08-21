'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  NewspaperIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  TagIcon,
  ArrowPathIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

interface Noticia {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  dataPublicacao: string;
  autor?: string;
  imagem?: string;
  categorias: string[];
  slug: string;
}

// Dados de exemplo para notícias
const NOTICIAS: Noticia[] = [
  {
    id: '1',
    titulo: 'Prefeitura inaugura nova Unidade Básica de Saúde no Bairro Central',
    resumo: 'Nova unidade irá atender mais de 5.000 moradores da região com serviços de saúde primária.',
    conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget fermentum aliquam, nunc nisl aliquet nunc, euismod aliquam nisl nunc euismod.',
    dataPublicacao: '2023-06-15',
    autor: 'Secretaria de Comunicação',
    imagem: 'https://placehold.co/800x400',
    categorias: ['Saúde', 'Infraestrutura'],
    slug: 'prefeitura-inaugura-nova-ubs-bairro-central'
  },
  {
    id: '2',
    titulo: 'Programa de capacitação profissional abre 200 vagas para jovens',
    resumo: 'Iniciativa visa preparar jovens para o mercado de trabalho com cursos gratuitos em diversas áreas.',
    conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget fermentum aliquam, nunc nisl aliquet nunc, euismod aliquam nisl nunc euismod.',
    dataPublicacao: '2023-06-10',
    autor: 'Secretaria de Desenvolvimento Social',
    imagem: 'https://placehold.co/800x400',
    categorias: ['Educação', 'Emprego'],
    slug: 'programa-capacitacao-profissional-abre-vagas'
  },
  {
    id: '3',
    titulo: 'Município recebe prêmio de transparência em gestão pública',
    resumo: 'Premiação reconhece as boas práticas de governança e transparência implementadas pela administração municipal.',
    conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget fermentum aliquam, nunc nisl aliquet nunc, euismod aliquam nisl nunc euismod.',
    dataPublicacao: '2023-06-05',
    autor: 'Gabinete do Prefeito',
    imagem: 'https://placehold.co/800x400',
    categorias: ['Administração', 'Transparência'],
    slug: 'municipio-recebe-premio-transparencia'
  },
  {
    id: '4',
    titulo: 'Prefeitura inicia obras de pavimentação em cinco bairros',
    resumo: 'Intervenções fazem parte do programa de infraestrutura urbana e devem beneficiar mais de 30 mil moradores.',
    conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget fermentum aliquam, nunc nisl aliquet nunc, euismod aliquam nisl nunc euismod.',
    dataPublicacao: '2023-05-28',
    autor: 'Secretaria de Obras',
    imagem: 'https://placehold.co/800x400',
    categorias: ['Infraestrutura', 'Obras'],
    slug: 'prefeitura-inicia-obras-pavimentacao'
  },
  {
    id: '5',
    titulo: 'Festival cultural movimenta a cidade neste final de semana',
    resumo: 'Evento gratuito contará com apresentações musicais, teatrais e exposições de artistas locais.',
    conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget fermentum aliquam, nunc nisl aliquet nunc, euismod aliquam nisl nunc euismod.',
    dataPublicacao: '2023-05-22',
    autor: 'Secretaria de Cultura',
    imagem: 'https://placehold.co/800x400',
    categorias: ['Cultura', 'Eventos'],
    slug: 'festival-cultural-movimenta-cidade'
  },
  {
    id: '6',
    titulo: 'Campanha de vacinação contra a gripe é prorrogada até o fim do mês',
    resumo: 'Decisão foi tomada após baixa procura nos postos de saúde. Meta é imunizar pelo menos 90% do público-alvo.',
    conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget fermentum aliquam, nunc nisl aliquet nunc, euismod aliquam nisl nunc euismod.',
    dataPublicacao: '2023-05-15',
    autor: 'Secretaria de Saúde',
    imagem: 'https://placehold.co/800x400',
    categorias: ['Saúde', 'Vacinação'],
    slug: 'campanha-vacinacao-gripe-prorrogada'
  }
];

// Lista de categorias para filtro
const CATEGORIAS = [
  'Todas',
  'Saúde',
  'Educação',
  'Infraestrutura',
  'Cultura',
  'Administração',
  'Transparência',
  'Obras',
  'Eventos',
  'Emprego',
  'Vacinação'
];

export default function NoticiasPage() {
  const [filtros, setFiltros] = useState({
    termo: '',
    categoria: 'Todas',
    data: ''
  });
  const [carregando, setCarregando] = useState(false);

  // Filtrar notícias com base nos filtros aplicados
  const noticiasFiltradas = NOTICIAS.filter(noticia => {
    // Filtro por termo de busca
    if (filtros.termo && 
        !noticia.titulo.toLowerCase().includes(filtros.termo.toLowerCase()) && 
        !noticia.resumo.toLowerCase().includes(filtros.termo.toLowerCase())) {
      return false;
    }
    
    // Filtro por categoria
    if (filtros.categoria !== 'Todas' && 
        !noticia.categorias.includes(filtros.categoria)) {
      return false;
    }
    
    // Filtro por data
    if (filtros.data && noticia.dataPublicacao !== filtros.data) {
      return false;
    }
    
    return true;
  });

  // Ordenar notícias por data de publicação (mais recentes primeiro)
  const noticiasOrdenadas = [...noticiasFiltradas].sort((a, b) => {
    return new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime();
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
      categoria: 'Todas',
      data: ''
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Cabeçalho da página */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <NewspaperIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notícias</h1>
                <p className="text-gray-600">
                  Fique por dentro das últimas notícias e acontecimentos do município
                </p>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500">
              <span>Início</span> / <span className="text-gray-900">Notícias</span>
            </nav>
          </div>
          
          {/* Filtros */}
          <div className="mb-8 bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Filtrar Notícias</h3>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="termo" className="block text-sm font-medium text-gray-700 mb-1">
                      Buscar por palavra-chave
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="termo"
                        id="termo"
                        placeholder="Buscar notícias..."
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
                    <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                      Data de publicação
                    </label>
                    <input
                      type="date"
                      name="data"
                      id="data"
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={filtros.data}
                      onChange={handleFiltroChange}
                    />
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
          
          {/* Destaque */}
          {noticiasOrdenadas.length > 0 && (
            <div className="mb-8">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:flex-shrink-0 relative h-64 md:h-auto md:w-1/3">
                    {noticiasOrdenadas[0].imagem ? (
                      <Image
                        src={noticiasOrdenadas[0].imagem}
                        alt={noticiasOrdenadas[0].titulo}
                        className="object-cover w-full h-full"
                        width={800}
                        height={400}
                      />
                    ) : (
                      <div className="bg-gray-200 h-full flex items-center justify-center">
                        <NewspaperIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col justify-between md:w-2/3">
                    <div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <span>{formatarData(noticiasOrdenadas[0].dataPublicacao)}</span>
                        {noticiasOrdenadas[0].categorias && (
                          <>
                            <span className="mx-2">•</span>
                            <div className="flex items-center">
                              <TagIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <span>{noticiasOrdenadas[0].categorias.join(', ')}</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <Link href={`/noticias/${noticiasOrdenadas[0].slug}`} className="block">
                        <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition duration-150 ease-in-out mb-2">
                          {noticiasOrdenadas[0].titulo}
                        </h2>
                      </Link>
                      
                      <p className="mt-3 text-base text-gray-600">
                        {noticiasOrdenadas[0].resumo}
                      </p>
                    </div>
                    
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <span className="sr-only">{noticiasOrdenadas[0].autor}</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {noticiasOrdenadas[0].autor}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Link
                        href={`/noticias/${noticiasOrdenadas[0].slug}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Leia mais
                        <ChevronRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Resultados */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {noticiasOrdenadas.length} {noticiasOrdenadas.length === 1 ? 'notícia encontrada' : 'notícias encontradas'}
              </h3>
            </div>
            
            {noticiasOrdenadas.length === 0 ? (
              <div className="text-center py-12 bg-white shadow-sm rounded-lg">
                <NewspaperIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma notícia encontrada</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tente modificar seus filtros de pesquisa para encontrar o que procura.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Pulamos o primeiro item pois ele já está no destaque */}
                {noticiasOrdenadas.slice(1).map((noticia) => (
                  <div
                    key={noticia.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0 h-48 relative">
                      {noticia.imagem ? (
                        <Image
                          src={noticia.imagem}
                          alt={noticia.titulo}
                          className="object-cover w-full h-full"
                          width={400}
                          height={200}
                        />
                      ) : (
                        <div className="bg-gray-200 h-full flex items-center justify-center">
                          <NewspaperIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex-grow">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <CalendarIcon className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" />
                        <span>{formatarData(noticia.dataPublicacao)}</span>
                      </div>
                      
                      <Link href={`/noticias/${noticia.slug}`} className="block">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition duration-150 ease-in-out mb-2">
                          {noticia.titulo}
                        </h3>
                      </Link>
                      
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                        {noticia.resumo}
                      </p>
                    </div>
                    
                    <div className="px-5 pb-5">
                      {noticia.categorias && noticia.categorias.length > 0 && (
                        <div className="flex flex-wrap mb-3">
                          {noticia.categorias.map(categoria => (
                            <span
                              key={`${noticia.id}-${categoria}`}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1 mb-1"
                            >
                              {categoria}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <Link
                        href={`/noticias/${noticia.slug}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        Leia mais
                        <ChevronRightIcon className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Paginação */}
            {noticiasOrdenadas.length > 9 && (
              <nav
                className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow-sm"
                aria-label="Paginação"
              >
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">1</span> a{' '}
                    <span className="font-medium">{Math.min(9, noticiasOrdenadas.length)}</span> de{' '}
                    <span className="font-medium">{noticiasOrdenadas.length}</span> resultados
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
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
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
