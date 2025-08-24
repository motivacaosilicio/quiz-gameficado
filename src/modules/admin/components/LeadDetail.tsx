'use client';

import React, { useState, useEffect } from 'react';
import { getLeadById, getLeadAnswers } from '../api/leads';
import { Lead } from '../types';
import AdminButton from './ui/AdminButton';
import Card from './ui/Card';

interface LeadDetailProps {
  leadId: string;
  onBack?: () => void;
}

/**
 * Componente de Detalhes do Lead
 * Exibe informações detalhadas de um lead específico, incluindo respostas
 */
const LeadDetail: React.FC<LeadDetailProps> = ({ leadId, onBack }) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Buscar dados do lead quando o componente montar
  useEffect(() => {
    fetchLeadData();
  }, [leadId]);

  // Função para buscar dados do lead e suas respostas
  const fetchLeadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Buscar lead e suas respostas em paralelo
      const [leadData, answersData] = await Promise.all([
        getLeadById(leadId),
        getLeadAnswers(leadId)
      ]);
      
      setLead(leadData);
      setAnswers(answersData);
    } catch (err) {
      console.error('Erro ao buscar dados do lead:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao carregar dados'));
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar estado de carregamento
  if (isLoading && !lead) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={onBack}
          >
            Voltar
          </AdminButton>
          <h1 className="text-2xl font-semibold text-gray-900 ml-4">Carregando Lead...</h1>
        </div>
        
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  // Renderizar erro
  if (error && !lead) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={onBack}
          >
            Voltar
          </AdminButton>
          <h1 className="text-2xl font-semibold text-gray-900 ml-4">Erro</h1>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error.message}
              </p>
            </div>
          </div>
        </div>
        
        <AdminButton
          variant="primary"
          onClick={fetchLeadData}
        >
          Tentar Novamente
        </AdminButton>
      </div>
    );
  }

  // Se não tiver dados
  if (!lead) return null;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={onBack}
          >
            Voltar
          </AdminButton>
          <h1 className="text-2xl font-semibold text-gray-900 ml-4">
            Lead: {lead.name}
          </h1>
        </div>
        
        <div className="flex space-x-2">
          <AdminButton
            variant="info"
            onClick={() => console.log('Exportar lead', lead.id)}
          >
            Exportar
          </AdminButton>
        </div>
      </div>
      
      {/* Informações do Lead */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dados Pessoais */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Dados do Lead</h2>
          <div className="border-t border-gray-200 pt-4">
            <dl className="divide-y divide-gray-200">
              <div className="grid grid-cols-3 gap-4 py-3">
                <dt className="text-sm font-medium text-gray-500">Nome</dt>
                <dd className="text-sm text-gray-900 col-span-2">{lead.name}</dd>
              </div>
              <div className="grid grid-cols-3 gap-4 py-3">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  <a href={`mailto:${lead.email}`} className="text-indigo-600 hover:underline">
                    {lead.email}
                  </a>
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-4 py-3">
                <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  {lead.phone ? (
                    <a href={`tel:${lead.phone}`} className="text-indigo-600 hover:underline">
                      {lead.phone}
                    </a>
                  ) : (
                    <span className="text-gray-500 italic">Não informado</span>
                  )}
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-4 py-3">
                <dt className="text-sm font-medium text-gray-500">Data</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  {new Date(lead.created_at).toLocaleString()}
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-4 py-3">
                <dt className="text-sm font-medium text-gray-500">Quiz</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  {lead.quiz_title || <span className="text-gray-500 italic">Não informado</span>}
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-4 py-3">
                <dt className="text-sm font-medium text-gray-500">Origem</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  {lead.source || <span className="text-gray-500 italic">Direta</span>}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Informações da Sessão */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Informações da Sessão</h2>
          <div className="border-t border-gray-200 pt-4">
            <dl className="divide-y divide-gray-200">
              <div className="grid grid-cols-3 gap-4 py-3">
                <dt className="text-sm font-medium text-gray-500">ID da Sessão</dt>
                <dd className="text-sm text-gray-900 col-span-2 truncate">
                  {lead.session_id || <span className="text-gray-500 italic">Não disponível</span>}
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-4 py-3">
                <dt className="text-sm font-medium text-gray-500">Início da Sessão</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  {lead.session_started_at ? 
                    new Date(lead.session_started_at).toLocaleString() : 
                    <span className="text-gray-500 italic">Não disponível</span>
                  }
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-4 py-3">
                <dt className="text-sm font-medium text-gray-500">Duração</dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  {lead.session_started_at && lead.created_at ? (
                    `${Math.round((new Date(lead.created_at).getTime() - new Date(lead.session_started_at).getTime()) / 1000 / 60)} minutos`
                  ) : (
                    <span className="text-gray-500 italic">Não disponível</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      
      {/* Respostas do Quiz */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Respostas do Quiz</h2>
        {answers.length > 0 ? (
          <div className="border-t border-gray-200 pt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Pergunta
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Resposta
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {answers.map((answer, index) => (
                    <tr key={index}>
                      <td className="whitespace-normal py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {answer.question_text}
                      </td>
                      <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                        {answer.answer_text}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(answer.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-500 italic">Nenhuma resposta registrada</p>
          </div>
        )}
      </div>
      
      {/* Jornada do Usuário */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Jornada do Usuário</h2>
        <div className="border-t border-gray-200 pt-4">
          <div className="text-center">
            <p className="text-gray-500 italic mb-4">
              Visualização da jornada será implementada em uma atualização futura
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail; 