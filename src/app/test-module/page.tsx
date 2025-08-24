import React from 'react';
import QuizClient from './page.client';

/**
 * Página de teste para verificar o funcionamento do módulo de quiz
 * Usa um componente cliente para renderizar a interface interativa
 */
export default function TestModulePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Teste do Módulo de Quiz</h1>
      <QuizClient slug="aprendizagem-ia-criancas" />
    </div>
  );
} 