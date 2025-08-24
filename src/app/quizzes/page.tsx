import React from 'react';
import { QuizzesListPage, getQuizzes } from '@/modules/quiz';
import { Quiz } from '@/modules/quiz/types';

export const dynamic = 'force-dynamic';

/**
 * Página principal de listagem de quizzes
 * Usa o componente modularizado do módulo quiz
 */
export default async function QuizzesPage() {
  // Busca quizzes usando a API do módulo com tratamento de erro
  let quizzes: Quiz[] = [];
  
  try {
    quizzes = await getQuizzes();
    console.log('Quizzes carregados com sucesso:', quizzes.length);
  } catch (error) {
    console.error('Erro ao carregar quizzes:', error);
    // Em caso de erro, continua com array vazio
  }
  
  // Renderiza a página de listagem de quizzes do módulo
  return <QuizzesListPage quizzes={quizzes} />;
} 