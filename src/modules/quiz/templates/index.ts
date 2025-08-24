/**
 * Arquivo de índice para exportar funcionalidades relacionadas a templates
 */
import { QuizTemplate, QuestionData } from '../types';

// Exportar todas as funções do loader
export * from './loader';

// Exportar os templates disponíveis
import { quizTemplate as aprendizagemQuiz } from './aprendizagem-ia-criancas';
import { quizTemplate as transformacaoDigitalQuiz } from './transformacao-digital-negocios';

// Exportar para uso externo
export { aprendizagemQuiz, transformacaoDigitalQuiz };

// Registrar os templates disponíveis
import { registerQuizTemplate } from './loader';

// Inicializar o registro de templates
(() => {
  registerQuizTemplate('aprendizagem-ia-criancas', aprendizagemQuiz);
  registerQuizTemplate('transformacao-digital-negocios', transformacaoDigitalQuiz);
})();

// Re-exportar os tipos necessários
export type { QuizTemplate, QuestionData }; 