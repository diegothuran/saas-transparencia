'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bars3Icon,
  XMarkIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface HeaderProps {
  tenantData?: {
    name: string;
    logo_url?: string;
    primary_color: string;
  };
}

export default function Header({ tenantData }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const pathname = usePathname();

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Receitas', href: '/receitas' },
    { name: 'Despesas', href: '/despesas' },
    { name: 'Contratos', href: '/contratos' },
    { name: 'Licitações', href: '/licitacoes' },
    { name: 'Servidores', href: '/servidores' },
    { name: 'e-SIC', href: '/esic' },
    { name: 'Notícias', href: '/noticias' },
    { name: 'Serviços', href: '/servicos' },
    { name: 'Contato', href: '/contato' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Portal de Transparência - {tenantData?.name || 'Município'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/acessibilidade" 
                className="text-gray-600 hover:text-blue-600"
              >
                Acessibilidade
              </Link>
              <Link 
                href="/admin" 
                className="text-gray-600 hover:text-blue-600 flex items-center"
              >
                <UserIcon className="h-4 w-4 mr-1" />
                Área Administrativa
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and title */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {tenantData?.logo_url ? (
                <img
                  src={tenantData.logo_url}
                  alt={`Logo ${tenantData.name}`}
                  className="h-12 w-12 mr-3"
                />
              ) : (
                <BuildingOfficeIcon 
                  className="h-12 w-12 mr-3"
                  style={{ color: tenantData?.primary_color || '#1976d2' }}
                />
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {tenantData?.name || 'Portal de Transparência'}
                </h1>
                <p className="text-sm text-gray-600">
                  Transparência e Acesso à Informação
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
                style={
                  isActive(item.href)
                    ? { backgroundColor: tenantData?.primary_color || '#1976d2' }
                    : {}
                }
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search and mobile menu */}
          <div className="flex items-center space-x-2">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-4">
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar informações, fornecedores, contratos..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm text-white rounded-md"
                  style={{ backgroundColor: tenantData?.primary_color || '#1976d2' }}
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
                style={
                  isActive(item.href)
                    ? { backgroundColor: tenantData?.primary_color || '#1976d2' }
                    : {}
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

