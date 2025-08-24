import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Lista de tabelas para verificar
    const tables = ['quizzes', 'quiz_sessions', 'quiz_answers', 'quiz_events', 'leads'];
    const results: Record<string, boolean> = {};
    
    // Verificar cada tabela
    for (const table of tables) {
      try {
        console.log(`Verificando tabela: ${table}`);
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.error(`Erro ao verificar tabela ${table}:`, error);
          results[table] = false;
        } else {
          console.log(`Tabela ${table} existe e contém ${data?.length || 0} registros`);
          results[table] = true;
        }
      } catch (tableError) {
        console.error(`Erro ao verificar tabela ${table}:`, tableError);
        results[table] = false;
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Verificação de tabelas concluída', 
      results 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Erro inesperado ao verificar tabelas:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
