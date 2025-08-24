'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Importação dinâmica do componente QuizMain
const QuizMain = dynamic(() => import('@/modules/quiz/components/QuizMain'), {
  loading: () => <p>Carregando módulo de quiz...</p>
});

/**
 * Componente cliente para o quiz
 */
export default function QuizClient({ slug }: { slug: string }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulando carregamento de dados necessários
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 border rounded-lg">
      {isLoading ? (
        <div className="text-center p-4">
          <p>Inicializando componente de quiz...</p>
        </div>
      ) : (
        <QuizMain slug={slug} />
      )}
    </div>
  );
} 