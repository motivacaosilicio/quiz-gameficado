import { NextResponse } from 'next/server';
import { createQuizClient } from '../adapters/supabase';

/**
 * Registra um evento ocorrido durante a sessão de quiz
 */
export async function recordSessionEventApi(sessionId: string, body: any) {
  try {
    console.log(`Inserting quiz event:`, body);
    
    if (!body || !body.event_type || !body.event_data) {
      return NextResponse.json({ message: "Dados do evento incompletos" }, { status: 400 });
    }
    
    // Criar cliente Supabase
    const supabase = createQuizClient();
    console.log('Cliente Supabase criado no servidor');
    
    // Inserir o evento no banco de dados
    const { data, error } = await supabase
      .from('quiz_events')
      .insert({
        session_id: sessionId,
        event_type: body.event_type,
        event_data: body.event_data,
        step_id: body.step_id
      })
      .select()
      .single();
      
    if (error) {
      console.error('Erro ao registrar evento de quiz:', error);
      return NextResponse.json({ message: "Falha ao registrar evento" }, { status: 500 });
    }
    
    console.log('Quiz event created successfully:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    console.error('Erro inesperado:', e);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

/**
 * Registra uma resposta dada pelo usuário durante a sessão de quiz
 */
export async function recordSessionAnswerApi(sessionId: string, body: any) {
  try {
    console.log(`Inserting quiz answer:`, body);
    
    if (!body || !body.step_id || !body.question || !body.answer) {
      return NextResponse.json({ message: "Dados da resposta incompletos" }, { status: 400 });
    }
    
    // Criar cliente Supabase
    const supabase = createQuizClient();
    console.log('Cliente Supabase criado no servidor');
    
    // Inserir a resposta no banco de dados
    const { data, error } = await supabase
      .from('quiz_answers')
      .insert({
        session_id: sessionId,
        step_id: body.step_id,
        question: body.question,
        answer: body.answer
      })
      .select()
      .single();
      
    if (error) {
      console.error('Erro ao registrar resposta de quiz:', error);
      return NextResponse.json({ message: "Falha ao registrar resposta" }, { status: 500 });
    }
    
    console.log('Quiz answer created successfully:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    console.error('Erro inesperado:', e);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

/**
 * Marca uma sessão de quiz como concluída
 */
export async function completeSessionApi(sessionId: string) {
  try {
    // Criar cliente Supabase
    const supabase = createQuizClient();
    
    // Atualizar o status da sessão para concluída
    const { data, error } = await supabase
      .from('quiz_sessions')
      .update({ 
        finished_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single();
      
    if (error) {
      console.error('Erro ao completar sessão de quiz:', error);
      return NextResponse.json({ message: "Falha ao completar sessão" }, { status: 500 });
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    console.error('Erro inesperado:', e);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
} 