/**
 * Tipos básicos para o módulo de quiz
 */

/**
 * Representa uma etapa do quiz
 */
export interface QuizStep {
  id: string;
  title: string;
  type: 'opening' | 'question' | 'multiple_choice' | 'solution';
  content: string;
  options?: string[];
  nextStep?: string;
}

/**
 * Representa um quiz completo
 */
export interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string;
  steps: QuizStep[];
  created_at?: string;
  updated_at?: string;
  final_url?: string | null;
  webhook_url?: string | null;
}

/**
 * Tipos de eventos que podem ocorrer durante o quiz
 */
export enum EventType {
  START_QUIZ = 'start_quiz',
  VIEW_STEP = 'view_step',
  ANSWER_QUESTION = 'answer_question',
  COMPLETE_QUIZ = 'complete_quiz',
  SUBMIT_LEAD = 'submit_lead'
}

/**
 * Representa um evento ocorrido durante o quiz
 */
export interface QuizEvent {
  type: EventType;
  stepId?: string;
  data?: unknown;
}

/**
 * Estado do quiz durante a execução
 */
export interface QuizState {
  currentStepId: string | null;
  steps: QuizStep[];
  answers: Record<string, string>;
  completed: boolean;
  loading: boolean;
}

/**
 * Definição da estrutura de um template de quiz
 */
export interface QuizTemplate {
  slug: string;
  title: string;
  description: string;
  questions: QuestionData[];
  testimonials?: {
    text: string;
    author: string;
  }[];
  questionOrder: string[];
}

/**
 * Definição da estrutura de uma questão/etapa de quiz
 */
export interface QuestionData {
  id: string;
  category?: string;
  title?: string;
  subtitle?: string;
  question?: string;
  text?: string;
  options?: string[];
  multiSelect?: boolean;
  maxSelections?: number;
  image?: string;
  comparisonImage?: string;
  benefits?: string[];
  price?: string;
  cta?: string;
}
