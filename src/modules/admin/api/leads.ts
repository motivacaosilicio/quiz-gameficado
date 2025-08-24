import { createAdminClient } from '../adapters/supabase';
import { Lead } from '../types';

/**
 * Busca todos os leads com paginação
 * @param page Página atual (começa em 1)
 * @param pageSize Quantidade de itens por página
 * @param search Texto para pesquisar em nome/email
 */
export async function getLeads(page = 1, pageSize = 10, search = ''): Promise<{
  leads: Lead[];
  total: number;
  totalPages: number;
}> {
  const supabase = createAdminClient();
  
  try {
    // Calcular offset para paginação
    const offset = (page - 1) * pageSize;
    
    // Construir query base
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' });
    
    // Adicionar filtro de pesquisa se fornecido
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    
    // Executar query com paginação
    const { data: leads, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);
      
    if (error) throw error;
    
    // Calcular total de páginas
    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);
    
    return {
      leads: leads || [],
      total,
      totalPages
    };
    
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    throw error;
  }
}

/**
 * Busca um lead específico por ID
 */
export async function getLeadById(id: string): Promise<Lead | null> {
  const supabase = createAdminClient();
  
  try {
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*, quiz_sessions!inner(*), quizzes!inner(*)')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return lead;
    
  } catch (error) {
    console.error('Erro ao buscar lead:', error);
    throw error;
  }
}

/**
 * Busca as respostas de um lead específico
 */
export async function getLeadAnswers(sessionId: string): Promise<any[]> {
  const supabase = createAdminClient();
  
  try {
    const { data: answers, error } = await supabase
      .from('quiz_session_answers')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    return answers || [];
    
  } catch (error) {
    console.error('Erro ao buscar respostas do lead:', error);
    throw error;
  }
} 