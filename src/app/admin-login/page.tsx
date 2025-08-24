'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

import SupabaseTest from './test';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState('Verificando sessão...');
  const router = useRouter();
  
  // Verificar se há uma sessão ativa
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setSessionInfo(session 
          ? `Sessão ativa: ${session.user.email}` 
          : 'Nenhuma sessão ativa');
          
        if (session) {
          console.log('Usuário já está logado, redirecionando...');
          router.push('/admin');
        }
      } catch (err) {
        console.error('Erro ao verificar sessão:', err);
        setSessionInfo('Erro ao verificar sessão');
      }
    };
    
    checkSession();
  }, [router]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Mostrar claramente o que estamos fazendo para depuração
    alert(`Tentando fazer login com o email: ${email}`);
    
    try {
      // Usar EXATAMENTE o mesmo código que funcionou no teste
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        'http://127.0.0.1:54321',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      );
      
      console.log('Tentando fazer login com:', { email });
      
      // Login com as credenciais fornecidas
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(), // Remover espaços extras
        password: password.trim(), // Remover espaços extras
      });
      
      console.log('Resposta completa:', { data, error });
      
      if (error) {
        throw error;
      }
      
      if (!data.session) {
        throw new Error('Login bem-sucedido, mas nenhuma sessão foi criada');
      }
      
      alert('Login bem-sucedido! Redirecionando...');
      console.log('Login bem-sucedido, redirecionando...');
      
      // Armazenar a sessão no cookie (método mais confiável)
      document.cookie = `supabase-auth-token=${JSON.stringify(data.session)}; path=/; max-age=604800; SameSite=Lax`;
      
      // Redirecionamento manual ao invés de usar o router
      window.location.href = '/admin';
    } catch (err: any) {
      console.error('Erro detalhado de login:', err);
      setError(err.message || 'Erro ao fazer login');
      alert(`Erro ao fazer login: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8 border border-gray-200">
        <div className="mb-6">
          <h1 className="text-center text-2xl font-bold text-gray-900">
            Login Administrativo
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite suas credenciais para acessar o painel
          </p>
          <p className="mt-2 text-center text-xs text-gray-500">
            {sessionInfo}
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Seu e-mail"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Sua senha"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
        
        <div className="mt-8">
          <hr className="mb-8" />
          <h2 className="text-lg font-medium mb-4">Ferramentas de Diagnóstico</h2>
          <SupabaseTest />
        </div>
      </div>
    </div>
  );
}