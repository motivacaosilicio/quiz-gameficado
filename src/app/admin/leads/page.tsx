'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';

// Tipo para os leads
interface Lead {
  id: string;
  created_at: string;
  email: string;
  name: string;
  phone: string | null;
  quiz_title: string;
  quiz_id: string;
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState<string>('all');
  const [quizzes, setQuizzes] = useState<{id: string, title: string}[]>([]);
  
  // Função para exportar leads como CSV
  const exportToCSV = () => {
    if (leads.length === 0) return;
    
    // Cabeçalhos
    const headers = ['Nome', 'Email', 'Telefone', 'Quiz', 'Data de Criação'];
    
    // Converter dados para CSV
    const csvRows = [
      headers.join(','),
      ...leads.map(lead => {
        const data = [
          `"${lead.name || ''}"`,
          `"${lead.email || ''}"`,
          `"${lead.phone || ''}"`,
          `"${lead.quiz_title || ''}"`,
          `"${new Date(lead.created_at).toLocaleDateString('pt-BR')}"`,
        ];
        return data.join(',');
      }),
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'leads.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Buscar dados
  useEffect(() => {
    async function fetchLeads() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        
        // Buscar quizzes para o filtro
        const { data: quizzesData, error: quizzesError } = await supabase
          .from('quizzes')
          .select('id, title');
        
        if (quizzesError) throw quizzesError;
        setQuizzes(quizzesData || []);
        
        // Query para buscar leads com join para informações do quiz
        let query = supabase
          .from('leads')
          .select(`
            id,
            created_at,
            persons:person_id (
              email,
              name,
              phone
            ),
            quiz_sessions:quiz_session_id (
              quizzes:quiz_id (
                id,
                title
              )
            )
          `);
        
        // Aplicar filtro de quiz se selecionado
        if (selectedQuiz !== 'all') {
          query = query.eq('quiz_sessions.quiz_id', selectedQuiz);
        }
        
        // Executar a query
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Transformar os dados para o formato desejado
        const formattedLeads = data.map((lead: any) => ({
          id: lead.id,
          created_at: lead.created_at,
          email: lead.persons?.email || '',
          name: lead.persons?.name || '',
          phone: lead.persons?.phone || '',
          quiz_id: lead.quiz_sessions?.quizzes?.id || '',
          quiz_title: lead.quiz_sessions?.quizzes?.title || '',
        }));
        
        setLeads(formattedLeads);
      } catch (err: any) {
        console.error('Erro ao buscar leads:', err);
        setError(err.message || 'Erro ao carregar os leads');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeads();
  }, [selectedQuiz]);

  // Column helper para a tabela
  const columnHelper = createColumnHelper<Lead>();

  // Definição das colunas
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Nome',
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('phone', {
        header: 'Telefone',
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('quiz_title', {
        header: 'Quiz',
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('created_at', {
        header: 'Data',
        cell: info => new Date(info.getValue()).toLocaleDateString('pt-BR'),
        sortingFn: 'datetime',
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Ações',
        cell: info => (
          <button
            onClick={() => router.push(`/admin/leads/${info.row.original.id}`)}
            className="text-blue-600 hover:text-blue-800"
          >
            Ver detalhes
          </button>
        ),
      }),
    ],
    []
  );

  // Dados filtrados com base na busca
  const filteredData = useMemo(() => {
    if (!searchQuery) return leads;
    
    return leads.filter(lead => {
      const searchLower = searchQuery.toLowerCase();
      return (
        lead.name?.toLowerCase().includes(searchLower) ||
        lead.email?.toLowerCase().includes(searchLower) ||
        lead.phone?.toLowerCase().includes(searchLower) ||
        lead.quiz_title?.toLowerCase().includes(searchLower)
      );
    });
  }, [leads, searchQuery]);

  // Configuração da tabela
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erro!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            Lista de leads capturados através dos questionários
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar CSV
          </button>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex-grow">
          <label htmlFor="search" className="sr-only">Buscar</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              id="search"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10"
              placeholder="Buscar por nome, email ou telefone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <label htmlFor="quiz" className="sr-only">Filtrar por Quiz</label>
          <select
            id="quiz"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md h-10"
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
          >
            <option value="all">Todos os Quizzes</option>
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Tabela */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        <span>
                          {{
                            asc: <span className="text-gray-900">↑</span>,
                            desc: <span className="text-gray-900">↓</span>,
                          }[header.column.getIsSorted() as string] ?? null}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/admin/leads/${row.original.id}`)}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginação */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> a <span className="font-medium">
                  {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}
                </span> de <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Anterior</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Próximo</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}