'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import React from 'react';

interface LeadDetails {
  id: string;
  created_at: string;
  person: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    created_at: string;
  };
  quiz: {
    id: string;
    title: string;
    slug: string;
  };
  session: {
    id: string;
    started_at: string;
    finished_at: string | null;
  };
  answers: {
    id: string;
    question: string;
    answer: string;
    step_id: string;
    created_at: string;
  }[];
  events: {
    id: string;
    event_type: string;
    event_data: any;
    created_at: string;
  }[];
}

export default function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [leadDetails, setLeadDetails] = useState<LeadDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Usar React.use() para acessar os parâmetros de forma segura
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    async function fetchLeadDetails() {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const supabase = createClient();
        
        // Buscar informações do lead
        const { data: leadData, error: leadError } = await supabase
          .from('leads')
          .select(`
            id,
            created_at,
            persons:person_id (*),
            quiz_sessions:quiz_session_id (
              id,
              started_at,
              finished_at,
              quizzes:quiz_id (
                id,
                title,
                slug
              )
            )
          `)
          .eq('id', id)
          .single();
        
        if (leadError) throw leadError;
        if (!leadData) throw new Error('Lead não encontrado');
        
        // Buscar respostas do questionário
        const { data: answersData, error: answersError } = await supabase
          .from('quiz_answers')
          .select('*')
          .eq('session_id', leadData.quiz_sessions.id)
          .order('created_at', { ascending: true });
        
        if (answersError) throw answersError;
        
        // Buscar eventos do lead
        const { data: eventsData, error: eventsError } = await supabase
          .from('quiz_events')
          .select('*')
          .eq('session_id', leadData.quiz_sessions.id)
          .order('created_at', { ascending: true });
        
        if (eventsError) throw eventsError;
        
        // Organizar os dados
        setLeadDetails({
          id: leadData.id,
          created_at: leadData.created_at,
          person: leadData.persons,
          quiz: {
            id: leadData.quiz_sessions.quizzes.id,
            title: leadData.quiz_sessions.quizzes.title,
            slug: leadData.quiz_sessions.quizzes.slug,
          },
          session: {
            id: leadData.quiz_sessions.id,
            started_at: leadData.quiz_sessions.started_at,
            finished_at: leadData.quiz_sessions.finished_at,
          },
          answers: answersData || [],
          events: eventsData || [],
        });
      } catch (err: any) {
        console.error('Erro ao buscar detalhes do lead:', err);
        setError(err.message || 'Erro ao carregar os detalhes do lead');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeadDetails();
  }, [id]);

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

  if (!leadDetails) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Aviso!</strong>
        <span className="block sm:inline"> Lead não encontrado</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para a lista
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Detalhes do Lead
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Informações pessoais e dados do questionário
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {leadDetails.person.name || 'Não informado'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {leadDetails.person.email || 'Não informado'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Telefone</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {leadDetails.person.phone || 'Não informado'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Questionário</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {leadDetails.quiz.title}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Data de captura</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(leadDetails.created_at).toLocaleString('pt-BR')}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                {leadDetails.session.finished_at ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completo
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Incompleto
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Respostas do Questionário
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Respostas fornecidas pelo lead
          </p>
        </div>
        <div className="border-t border-gray-200">
          {leadDetails.answers.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {leadDetails.answers.map((answer, index) => (
                <li key={answer.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="text-sm font-medium text-gray-900">
                      {answer.question}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {answer.answer}
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      {new Date(answer.created_at).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 text-center text-sm text-gray-500">
              Nenhuma resposta encontrada
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Linha do Tempo
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Eventos registrados durante a interação
          </p>
        </div>
        <div className="border-t border-gray-200">
          {leadDetails.events.length > 0 ? (
            <div className="flow-root px-4 py-5">
              <ul className="-mb-8">
                {leadDetails.events.map((event, eventIdx) => (
                  <li key={event.id}>
                    <div className="relative pb-8">
                      {eventIdx !== leadDetails.events.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-blue-100">
                            <svg className="h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-900">
                              {event.event_type.replace(/_/g, ' ').toUpperCase()}
                            </p>
                            {event.event_data && (
                              <p className="mt-1 text-xs text-gray-500">
                                {JSON.stringify(event.event_data)}
                              </p>
                            )}
                          </div>
                          <div className="text-right text-xs whitespace-nowrap text-gray-500">
                            {new Date(event.created_at).toLocaleString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="px-4 py-5 text-center text-sm text-gray-500">
              Nenhum evento encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}