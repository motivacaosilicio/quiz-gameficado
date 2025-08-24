'use client';

import { useState, useEffect } from 'react';
import { DashboardStats } from '../types';
import { getDashboardStats } from '../api/dashboard';

type PeriodType = '7' | '30' | 'all';

interface UseDashboardReturn {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: Error | null;
  period: PeriodType;
  setPeriod: (period: PeriodType) => void;
  refreshData: () => Promise<void>;
}

/**
 * Hook para gerenciar dados do dashboard
 * Busca e gerencia estatísticas com filtro de período
 */
export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [period, setPeriod] = useState<PeriodType>('7');

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const days = period === 'all' ? null : parseInt(period, 10);
      const data = await getDashboardStats(days);
      setStats(data);
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao carregar dados'));
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar dados quando o componente montar ou período mudar
  useEffect(() => {
    fetchData();
  }, [period]);

  return {
    stats,
    isLoading,
    error,
    period,
    setPeriod,
    refreshData: fetchData,
  };
} 