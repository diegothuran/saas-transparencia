'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  useEffect(() => {
    // Registro de analytics (em uma aplicação real)
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Página não encontrada</h2>
          <p className="mt-4 text-lg text-gray-600">
            Desculpe, não conseguimos encontrar a página que você está procurando.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Ir para o início
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
