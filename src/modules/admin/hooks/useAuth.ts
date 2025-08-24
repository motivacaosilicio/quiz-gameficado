'use client';

import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { createAdminClient, checkAdminAuth } from '../adapters/supabase';

interface UseAuthReturn {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  error: Error | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Hook para gerenciar autenticação do admin
 * Verifica autenticação e fornece funções de login/logout
 */
export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Verificar autenticação quando o componente montar
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const currentSession = await checkAdminAuth();
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido na autenticação'));
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const supabase = createAdminClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      setSession(data.session);
      setIsAuthenticated(!!data.session);
    } catch (err) {
      console.error('Erro ao realizar login:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido no login'));
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const supabase = createAdminClient();
      const { error: authError } = await supabase.auth.signOut();
      
      if (authError) throw authError;
      
      setSession(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Erro ao realizar logout:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido no logout'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    error,
    session,
    login,
    logout,
  };
} 