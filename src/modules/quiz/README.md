# Módulo de Quiz

Este módulo fornece uma implementação completa de um sistema de quiz interativo com componentes React, APIs e adaptadores para armazenamento de dados.

## Estrutura do Módulo

O módulo está organizado nas seguintes pastas:

```
src/modules/quiz/
├── adapters/        # Adaptadores para serviços externos (Supabase)
├── api/             # Funções de API e endpoints
├── components/      # Componentes React para a UI do quiz
│   └── ui/          # Componentes UI básicos (Button, Input)
├── hooks/           # React hooks para gerenciar o estado do quiz
├── templates/       # Templates de quiz e sistema de carregamento
└── types/           # Definições de tipos TypeScript
```

## Principais Recursos

### Components

- `QuizMain`: Componente principal que renderiza todo o quiz
- Componentes UI reutilizáveis (`Button`, `Input`)

### API

- `createQuizSessionApi`: Cria uma nova sessão de quiz
- `recordSessionEventApi`: Registra eventos da sessão
- `recordSessionAnswerApi`: Registra respostas do usuário
- `completeSessionApi`: Finaliza uma sessão de quiz

### Templates

Sistema flexível para definir a estrutura e conteúdo dos quizzes:

- `registerQuizTemplate`: Registra um novo template 
- `getQuizBySlug`: Recupera um template pelo slug
- `getAllQuizzes`: Lista todos os templates disponíveis

### Hooks

- `useQuiz`: Hook principal para gerenciar o estado do quiz no frontend

## Como Usar

### 1. Criando um novo template de quiz

```typescript
import { registerQuizTemplate } from '@/modules/quiz';

const meuQuizTemplate = {
  slug: 'meu-novo-quiz',
  title: 'Meu Novo Quiz',
  description: 'Descrição do meu quiz',
  questions: [
    {
      id: 'q1',
      title: 'Primeira pergunta',
      options: ['Opção 1', 'Opção 2']
    },
    // mais perguntas...
  ],
  questionOrder: ['q1', /* outros ids... */]
};

registerQuizTemplate('meu-novo-quiz', meuQuizTemplate);
```

### 2. Usando o componente de quiz

```tsx
import { QuizMain } from '@/modules/quiz';

export default function MinhaPagina() {
  return (
    <div>
      <h1>Minha Página de Quiz</h1>
      <QuizMain slug="meu-novo-quiz" />
    </div>
  );
}
```

### 3. Usando o hook useQuiz

```tsx
import { useQuiz } from '@/modules/quiz';

export default function MeuComponente() {
  const { 
    currentQuestionIndex,
    nextQuestion,
    recordAnswer,
    completeSession
  } = useQuiz('meu-novo-quiz');
  
  // Implementação do componente...
}
```

## Adaptadores

O módulo usa adaptadores para conectar com serviços externos. Atualmente, suporta:

- **Supabase**: Para armazenamento de dados e sessões de quiz

## Contribuição

Para contribuir com o módulo, siga estas diretrizes:

1. Adicione novos componentes em `components/`
2. Implemente novos adaptadores em `adapters/`
3. Defina tipos em `types/index.ts`
4. Exporte funções públicas no `index.ts` raiz 