'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface QuizItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  created_at: string;
  stats: {
    sessions: number;
    leads: number;
    completionRate: number;
  };
}

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuizzes() {
      setIsLoading(true);
      try {
        // Usar diretamente o cliente Supabase
        const { createClient: createDirectClient } = await import('@supabase/supabase-js');
        const supabase = createDirectClient(
          'http://127.0.0.1:54321',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
        );
        
        console.log('Buscando quizzes...');
        
        // Buscar quizzes
        const { data: quizzesData, error: quizzesError } = await supabase
          .from('quizzes')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (quizzesError) {
          console.error('Erro ao buscar quizzes:', quizzesError);
          throw quizzesError;
        }
        
        console.log('Quizzes encontrados:', quizzesData?.length || 0);
        
        // Para cada quiz, buscar estatísticas
        const quizzesWithStats = await Promise.all(
          (quizzesData || []).map(async (quiz) => {
            console.log('Buscando estatísticas para quiz:', quiz.id);
            
            // Buscar total de sessões
            const { data: sessionsData, error: sessionsError } = await supabase
              .from('quiz_sessions')
              .select('count', { count: 'exact' })
              .eq('quiz_id', quiz.id);
            
            if (sessionsError) throw sessionsError;
            
            // Buscar total de leads - Consulta separada para evitar erro de embedded resource
            // Primeiro buscamos todos os IDs de sessão para este quiz
            const { data: sessionsIdsData, error: sessionsIdsError } = await supabase
              .from('quiz_sessions')
              .select('id')
              .eq('quiz_id', quiz.id);
              
            if (sessionsIdsError) throw sessionsIdsError;
            
            // Usamos os IDs de sessão para buscar os leads
            let leadsCount = 0;
            if (sessionsIdsData && sessionsIdsData.length > 0) {
              const sessionIds = sessionsIdsData.map(s => s.id);
              const { data: leadsData, error: leadsError } = await supabase
                .from('leads')
                .select('count', { count: 'exact' })
                .in('quiz_session_id', sessionIds);
                
              if (leadsError) throw leadsError;
              leadsCount = leadsData?.[0]?.count || 0;
            }
            
            // Buscar taxa de conclusão (sessões completas / total de sessões)
            const { data: completedData, error: completedError } = await supabase
              .from('quiz_sessions')
              .select('count', { count: 'exact' })
              .eq('quiz_id', quiz.id)
              .not('finished_at', 'is', null);
            
            if (completedError) throw completedError;
            
            const sessionsCount = sessionsData?.[0]?.count || 0;
            // leadsCount já está definido acima
            const completedCount = completedData?.[0]?.count || 0;
            
            const completionRate = sessionsCount > 0 
              ? (completedCount / sessionsCount) * 100 
              : 0;
            
            return {
              ...quiz,
              stats: {
                sessions: sessionsCount,
                leads: leadsCount,
                completionRate,
              },
            };
          })
        );
        
        setQuizzes(quizzesWithStats);
        console.log('Dados de quizzes carregados com sucesso');
      } catch (err: any) {
        console.error('Erro ao buscar quizzes:', err);
        setError(err.message || 'Erro ao carregar os quizzes');
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuizzes();
  }, []);

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
          <h1 className="text-2xl font-bold text-gray-900">Questionários</h1>
          <p className="mt-1 text-sm text-gray-500">
            Lista de todos os quizzes disponíveis
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => window.location.href = '/admin/quizzes/new'}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Quiz
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">
                {quiz.title}
              </h3>
              <div className="mt-1 text-sm text-gray-500 h-12 overflow-hidden">
                {quiz.description || 'Sem descrição'}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-semibold text-gray-900">
                    {quiz.stats.sessions}
                  </div>
                  <div className="text-xs text-gray-500">Sessões</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-gray-900">
                    {quiz.stats.leads}
                  </div>
                  <div className="text-xs text-gray-500">Leads</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-gray-900">
                    {quiz.stats.completionRate.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500">Conclusão</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between">
              <div className="text-sm text-gray-500">
                <span className="whitespace-nowrap">
                  {new Date(quiz.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => window.location.href = `/quiz/${quiz.slug}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Visualizar
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => window.location.href = `/admin/quizzes/${quiz.id}/analytics`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Análises
                </button>
              </div>
            </div>
          </div>
        ))}

        {quizzes.length === 0 && (
          <div className="col-span-3 py-12 flex flex-col items-center justify-center text-center bg-white rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum questionário encontrado</h3>
            <p className="text-gray-500 mb-4">Crie seu primeiro questionário para começar a captar leads.</p>
            <button
              onClick={() => window.location.href = '/admin/quizzes/new'}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Criar questionário
            </button>
          </div>
        )}
      </div>
    </div>
  );
}