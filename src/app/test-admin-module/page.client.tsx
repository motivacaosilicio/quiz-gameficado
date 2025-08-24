'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Importação dinâmica do componente Dashboard do módulo Admin
const Dashboard = dynamic(() => import('@/modules/admin/components/Dashboard'), {
  loading: () => <p>Carregando dashboard...</p>
});

/**
 * Componente cliente para testar o módulo Admin
 */
export default function AdminClientPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulando inicialização do componente
    const timer = setTimeout(() => {
      try {
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar componentes admin'));
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-500">
        <h2 className="text-xl font-bold text-red-700">Erro ao carregar módulo Admin</h2>
        <p className="text-red-600 mt-2">{error.message}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-xl text-gray-600">Preparando dashboard...</p>
        </div>
      ) : (
        <Dashboard />
      )}
    </div>
  );
} 