/**
 * Tipos para o módulo Admin
 */

// Estatísticas do Dashboard
export interface DashboardStats {
  totalLeads: number;
  totalSessions: number;
  conversionRate: number;
  quizCompletions: number;
  dailyLeads: { date: string; count: number }[];
}

// Tipos relacionados a leads
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  quiz_id: string;
  session_id: string;
  created_at: string;
  additional_data?: Record<string, any>;
}

// Tipos relacionados a quizzes para o Admin
export interface AdminQuiz {
  id: string;
  slug: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  final_url: string | null;
  webhook_url: string | null;
  sessions_count?: number;
  leads_count?: number;
}

// Tipos relacionados à navegação do Admin
export interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
} 