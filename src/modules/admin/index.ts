/**
 * Módulo Admin
 * 
 * Este módulo contém todas as funcionalidades relacionadas à administração 
 * do sistema, incluindo dashboard, gerenciamento de quizzes e leads.
 */

// Exportar tipos
export * from './types';

// Exportar hooks
export * from './hooks';

// Exportar componentes específicos em vez de todo o diretório
export { Dashboard } from './components';
export { QuizzesList } from './components';
export { LeadDetail } from './components';
export { LeadsList } from './components';

// Exportar funções de API específicas
export { getDashboardStats } from './api/dashboard';
export { getQuizzes, getQuizById, updateQuiz } from './api/quizzes';
export { getLeads, getLeadById, getLeadAnswers } from './api/leads';

// Exportar adaptadores específicos
export { createAdminClient } from './adapters/supabase'; 