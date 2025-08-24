'use client';

import React, { useState, useEffect } from 'react';
import { getQuizzes } from '../api/quizzes';
import { AdminQuiz } from '../types';
import DataTable from './ui/DataTable';
import AdminButton from './ui/AdminButton';
import AdminInput from './ui/AdminInput';

/**
 * Componente de Listagem de Quizzes
 * Exibe todos os quizzes com estatísticas e opções de gerenciamento
 */
const QuizzesList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<AdminQuiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Buscar quizzes quando o componente montar
  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Função para buscar quizzes
  const fetchQuizzes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error('Erro ao buscar quizzes:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao carregar quizzes'));
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar quizzes baseado na pesquisa
  const filteredQuizzes = searchTerm
    ? quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : quizzes;

  // Configuração das colunas da tabela
  const columns = [
    {
      header: 'Quiz',
      accessor: (quiz: AdminQuiz) => (
        <div>
          <div className="font-medium text-gray-900">{quiz.title}</div>
          <div className="text-xs text-gray-500">{quiz.slug}</div>
        </div>
      ),
    },
    {
      header: 'Sessões',
      accessor: 'sessions_count',
      className: 'text-center',
    },
    {
      header: 'Leads',
      accessor: 'leads_count',
      className: 'text-center',
    },
    {
      header: 'Conversão',
      accessor: (quiz: AdminQuiz) => {
        const rate = quiz.sessions_count 
          ? Math.round((quiz.leads_count / quiz.sessions_count) * 100) 
          : 0;
        return `${rate}%`;
      },
      className: 'text-center',
    },
    {
      header: 'Data de Criação',
      accessor: (quiz: AdminQuiz) => new Date(quiz.created_at).toLocaleDateString(),
    },
    {
      header: 'Ações',
      accessor: (quiz: AdminQuiz) => (
        <div className="flex space-x-2 justify-end">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => console.log('Ver quiz', quiz.id)}
          >
            Ver
          </AdminButton>
          <AdminButton
            variant="primary"
            size="sm"
            onClick={() => console.log('Editar quiz', quiz.id)}
          >
            Editar
          </AdminButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Quizzes</h1>
        
        <AdminButton
          variant="primary"
          onClick={() => console.log('Criar novo quiz')}
        >
          Criar Quiz
        </AdminButton>
      </div>
      
      {/* Barra de pesquisa */}
      <div className="w-full md:w-1/3">
        <AdminInput
          placeholder="Buscar quiz..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Tabela de quizzes */}
      <DataTable
        columns={columns}
        data={filteredQuizzes}
        keyExtractor={(quiz) => quiz.id}
        onRowClick={(quiz) => console.log('Clicou no quiz', quiz.id)}
        isLoading={isLoading}
        emptyMessage="Nenhum quiz encontrado"
      />
      
      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Erro ao carregar quizzes: {error.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizzesList; 