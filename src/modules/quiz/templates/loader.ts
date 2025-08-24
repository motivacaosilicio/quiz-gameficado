/**
 * Serviço para carregar os templates de quiz dinamicamente
 * Adaptado para o módulo de quiz
 */

import { QuizTemplate, QuestionData } from '../types';

/**
 * Obtém uma questão específica de um quiz pelo ID
 */
export function getQuestionById(quiz: QuizTemplate, questionId: string): QuestionData | null {
  return quiz.questions.find((q: QuestionData) => q.id === questionId) || null;
}

/**
 * Obtém o índice de uma questão com base na ordem definida
 */
export function getQuestionIndex(quiz: QuizTemplate, questionId: string): number {
  return quiz.questionOrder.indexOf(questionId);
}

/**
 * Obtém o total de questões no quiz
 */
export function getTotalQuestions(quiz: QuizTemplate): number {
  return quiz.questionOrder.length;
}

/**
 * Obtém o ID da questão baseado no índice
 */
export function getQuestionIdByIndex(quiz: QuizTemplate, index: number): string | null {
  if (index < 0 || index >= quiz.questionOrder.length) {
    return null;
  }
  
  return quiz.questionOrder[index];
}

/**
 * Obtém os depoimentos associados ao quiz
 */
export function getTestimonials(quiz: QuizTemplate) {
  return quiz.testimonials || [];
}

/**
 * Registra um template de quiz para uso no módulo
 * Esta função pode ser usada para registrar dinamicamente novos templates
 */
const registeredTemplates: Record<string, QuizTemplate> = {};

export function registerQuizTemplate(slug: string, template: QuizTemplate): void {
  registeredTemplates[slug] = template;
}

/**
 * Carrega um quiz específico pelo slug
 */
export function getQuizBySlug(slug: string): QuizTemplate | null {
  return registeredTemplates[slug] || null;
}

/**
 * Lista todos os quizzes disponíveis
 */
export function getAllQuizzes(): QuizTemplate[] {
  return Object.values(registeredTemplates);
} 