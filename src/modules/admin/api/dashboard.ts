import { createAdminClient } from '../adapters/supabase';
import { DashboardStats } from '../types';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

interface CountResult {
  count: number;
}

/**
 * Obtém as estatísticas gerais para o dashboard
 * @param days Número de dias para filtrar os dados (7, 30 ou null para todos)
 */
export async function getDashboardStats(days?: number | null): Promise<DashboardStats> {
  const supabase = createAdminClient();
  
  try {
    // Configura filtro de data se necessário
    let dateFilter;
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      dateFilter = daysAgo.toISOString();
    }
    
    // Busca contagens em paralelo para melhor performance
    const [
      leadsResponse,
      sessionsResponse,
      completionsResponse,
      dailyLeadsResponse
    ] = await Promise.all([
      // Total de leads
      supabase
        .from('leads')
        .select('count', { count: 'exact', head: true }) as Promise<PostgrestSingleResponse<CountResult>>,
        
      // Total de sessões
      supabase
        .from('quiz_sessions')
        .select('count', { count: 'exact', head: true }) as Promise<PostgrestSingleResponse<CountResult>>,
        
      // Sessões completadas
      supabase
        .from('quiz_sessions')
        .select('count', { count: 'exact', head: true })
        .not('finished_at', 'is', null) as Promise<PostgrestSingleResponse<CountResult>>,
        
      // Dados de leads por dia para o gráfico
      supabase
        .from('leads')
        .select('created_at')
        .gte('created_at', dateFilter ?? '')
        .order('created_at', { ascending: true })
    ]);
    
    if (leadsResponse.error) throw leadsResponse.error;
    if (sessionsResponse.error) throw sessionsResponse.error;
    if (completionsResponse.error) throw completionsResponse.error;
    if (dailyLeadsResponse.error) throw dailyLeadsResponse.error;
    
    // Calcula taxa de conversão
    const totalLeads = leadsResponse.count ?? 0;
    const totalSessions = sessionsResponse.count ?? 0;
    const completions = completionsResponse.count ?? 0;
    
    const conversionRate = totalSessions > 0 
      ? Math.round((totalLeads / totalSessions) * 100) 
      : 0;
    
    // Processa dados diários para o gráfico
    const dailyLeadsMap = new Map<string, number>();
    
    if (dailyLeadsResponse.data) {
      dailyLeadsResponse.data.forEach((lead) => {
        const date = new Date(lead.created_at).toLocaleDateString();
        dailyLeadsMap.set(date, (dailyLeadsMap.get(date) || 0) + 1);
      });
    }
    
    const dailyLeads = Array.from(dailyLeadsMap.entries()).map(([date, count]) => ({
      date,
      count
    }));
    
    return {
      totalLeads,
      totalSessions,
      conversionRate,
      quizCompletions: completions,
      dailyLeads
    };
    
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    throw error;
  }
}