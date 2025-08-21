'use client';

import Link from 'next/link';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  UserGroupIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface FooterProps {
  tenantData?: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city: string;
    state: string;
    website?: string;
    lai_email?: string;
    ouvidoria_email?: string;
  };
}

export default function Footer({ tenantData }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Portal de Transparência', href: '/' },
    { name: 'e-SIC', href: '/esic' },
    { name: 'Ouvidoria', href: '/ouvidoria' },
    { name: 'Dados Abertos', href: '/dados-abertos' },
    { name: 'Acessibilidade', href: '/acessibilidade' },
    { name: 'Mapa do Site', href: '/mapa-site' },
  ];

  const legalLinks = [
    { name: 'Lei de Acesso à Informação', href: '/lai' },
    { name: 'Lei da Transparência', href: '/transparencia' },
    { name: 'Política de Privacidade', href: '/privacidade' },
    { name: 'Termos de Uso', href: '/termos' },
    { name: 'LGPD', href: '/lgpd' },
  ];

  const services = [
    { name: 'Receitas', href: '/receitas' },
    { name: 'Despesas', href: '/despesas' },
    { name: 'Contratos', href: '/contratos' },
    { name: 'Licitações', href: '/licitacoes' },
    { name: 'Servidores', href: '/servidores' },
    { name: 'Estrutura Organizacional', href: '/estrutura' },
  ];

  return (
    <footer className="bg-gray-800 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">
                    {tenantData?.address && (
                      <>
                        {tenantData.address}<br />
                      </>
                    )}
                    {tenantData?.city}, {tenantData?.state}
                  </p>
                </div>
              </div>
              
              {tenantData?.phone && (
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                  <a 
                    href={`tel:${tenantData.phone}`}
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    {tenantData.phone}
                  </a>
                </div>
              )}
              
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <a 
                  href={`mailto:${tenantData?.email}`}
                  className="text-sm text-gray-300 hover:text-white"
                >
                  {tenantData?.email}
                </a>
              </div>
              
              {tenantData?.website && (
                <div className="flex items-center">
                  <GlobeAltIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                  <a 
                    href={tenantData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Site Oficial
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Transparência</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    href={service.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal compliance */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legislação</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Special contacts */}
        {(tenantData?.lai_email || tenantData?.ouvidoria_email) && (
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tenantData?.lai_email && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <InformationCircleIcon className="h-5 w-5 mr-2" />
                    <h4 className="font-semibold">Lei de Acesso à Informação</h4>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    Solicite informações públicas através do e-SIC
                  </p>
                  <a 
                    href={`mailto:${tenantData.lai_email}`}
                    className="text-sm text-blue-300 hover:text-blue-200"
                  >
                    {tenantData.lai_email}
                  </a>
                </div>
              )}
              
              {tenantData?.ouvidoria_email && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    <h4 className="font-semibold">Ouvidoria</h4>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    Envie sugestões, reclamações e elogios
                  </p>
                  <a 
                    href={`mailto:${tenantData.ouvidoria_email}`}
                    className="text-sm text-blue-300 hover:text-blue-200"
                  >
                    {tenantData.ouvidoria_email}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-2 md:mb-0">
              © {currentYear} {tenantData?.name || 'Portal de Transparência'}. 
              Todos os direitos reservados.
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Desenvolvido em conformidade com:</span>
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="h-4 w-4" />
                <span>LAI</span>
              </div>
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="h-4 w-4" />
                <span>LC 131/09</span>
              </div>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center md:text-left">
            Este portal atende integralmente à Lei de Acesso à Informação (LAI - Lei nº 12.527/2011) 
            e à Lei Complementar nº 131/2009 (Lei da Transparência).
          </div>
        </div>
      </div>
    </footer>
  );
}

