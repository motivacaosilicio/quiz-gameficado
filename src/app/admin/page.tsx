'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Tipos
interface DashboardStats {
  totalLeads: number;
  totalSessions: number;
  conversionRate: number;
  quizCompletions: number;
  dailyLeads: { date: string; count: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'7' | '30' | 'all'>('7');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        
        // Buscar estatísticas gerais
        const { data: totalLeadsData, error: leadsError } = await supabase
          .from('leads')
          .select('count', { count: 'exact' });
        
        if (leadsError) throw leadsError;
        
        const { data: totalSessionsData, error: sessionsError } = await supabase
          .from('quiz_sessions')
          .select('count', { count: 'exact' });
        
        if (sessionsError) throw sessionsError;
        
        const { data: completionsData, error: completionsError } = await supabase
          .from('quiz_sessions')
          .select('count', { count: 'exact' })
          .not('finished_at', 'is', null);
        
        if (completionsError) throw completionsError;

        // Buscar dados diários limitados pelo período
        let dateFilter;
        if (period !== 'all') {
          const daysAgo = new Date();
          daysAgo.setDate(daysAgo.getDate() - parseInt(period));
          dateFilter = daysAgo.toISOString();
        }
        
        let query = supabase
          .from('leads')
          .select('created_at');
          
        if (dateFilter) {
          query = query.gte('created_at', dateFilter);
        }
        
        const { data: dailyLeadsData, error: dailyError } = await query;
        
        if (dailyError) throw dailyError;
        
        // Processar dados diários
        const dailyLeadCounts: Record<string, number> = {};
        dailyLeadsData?.forEach(lead => {
          const date = new Date(lead.created_at).toISOString().split('T')[0];
          dailyLeadCounts[date] = (dailyLeadCounts[date] || 0) + 1;
        });
        
        const dailyLeads = Object.entries(dailyLeadCounts)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));

        // Calcular taxa de conversão
        const sessionsCount = totalSessionsData?.[0]?.count || 0;
        const leadsCount = totalLeadsData?.[0]?.count || 0;
        const completionsCount = completionsData?.[0]?.count || 0;
        const conversionRate = sessionsCount > 0 
          ? (leadsCount / sessionsCount) * 100 
          : 0;

        setStats({
          totalLeads: leadsCount,
          totalSessions: sessionsCount,
          conversionRate,
          quizCompletions: completionsCount,
          dailyLeads,
        });
      } catch (err: any) {
        console.error('Erro ao buscar dados do dashboard:', err);
        setError(err.message || 'Erro ao carregar os dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [period]);

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral do desempenho dos quizzes e captação de leads
        </p>
      </div>
      
      {/* Seletor de período */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Período:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => setPeriod('7')}
              className={`px-3 py-1 text-sm rounded-md ${
                period === '7'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setPeriod('30')}
              className={`px-3 py-1 text-sm rounded-md ${
                period === '30'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              30 dias
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`px-3 py-1 text-sm rounded-md ${
                period === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todo período
            </button>
          </div>
        </div>
      </div>
      
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">Total de Leads</p>
              <p className="text-2xl font-semibold text-gray-800">{stats?.totalLeads || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">Taxa de Conversão</p>
              <p className="text-2xl font-semibold text-gray-800">{stats?.conversionRate.toFixed(1) || 0}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">Sessões Iniciadas</p>
              <p className="text-2xl font-semibold text-gray-800">{stats?.totalSessions || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">Questionários Completados</p>
              <p className="text-2xl font-semibold text-gray-800">{stats?.quizCompletions || 0}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Leads Captados por Dia</h2>
          <div className="h-64">
            {stats?.dailyLeads && stats.dailyLeads.length > 0 ? (
              <div className="h-full flex items-end space-x-2">
                {stats.dailyLeads.map((day) => {
                  const maxCount = Math.max(...stats.dailyLeads.map(d => d.count));
                  const height = day.count > 0 ? (day.count / maxCount) * 100 : 0;
                  
                  return (
                    <div key={day.date} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                      <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                        {new Date(day.date).toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: '2-digit'
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Não há dados para o período selecionado
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Performance dos Questionários</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Dados insuficientes para gerar o gráfico
          </div>
        </div>
      </div>
    </div>
  );
}