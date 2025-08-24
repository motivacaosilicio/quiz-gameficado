import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

// Interface para os dados do lead
interface LeadData {
  name: string;
  email: string;
  phone?: string;
  quiz_id: string;
  session_id: string;
  additional_data?: Record<string, any>;
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const data: LeadData = await request.json();
    
    // Validar dados obrigatórios
    if (!data.name || !data.email || !data.session_id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados obrigatórios não fornecidos' 
        }, 
        { status: 400 }
      );
    }
    
    // 1. Verificar se a pessoa já existe pelo email
    const { data: existingPerson, error: personCheckError } = await supabase
      .from('persons')
      .select('id')
      .eq('email', data.email)
      .maybeSingle();
      
    if (personCheckError) {
      console.error('Erro ao verificar pessoa existente:', personCheckError);
      return NextResponse.json(
        { success: false, error: personCheckError.message }, 
        { status: 500 }
      );
    }
    
    let personId;
    
    // 2. Se a pessoa não existe, criar nova pessoa
    if (!existingPerson) {
      const personData = {
        name: data.name,
        email: data.email,
        phone: data.phone || null
      };
      
      const { data: newPerson, error: createPersonError } = await supabase
        .from('persons')
        .insert(personData)
        .select('id')
        .single();
        
      if (createPersonError) {
        console.error('Erro ao criar pessoa:', createPersonError);
        return NextResponse.json(
          { success: false, error: createPersonError.message }, 
          { status: 500 }
        );
      }
      
      personId = newPerson.id;
    } else {
      personId = existingPerson.id;
      
      // Atualizar dados da pessoa se já existe
      const { error: updatePersonError } = await supabase
        .from('persons')
        .update({
          name: data.name,
          phone: data.phone || null
        })
        .eq('id', personId);
        
      if (updatePersonError) {
        console.error('Erro ao atualizar pessoa:', updatePersonError);
        // Não falhar a requisição só por isso
      }
    }
    
    // 3. Atualizar a sessão para vincular à pessoa
    const { error: sessionUpdateError } = await supabase
      .from('quiz_sessions')
      .update({ person_id: personId })
      .eq('id', data.session_id);
      
    if (sessionUpdateError) {
      console.error('Erro ao atualizar sessão:', sessionUpdateError);
      return NextResponse.json(
        { success: false, error: sessionUpdateError.message }, 
        { status: 500 }
      );
    }
    
    // 4. Criar lead associado à pessoa e sessão
    const leadData = {
      person_id: personId,
      quiz_session_id: data.session_id,
      additional_data: data.additional_data || {}
    };
    
    const { data: newLead, error: createLeadError } = await supabase
      .from('leads')
      .insert(leadData)
      .select('id')
      .single();
      
    if (createLeadError) {
      console.error('Erro ao criar lead:', createLeadError);
      return NextResponse.json(
        { success: false, error: createLeadError.message }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true, 
        data: { 
          lead_id: newLead.id,
          person_id: personId
        } 
      }, 
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error('Erro inesperado ao processar lead:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      }, 
      { status: 500 }
    );
  }
}