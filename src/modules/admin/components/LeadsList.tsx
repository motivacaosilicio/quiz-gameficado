'use client';

import React, { useState, useEffect } from 'react';
import { getLeads } from '../api/leads';
import { Lead } from '../types';
import AdminButton from './ui/AdminButton';
import AdminInput from './ui/AdminInput';

interface LeadsListProps {
  onViewLead?: (leadId: string) => void;
}

/**
 * Componente LeadsList
 * Lista leads capturados com funcionalidades de busca, paginação e ações
 */
const LeadsList: React.FC<LeadsListProps> = ({ onViewLead }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  // Buscar leads quando componente montar ou mudar paginação/busca
  useEffect(() => {
    fetchLeads();
  }, [page, searchTerm]);

  // Função para buscar leads
  const fetchLeads = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { leads, total } = await getLeads(page, pageSize, searchTerm);
      
      setLeads(leads);
      setTotalLeads(total || 0);
    } catch (err) {
      console.error('Erro ao buscar leads:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao buscar leads'));
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com a mudança na busca
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Resetar para a primeira página ao buscar
  };

  // Função para exportar leads como CSV
  const handleExportCSV = () => {
    if (leads.length === 0) return;
    
    const headers = ['Nome', 'Email', 'Telefone', 'Data', 'Quiz'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => {
        return [
          `"${lead.name}"`,
          `"${lead.email}"`,
          `"${lead.phone || ''}"`,
          `"${new Date(lead.created_at).toLocaleString()}"`,
          `"${lead.quiz_title || ''}"`,
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calcular número total de páginas
  const totalPages = Math.ceil(totalLeads / pageSize);

  // Renderizar estado de carregamento
  if (isLoading && page === 1 && !leads.length) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
          <div className="animate-pulse w-32 h-10 bg-gray-200 rounded"></div>
        </div>
        
        <div className="animate-pulse w-full h-12 bg-gray-200 rounded mb-6"></div>
        
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-200 rounded w-full"></div>
          <div className="h-16 bg-gray-200 rounded w-full"></div>
          <div className="h-16 bg-gray-200 rounded w-full"></div>
          <div className="h-16 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
        
        <div className="flex space-x-2">
          <AdminButton
            variant="secondary"
            onClick={handleExportCSV}
            disabled={leads.length === 0}
          >
            Exportar CSV
          </AdminButton>
          
          <AdminButton
            variant="primary"
            onClick={fetchLeads}
            disabled={isLoading}
          >
            {isLoading ? 'Atualizando...' : 'Atualizar'}
          </AdminButton>
        </div>
      </div>
      
      {/* Barra de busca */}
      <div className="bg-white p-4 shadow-sm rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="flex-grow">
            <AdminInput
              type="text"
              placeholder="Buscar por nome ou email"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full"
            />
          </div>
          
          <div className="text-sm text-gray-500">
            {totalLeads > 0 && `${totalLeads} ${totalLeads === 1 ? 'lead' : 'leads'} encontrados`}
          </div>
        </div>
      </div>
      
      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error.message}
              </p>
            </div>
          </div>
          
          <div className="mt-2">
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={fetchLeads}
            >
              Tentar novamente
            </AdminButton>
          </div>
        </div>
      )}
      
      {/* Lista de leads */}
      {leads.length > 0 ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a href={`mailto:${lead.email}`} className="text-indigo-600 hover:underline">
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.quiz_title || <span className="text-gray-400 italic">Não informado</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      <button
                        onClick={() => onViewLead?.(lead.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Visualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Paginação */}
          {totalPages > 1 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1 || isLoading}
                  >
                    Anterior
                  </AdminButton>
                  
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages || isLoading}
                  >
                    Próxima
                  </AdminButton>
                </div>
                
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{((page - 1) * pageSize) + 1}</span> a{' '}
                      <span className="font-medium">
                        {Math.min(page * pageSize, totalLeads)}
                      </span> de{' '}
                      <span className="font-medium">{totalLeads}</span> resultados
                    </p>
                  </div>
                  
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1 || isLoading}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          page === 1 || isLoading
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Anterior</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Botões de página */}
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        // Lógica para mostrar páginas próximas à atual
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                              page === pageNum
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page >= totalPages || isLoading}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          page >= totalPages || isLoading
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Próxima</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          {!isLoading && (
            <div className="space-y-3">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">Nenhum lead encontrado</h3>
              <p className="text-gray-500">
                {searchTerm
                  ? 'Nenhum resultado encontrado para sua busca. Tente termos diferentes.'
                  : 'Ainda não há leads registrados no sistema.'}
              </p>
              {searchTerm && (
                <div className="mt-6">
                  <AdminButton
                    variant="secondary"
                    onClick={() => setSearchTerm('')}
                  >
                    Limpar busca
                  </AdminButton>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadsList; 