'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Quiz {
  id: string;
  title: string;
  description: string;
  slug: string;
  created_at: string;
}

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Verificar conexão com o banco
        const connectionResponse = await fetch('/api/check-db');
        const connectionData = await connectionResponse.json();

        if (connectionData.success) {
          setConnectionStatus('Conexão com o banco de dados bem-sucedida!');
          
          // Buscar quizzes
          const quizzesResponse = await fetch('/api/quizzes');
          const quizzesData = await quizzesResponse.json();
          
          if (quizzesData.success) {
            setQuizzes(quizzesData.data);
          } else {
            setError(quizzesData.error || 'Erro ao buscar quizzes');
          }
        } else {
          setConnectionStatus(`Erro na conexão com o banco de dados: ${connectionData.error}`);
          setError(connectionData.error);
        }
      } catch (error: any) {
        setConnectionStatus(`Erro ao verificar conexão: ${error.message}`);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Exibir mensagens temporárias para demo enquanto não temos dados reais
  const demoQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'Aprendizagem com IA para Crianças',
      description: 'Descubra como seu filho pode aprender mais rápido e se destacar na escola com a ajuda da inteligência artificial.',
      slug: 'aprendizagem-ia-criancas',
      created_at: '2025-02-25'
    },
    {
      id: '2',
      title: 'Transformação Digital para Pequenos Negócios',
      description: 'Avalie a maturidade digital da sua empresa e descubra o caminho para a transformação digital.',
      slug: 'transformacao-digital-negocios',
      created_at: '2025-02-24'
    }
  ];

  const displayQuizzes = quizzes.length > 0 ? quizzes : demoQuizzes;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto py-10 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">Quiz Funnel System</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Crie quizzes interativos que engajam seus visitantes e convertem em leads qualificados.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quizzes Disponíveis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayQuizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-40 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{quiz.title}</h3>
                    <p className="text-gray-600 mb-4">{quiz.description}</p>
                    <Link href={`/quiz/${quiz.slug}`} className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300">
                      Iniciar Quiz
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Status do Sistema</h2>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${connectionStatus?.includes('sucedida') ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <p className="text-gray-700">
              {connectionStatus || 'Verificando conexão...'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
