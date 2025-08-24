/**
 * Módulo de Quiz
 * Contém componentes, hooks e funções para implementação de quizzes interativos
 */

// Exportação direta dos componentes principais
export { default as QuizMain } from './components/QuizMain';

// Exportações de tipos
export * from './types';

// Exportação de hooks específicos
export { default as useQuiz } from './hooks/useQuiz';

// Exportações de componentes UI
export * from './components/ui';

// Exportações de API
export * from './api';

// Exportações de adapters
export { createQuizClient } from './adapters/supabase';

// Exportações de páginas
export * from './pages';

// Outras exportações serão habilitadas quando os arquivos forem verificados
// export * from './api';
// export * from './adapters/supabase'; 