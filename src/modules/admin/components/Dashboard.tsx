'use client';

import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import Card from './ui/Card';
import AdminButton from './ui/AdminButton';

/**
 * Componente Dashboard principal
 * Exibe estatísticas e métricas gerais do sistema
 */
const Dashboard: React.FC = () => {
  const { stats, isLoading, error, period, setPeriod, refreshData } = useDashboard();

  // Renderizar estado de carregamento
  if (isLoading && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="animate-pulse h-10 w-32 bg-gray-200 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-white shadow rounded-lg p-5 h-32"></div>
          ))}
        </div>
        
        <div className="animate-pulse bg-white shadow rounded-lg p-5 h-64"></div>
      </div>
    );
  }

  // Renderizar erro
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Erro ao carregar dados: {error.message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <AdminButton
            variant="primary"
            onClick={refreshData}
          >
            Tentar Novamente
          </AdminButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        {/* Seletor de período */}
        <div className="flex space-x-2">
          <AdminButton
            variant={period === '7' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setPeriod('7')}
          >
            7 dias
          </AdminButton>
          <AdminButton
            variant={period === '30' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setPeriod('30')}
          >
            30 dias
          </AdminButton>
          <AdminButton
            variant={period === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setPeriod('all')}
          >
            Todos
          </AdminButton>
        </div>
      </div>
      
      {/* Cards de estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card
            title="Total de Leads"
            value={stats.totalLeads}
            description="Leads capturados no período"
            icon={<span className="text-indigo-600 text-lg">👤</span>}
          />
          
          <Card
            title="Sessões de Quiz"
            value={stats.totalSessions}
            description="Sessões iniciadas no período"
            icon={<span className="text-indigo-600 text-lg">📋</span>}
          />
          
          <Card
            title="Taxa de Conversão"
            value={`${stats.conversionRate}%`}
            description="Visitantes convertidos em leads"
            icon={<span className="text-indigo-600 text-lg">📈</span>}
          />
          
          <Card
            title="Quizzes Completados"
            value={stats.quizCompletions}
            description="Quizzes finalizados com sucesso"
            icon={<span className="text-indigo-600 text-lg">✅</span>}
          />
        </div>
      )}
      
      {/* Gráfico de leads diários */}
      {stats && stats.dailyLeads.length > 0 && (
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Leads por Dia
          </h2>
          <div className="h-64 flex items-end space-x-2">
            {stats.dailyLeads.map((item, index) => {
              // Encontrar o valor máximo para normalização
              const maxCount = Math.max(...stats.dailyLeads.map(d => d.count));
              // Calcular altura relativa (entre 10% e 100%)
              const height = maxCount > 0 
                ? Math.max(10, Math.round((item.count / maxCount) * 100)) 
                : 10;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-indigo-500 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-1 truncate w-full text-center">
                    {item.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 