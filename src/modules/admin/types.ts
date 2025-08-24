import { User } from '@supabase/auth-js';

// Tipos base

export interface DashboardStats {
  totalLeads: number;
  totalSessions: number;
  conversionRate: number;
  dailyLeads: { date: string; count: number }[];
  dailySessions: { date: string; count: number }[];
}

export interface AdminQuiz {
  id: string;
  title: string;
  description: string;
  slug: string;
  final_url: string | null;
  webhook_url: string | null;
  created_at: string;
  updated_at: string;
  sessions_count?: number;
  leads_count?: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  quiz_id: string;
  session_id: string;
  // Propriedades adicionais para exibição no componente LeadDetail
  quiz_title?: string;
  source?: string;
  session_started_at?: string;
}

// Tipos para interfaces de hooks

export interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  session: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface UseDashboardReturn {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: Error | null;
  period: string;
  setPeriod: (period: string) => void;
  refreshData: () => Promise<void>;
} 