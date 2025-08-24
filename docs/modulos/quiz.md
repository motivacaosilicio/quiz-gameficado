# Módulo Quiz

## Visão Geral

O módulo de Quiz encapsula toda a lógica relacionada à exibição, fluxo e interações com quizzes. Este módulo implementa uma abordagem completa de domínio, com seus próprios componentes UI, lógica de negócios, adapters de dados e tipos.

## Estrutura

```
src/modules/quiz/
├── adapters/        # Adaptadores para serviços externos (Supabase)
├── api/             # Funções de API para rotas
├── components/      # Componentes específicos do quiz
│   └── ui/          # Componentes UI reutilizáveis dentro do módulo
├── hooks/           # Hooks React para gerenciar o estado e lógica 
├── templates/       # Templates de quiz e sistema de loading
├── types/           # Definições de tipos TypeScript
└── index.ts         # Ponto de entrada e exportações públicas
```

## Principais Componentes

### API

- **quizzes.ts**: Gerenciamento de quizzes e sessões
  - `getAllQuizzesApi()`: Lista todos os quizzes disponíveis
  - `createQuizSessionApi(slug, body)`: Cria uma nova sessão de quiz

- **sessions.ts**: Gerenciamento de sessões de quiz
  - `recordSessionEventApi(sessionId, body)`: Registra eventos ocorridos durante a sessão
  - `recordSessionAnswerApi(sessionId, body)`: Registra respostas do usuário
  - `completeSessionApi(sessionId)`: Marca uma sessão como concluída

### Componentes

- **QuizMain**: Componente principal que renderiza o quiz completo
  - Gerencia todo o fluxo do quiz, do início ao fim
  - Coleta respostas e dados do usuário
  - Exibe transições e feedback visual

- **Componentes UI**: Botões, inputs e outros elementos visuais específicos

### Adapters

- **Supabase**: Cliente Supabase otimizado para o módulo
  - `createQuizClient()`: Cria um cliente Supabase configurado para o módulo

### Templates

- Sistema de templates flexível para diferentes tipos de quiz
- Registro dinâmico de novos templates via `registerQuizTemplate()`
- Estrutura de dados padronizada seguindo o tipo `QuizTemplate`

### Hooks

- **useQuiz**: Hook React para controlar o fluxo do quiz
  - Gerencia o estado da sessão
  - Fornece funções para navegação e submissão
  - Coordena o registro de eventos e respostas

## Como Usar

### Importação

```typescript
// Importando componentes
import { QuizMain } from '@/modules/quiz';

// Importando hooks
import { useQuiz } from '@/modules/quiz';

// Importando funções de API
import { createQuizSessionApi } from '@/modules/quiz/api';
```

### Exemplos de Uso

**Renderizando um Quiz:**

```tsx
export default function QuizPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen">
      <QuizMain slug={params.slug} />
    </div>
  );
}
```

**Criando um Template:**

```typescript
import { registerQuizTemplate } from '@/modules/quiz';

const meuTemplate = {
  slug: 'meu-quiz',
  title: 'Meu Novo Quiz',
  description: 'Descrição do quiz',
  questions: [
    { id: 'q1', title: 'Primeira pergunta', /* outras propriedades */ },
    // Mais perguntas
  ],
  questionOrder: ['q1', /* outros ids */],
  testimonials: [
    { text: 'Ótimo quiz!', author: 'Cliente Satisfeito' }
  ]
};

registerQuizTemplate('meu-quiz', meuTemplate);
```

## Decisões Técnicas

### Padrão de Adaptadores

O módulo utiliza o padrão de adaptadores para isolar dependências externas:

- **Adapter Supabase**: Encapsula toda a interação com o Supabase
- **Benefício**: Facilita a substituição do banco de dados ou a criação de mocks para testes

### Organização de Componentes

- **Abordagem**: Componentes específicos do módulo ficam contidos nele
- **Componentes UI**: Elementos visuais reutilizáveis específicos do quiz ficam em `components/ui`
- **Referências**: Os componentes utilizam caminhos relativos dentro do módulo

### Sistema de Templates

- **Templates Dinâmicos**: Registro de templates em runtime
- **Carregamento Eficiente**: Sistema otimizado para carregar apenas o template necessário
- **Tipagem Forte**: Todos os templates aderem a uma estrutura de tipo consistente

## Fluxo de Dados

1. **Inicialização do Quiz**:
   - Usuário acessa a página do quiz pelo slug
   - `QuizMain` é renderizado e inicia uma sessão via API
   - A sessão é armazenada no estado local e no banco de dados

2. **Navegação e Respostas**:
   - Usuário navega pelas perguntas usando `useQuiz`
   - Cada resposta é registrada localmente e enviada para o backend
   - Eventos de navegação são registrados para análise

3. **Conclusão**:
   - Ao finalizar, o usuário fornece dados de contato
   - Lead é registrado e associado à sessão
   - Feedback de conclusão é exibido ao usuário

## Manutenção e Extensão

Para adicionar novos recursos ao módulo:

1. **Novos Componentes**: Adicionar em `components/`
2. **Novos Tipos**: Definir em `types/index.ts`
3. **Novas APIs**: Implementar em `api/` e exportar pelo arquivo principal
4. **Novos Templates**: Criar e registrar através do sistema de templates

Para garantir a integridade do módulo, sempre:

1. **Mantenha o Encapsulamento**: Use o `index.ts` como fachada para o módulo
2. **Atualize a Documentação**: Este arquivo deve refletir as mudanças
3. **Adicione Testes**: Qualquer nova funcionalidade deve ter testes

## Possíveis Melhorias Futuras

- **Testes Unitários**: Adicionar cobertura de testes
- **Sistema de Validação**: Validação mais robusta de inputs e respostas
- **Temas Personalizáveis**: Sistema para customizar a aparência dos quizzes
- **Persistência Offline**: Suporte para funcionamento sem internet 