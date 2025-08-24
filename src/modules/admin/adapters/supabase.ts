import { createBrowserClient } from '@supabase/ssr'
import { createClient as createServerClient } from '@supabase/supabase-js'

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/**
 * Cria um cliente Supabase otimizado para o módulo Admin
 * - No servidor: usa a chave de serviço para contornar RLS
 * - No navegador: usa a chave anônima com autenticação
 */
export const createAdminClient = () => {
  try {
    if (typeof window === 'undefined') {
      // Server-side - usar a chave de serviço para contornar RLS
      // Importante: o Admin sempre deve usar a chave de serviço no servidor
      const serverClient = createServerClient(
        supabaseUrl || '',
        supabaseServiceKey || ''
      )
      console.log('Cliente Supabase para Admin criado no servidor')
      return serverClient
    } else {
      // Client-side - usar a chave anônima
      const browserClient = createBrowserClient(
        supabaseUrl || '',
        supabaseAnonKey || ''
      )
      console.log('Cliente Supabase para Admin criado no navegador')
      return browserClient
    }
  } catch (error) {
    console.error('Erro ao criar cliente Supabase para Admin:', error)
    // Fallback para um cliente básico
    return createServerClient(supabaseUrl || '', supabaseAnonKey || '')
  }
}

/**
 * Verifica se o usuário está autenticado
 * - Retorna a sessão se autenticado
 * - Retorna null se não autenticado
 */
export const checkAdminAuth = async () => {
  const supabase = createAdminClient()
  try {
    const { data } = await supabase.auth.getSession()
    return data.session
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error)
    return null
  }
} 