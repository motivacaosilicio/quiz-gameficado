import { createQuizClient } from '@/modules/quiz/adapters/supabase';
import { NextResponse } from 'next/server';
import { PostgrestError } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Verificar se as variáveis de ambiente estão definidas
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Definida' : 'Não definida',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Definida' : 'Não definida',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Definida' : 'Não definida',
    };

    console.log('Variáveis de ambiente:', env);

    // Criar cliente Supabase
    console.log('Criando cliente Supabase...');
    const supabase = createQuizClient();
    console.log('Cliente Supabase criado com sucesso');

    // Verificação simples - listar quizzes
    console.log('Verificando acesso às tabelas...');
    
    // Primeiro tentar acessar a tabela quizzes
    const { data: quizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select('id, slug, title')
      .limit(5);

    if (quizzesError) {
      console.error('Erro ao acessar quizzes:', quizzesError);
      return NextResponse.json({ 
        success: false, 
        error: (quizzesError as PostgrestError).message,
        env 
      }, { status: 500 });
    }

    // Tentar acessar outras tabelas para diagnóstico completo
    const { data: sessionsCount, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select('id', { count: 'exact', head: true });
      
    const { data: personsCount, error: personsError } = await supabase
      .from('persons')
      .select('id', { count: 'exact', head: true });
      
    const { data: eventsCount, error: eventsError } = await supabase
      .from('quiz_events')
      .select('id', { count: 'exact', head: true });
      
    const { data: answersCount, error: answersError } = await supabase
      .from('quiz_answers')
      .select('id', { count: 'exact', head: true });
      
    // Construir uma resposta completa com diagnóstico
    const diagnosticInfo = {
      status: true,
      quizzes: {
        accessible: !quizzesError,
        count: quizzes?.length || 0,
        error: quizzesError ? (quizzesError as PostgrestError).message : null
      },
      sessions: {
        accessible: !sessionsError,
        count: sessionsCount?.length || 0,
        error: sessionsError ? (sessionsError as PostgrestError).message : null
      },
      persons: {
        accessible: !personsError,
        count: personsCount?.length || 0,
        error: personsError ? (personsError as PostgrestError).message : null
      },
      events: {
        accessible: !eventsError,
        count: eventsCount?.length || 0,
        error: eventsError ? (eventsError as PostgrestError).message : null
      },
      answers: {
        accessible: !answersError,
        count: answersCount?.length || 0,
        error: answersError ? (answersError as PostgrestError).message : null
      }
    };

    return NextResponse.json({ 
      success: true, 
      message: 'Conexão com o Supabase bem-sucedida!',
      diagnosticInfo,
      env
    }, { status: 200 });
  } catch (error: any) {
    console.error('Erro inesperado ao conectar com o Supabase:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}