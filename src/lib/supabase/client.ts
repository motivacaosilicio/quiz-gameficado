import { createBrowserClient } from '@supabase/ssr'
import { createClient as createServerClient } from '@supabase/supabase-js'

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

// A chave de serviço é opcional para o browser, mas obrigatória para o servidor
if (typeof window === 'undefined' && !supabaseServiceKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY não está definida. Tentando usar a chave anônima no servidor')
}

export const createClient = () => {
  try {
    if (typeof window === 'undefined') {
      // Server-side - usar a chave de serviço para contornar RLS
      // Se a chave de serviço não estiver disponível, usar a chave anônima
      const serverClient = createServerClient(
        supabaseUrl || '',
        supabaseServiceKey || supabaseAnonKey || ''
      )
      console.log('Cliente Supabase criado no servidor')
      return serverClient
    } else {
      // Client-side - usar a chave anônima
      const browserClient = createBrowserClient(
        supabaseUrl || '',
        supabaseAnonKey || ''
      )
      console.log('Cliente Supabase criado no navegador')
      return browserClient
    }
  } catch (error) {
    console.error('Erro ao criar cliente Supabase:', error)
    // Fallback para um cliente básico (provavelmente não funcionará, mas evita crash)
    return createServerClient(supabaseUrl || '', supabaseAnonKey || '')
  }
}