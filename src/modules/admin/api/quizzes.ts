import { createAdminClient } from '../adapters/supabase';
import { AdminQuiz } from '../types';

/**
 * Busca todos os quizzes com estatísticas
 */
export async function getQuizzes(): Promise<AdminQuiz[]> {
  const supabase = createAdminClient();
  
  try {
    // Buscar quizzes básicos
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    if (!quizzes) return [];
    
    // Para cada quiz, buscar contagens
    const quizzesWithStats = await Promise.all(
      quizzes.map(async (quiz) => {
        // Buscar contagem de sessões
        const { count: sessionsCount, error: sessionsError } = await supabase
          .from('quiz_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('quiz_id', quiz.id);
          
        if (sessionsError) {
          console.error('Erro ao buscar sessões:', sessionsError);
        }
        
        // Buscar contagem de leads
        const { count: leadsCount, error: leadsError } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('quiz_id', quiz.id);
          
        if (leadsError) {
          console.error('Erro ao buscar leads:', leadsError);
        }
        
        return {
          ...quiz,
          sessions_count: sessionsCount || 0,
          leads_count: leadsCount || 0
        } as AdminQuiz;
      })
    );
    
    return quizzesWithStats;
    
  } catch (error) {
    console.error('Erro ao buscar quizzes:', error);
    throw error;
  }
}

/**
 * Busca um quiz específico por ID
 */
export async function getQuizById(id: string): Promise<AdminQuiz | null> {
  const supabase = createAdminClient();
  
  try {
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    if (!quiz) return null;
    
    // Buscar contagens relacionadas
    const [
      { count: sessionsCount, error: sessionsError },
      { count: leadsCount, error: leadsError }
    ] = await Promise.all([
      supabase
        .from('quiz_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('quiz_id', id),
        
      supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('quiz_id', id)
    ]);
    
    if (sessionsError) {
      console.error('Erro ao buscar sessões:', sessionsError);
    }
    
    if (leadsError) {
      console.error('Erro ao buscar leads:', leadsError);
    }
    
    return {
      ...quiz,
      sessions_count: sessionsCount || 0,
      leads_count: leadsCount || 0
    } as AdminQuiz;
    
  } catch (error) {
    console.error('Erro ao buscar quiz:', error);
    throw error;
  }
}

/**
 * Atualiza um quiz existente
 */
export async function updateQuiz(id: string, data: Partial<AdminQuiz>): Promise<AdminQuiz | null> {
  const supabase = createAdminClient();
  
  try {
    // Remover campos que não devem ser atualizados diretamente
    const { sessions_count, leads_count, created_at, ...updateData } = data;
    
    const { data: updated, error } = await supabase
      .from('quizzes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return updated as AdminQuiz;
    
  } catch (error) {
    console.error('Erro ao atualizar quiz:', error);
    throw error;
  }
} 