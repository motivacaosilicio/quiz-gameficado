# Contexto do Projeto Gemini Funnels

## Visão Geral

O **Gemini Funnels** é uma plataforma de construção e gerenciamento de funis de venda baseados em quiz. O sistema permite criar quizzes interativos para qualificação de leads, capturar informações de potenciais clientes e analisar sua jornada através de dashboards.

## Arquitetura

O projeto está organizado em módulos independentes com responsabilidades específicas:

### Módulos Principais

1. **Módulo Quiz** (`src/modules/quiz/`)
   - Primeiro módulo a ser migrado para uma arquitetura modular
   - Contém toda a lógica de exibição, fluxo e persistência de quizzes
   - Ver [docs/modulos/quiz.md](./modulos/quiz.md) para detalhes

2. **Módulo Admin** (a ser modularizado)
   - Interface administrativa para gerenciamento de quizzes e leads
   - Painéis de análise e relatórios

### Camadas Funcionais

- **API Routes** (`src/app/api/`): Endpoints para interação com o frontend
- **Core Pages** (`src/app/`): Páginas principais da aplicação
- **Shared Components** (`src/components/`): Componentes UI reutilizáveis
- **Shared Libraries** (`src/lib/`): Utilitários compartilhados entre módulos

## Decisões Arquiteturais

### Modularização

O projeto está em processo de migração para uma arquitetura modular, onde cada domínio funcional é encapsulado em um módulo independente. Benefícios:

- **Desacoplamento**: Cada módulo pode evoluir independentemente
- **Testabilidade**: Melhor isolamento para testes
- **Manutenção**: Fronteiras claras de responsabilidade
- **Reutilização**: Possibilidade de usar módulos em outros projetos

### Tecnologias Principais

- **Frontend**: Next.js 14 com App Router
- **Banco de Dados**: Supabase (PostgreSQL)
- **Estilos**: TailwindCSS
- **Autenticação**: Supabase Auth

## Fluxo de Funcionamento

1. O usuário acessa um link de quiz (`/quiz/[slug]`)
2. O sistema carrega o template correspondente ao slug
3. O usuário navega pelas perguntas do quiz
4. As respostas e eventos são registrados em tempo real
5. Ao finalizar, o lead é capturado e armazenado
6. Os administradores podem acessar os relatórios e dados no painel admin

## Diretrizes de Desenvolvimento

- **Código Limpo**: Funções pequenas com responsabilidade única
- **Arquitetura Modular**: Cada módulo deve ser independente e ter interface bem definida
- **Tipagem Forte**: Usar TypeScript com tipos explícitos
- **Importações Relativas**: Dentro de um módulo, usar caminhos relativos
- **Importações de Módulo**: Entre módulos, usar o path alias `@/modules/xxx`

## Roadmap

1. ✅ Modularização do componente Quiz
2. ⬜ Modularização do painel Admin
3. ⬜ Sistema de autorização granular
4. ⬜ Integração com ferramentas de marketing
5. ⬜ Sistema de notificações 