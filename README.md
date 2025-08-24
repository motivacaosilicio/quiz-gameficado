# Quiz Funnel System

Sistema de funis de quiz para captura de leads com múltiplos templates e rastreamento detalhado de respostas.

## Visão Geral

Este sistema permite criar e gerenciar funis de quiz para coleta de leads, com:

- Apresentação de quizzes em múltiplas etapas
- Rastreamento detalhado da jornada do usuário
- Análise de métricas de conversão
- Integração com sistemas de marketing via webhooks
- Suporte para múltiplos templates de quiz

## Configuração Inicial

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto com:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase
```

3. Configure o banco de dados Supabase:

```bash
# Instalar CLI do Supabase
npm install -g supabase

# Inicializar (se necessário)
supabase init

# Aplicar as migrações
supabase migration up
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do Projeto

```
src/
├── app/                  # Rotas Next.js
│   ├── api/              # API Routes
│   ├── quiz/[slug]/      # Páginas de quiz
│   └── auth/             # Páginas de autenticação
├── components/           # Componentes React compartilhados
│   └── ui/               # Componentes base de UI
├── modules/              # Módulos encapsulados
│   └── quiz/             # Módulo de quiz completo
│       ├── adapters/     # Adaptadores para serviços externos
│       ├── api/          # Funções de API do módulo
│       ├── components/   # Componentes específicos do quiz
│       ├── hooks/        # Hooks do módulo
│       ├── templates/    # Templates de quiz
│       └── types/        # Tipos específicos do módulo
├── lib/                  # Utilitários compartilhados
│   └── supabase/         # Cliente Supabase global
└── types/                # Tipos TypeScript globais
```

## Módulo de Quiz

O sistema é estruturado em torno de um módulo de quiz independente que pode ser facilmente integrado em qualquer parte da aplicação. Para mais detalhes sobre o módulo, consulte [src/modules/quiz/README.md](./src/modules/quiz/README.md).

## Banco de Dados

O sistema utiliza Supabase como banco de dados. A estrutura inclui:

- `persons`: Armazena informações de pessoas únicas
- `quizzes`: Registra os diferentes tipos de quiz disponíveis
- `quiz_sessions`: Rastreia cada sessão de preenchimento
- `leads`: Vincula pessoas a sessões de quiz
- `quiz_answers`: Registra as respostas fornecidas
- `quiz_events`: Captura eventos durante a jornada do usuário

Para mais detalhes, consulte [supabase/README.md](./supabase/README.md).

## Templates de Quiz

Os templates de quiz agora são definidos em `/src/modules/quiz/templates/` e gerenciados pelo serviço de registro do módulo. Para adicionar um novo template:

1. Crie um novo arquivo no diretório de templates
2. Defina as etapas, perguntas e opções de resposta seguindo o tipo `QuizTemplate`
3. Registre o template usando `registerQuizTemplate`
4. O novo quiz será automaticamente disponível na plataforma

## Desenvolvimento

Para começar a desenvolver:

```bash
npm run dev        # Inicia o servidor de desenvolvimento
```

## Deploy

Para fazer deploy na Vercel:

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente necessárias
3. Execute o deploy

Para mais detalhes sobre deploy com Next.js, consulte a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying).