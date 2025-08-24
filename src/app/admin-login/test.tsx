'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function SupabaseTest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('admin@exemplo.com');
  const [testPassword, setTestPassword] = useState('senha123');

  const testConnection = async () => {
    setLoading(true);
    try {
      // Criar cliente diretamente com as credenciais
      const supabase = createClient(
        'http://127.0.0.1:54321',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      );

      // Testar conexão
      const { data, error } = await supabase.from('leads').select('count', { count: 'exact' });
      
      if (error) {
        throw error;
      }
      
      setResult(JSON.stringify({ 
        success: true, 
        data
      }, null, 2));
    } catch (error) {
      console.error('Erro no teste:', error);
      setResult(JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro desconhecido'
      }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const testSignUp = async () => {
    setLoading(true);
    try {
      // Criar cliente diretamente com as credenciais
      const supabase = createClient(
        'http://127.0.0.1:54321',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      );

      // Tentar criar usuário
      const testEmail = `test-${Date.now()}@example.com`;
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'teste123',
      });
      
      setResult(JSON.stringify({ 
        success: !error, 
        email: testEmail,
        data,
        error
      }, null, 2));
    } catch (error) {
      console.error('Erro no teste de criação:', error);
      setResult(JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro desconhecido'
      }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      // Criar cliente diretamente com as credenciais
      const supabase = createClient(
        'http://127.0.0.1:54321',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      );

      // Tentar login com as credenciais informadas
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      setResult(JSON.stringify({ 
        success: !error, 
        data,
        error
      }, null, 2));
    } catch (error) {
      console.error('Erro no teste de login:', error);
      setResult(JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro desconhecido'
      }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Teste do Supabase</h2>
      
      <div className="space-x-4 mb-4">
        <button 
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Testar Conexão
        </button>
        
        <button 
          onClick={testSignUp}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Testar Criação de Usuário
        </button>
      </div>
      
      <div className="mt-6 mb-4">
        <h3 className="text-md font-semibold mb-3">Testar Login Específico</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        <button 
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Testar Login com Credenciais
        </button>
      </div>
      
      {loading && <p className="text-gray-500">Carregando...</p>}
      
      {result && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Resultado:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}