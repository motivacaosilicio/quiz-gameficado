'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Importação dinâmica do componente QuizMain
const QuizMain = dynamic(() => import('@/modules/quiz/components/QuizMain'), {
  loading: () => <p>Carregando quiz...</p>
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
    <div className="min-h-[100dvh] bg-gradient-to-b from-blue-50 to-white">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-xl text-gray-600">Preparando quiz...</p>
        </div>
      ) : (
        <QuizMain slug={slug} />
      )}
    </div>
  );
} 