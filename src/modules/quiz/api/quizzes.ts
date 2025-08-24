import { NextResponse } from 'next/server';
import { createQuizClient } from '../adapters/supabase';
import { Quiz } from '../types';

/**
 * Recupera todos os quizzes disponíveis diretamente do banco de dados e
 * retorna em formato de resposta JSON.
 */
export async function getAllQuizzesApi() {
  try {
    // Recupera quizzes diretamente do banco de dados
    const supabase = createQuizClient();
    console.log('Supabase client created');
    
    const { data, error } = await supabase
      .from('quizzes')
      .select('id, title, slug, description');
      
    if (error) {
      console.error('Erro ao carregar quizzes:', error);
      return NextResponse.json({ error: 'Erro ao carregar quizzes' }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

/**
 * Cria uma nova sessão para um quiz com o slug especificado
 */
export async function createQuizSessionApi(slug: string, body: any) {
  try {
    console.log(`Creating session for quiz with slug: ${slug}`);
    console.log(`Request body:`, body);
    
    // Extrair quiz_id do body
    const { quiz_id } = body;
    
    // Validação básica
    if (!quiz_id) {
      console.log('Quiz ID not provided');
      return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 });
    }
    
    console.log(`Quiz ID: ${quiz_id} Slug: ${slug}`);
    
    // Criar cliente Supabase
    const supabase = createQuizClient();
    console.log('Supabase client created');
    
    // Verificar se o quiz existe
    console.log(`Checking if quiz exists with slug: ${slug}`);
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (quizError || !quizData) {
      console.error('Quiz not found:', quizError);
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    
    console.log('Quiz data:', quizData);
    
    // Criar nova sessão
    console.log(`Creating new quiz session with quiz ID: ${quiz_id}`);
    const { data: sessionData, error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert({
        quiz_id,
        current_step: 'intro',
        session_token: crypto.randomUUID()
      })
      .select('*')
      .single();
      
    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
    
    console.log('Session created successfully:', sessionData);
    
    return NextResponse.json(sessionData, { status: 201 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Busca todos os quizzes disponíveis
 * 
 * @returns Array de quizzes organizados por data de criação decrescente
 */
export async function getQuizzes(): Promise<Quiz[]> {
  try {
    const client = createQuizClient();
    
    const { data, error } = await client
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar quizzes:', error);
      throw new Error('Falha ao buscar quizzes');
    }
    
    return data || [];
  } catch (err) {
    console.error('Erro em getQuizzes:', err);
    return [];
  }
}

/**
 * Busca um quiz pelo slug
 * 
 * @param slug O slug do quiz a ser buscado
 * @returns O quiz encontrado ou null se não existir
 */
export async function getQuizBySlug(slug: string): Promise<Quiz | null> {
  try {
    const client = createQuizClient();
    
    const { data, error } = await client
      .from('quizzes')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar quiz com slug ${slug}:`, error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error(`Erro em getQuizBySlug para ${slug}:`, err);
    return null;
  }
} 