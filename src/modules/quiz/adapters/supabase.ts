import { createBrowserClient } from '@supabase/ssr'
import { createClient as createServerClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase específico para o módulo de quiz
 * Versão adaptada do cliente global da aplicação
 */

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validação das variáveis de ambiente
if (!supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_URL não está definida')
}

if (!supabaseAnonKey) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida')
}

/**
 * Cria um cliente Supabase otimizado para o módulo de quiz
 */
export const createQuizClient = () => {
  try {
    if (typeof window === 'undefined') {
      // Server-side - usar a chave de serviço para contornar RLS
      const serverClient = createServerClient(
        supabaseUrl || '',
        supabaseServiceKey || supabaseAnonKey || ''
      )
      console.log('Cliente Supabase para Quiz criado no servidor')
      return serverClient
    } else {
      // Client-side - usar a chave anônima
      const browserClient = createBrowserClient(
        supabaseUrl || '',
        supabaseAnonKey || ''
      )
      console.log('Cliente Supabase para Quiz criado no navegador')
      return browserClient
    }
  } catch (error) {
    console.error('Erro ao criar cliente Supabase para Quiz:', error)
    // Fallback para um cliente básico
    return createServerClient(supabaseUrl || '', supabaseAnonKey || '')
  }
}

// Exporta por padrão para manter compatibilidade com importações existentes
export default createQuizClient