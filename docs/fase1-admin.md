# Modularização do Admin - Fase 1: Preparação

## Componentes Identificados

### Páginas Principais
| Componente | Caminho | Descrição | Dependências |
|------------|---------|-----------|--------------|
| Dashboard | `src/app/admin/page.tsx` | Painel principal com estatísticas | `@/lib/supabase/client` |
| Layout Admin | `src/app/admin/layout.tsx` | Layout com navegação lateral | `@/lib/supabase/client`, `next/navigation` |
| Lista de Quizzes | `src/app/admin/quizzes/page.tsx` | Gerenciamento de quizzes | `@/lib/supabase/client` |
| Editor de Quiz | `src/app/admin/quizzes/[id]/page.tsx` | Edição de quiz específico | `@/lib/supabase/client` |
| Lista de Leads | `src/app/admin/leads/page.tsx` | Gerenciamento de leads | `@/lib/supabase/client` |
| Detalhes do Lead | `src/app/admin/leads/[id]/page.tsx` | Visualização detalhada de lead | `@/lib/supabase/client` |
| Login Admin | `src/app/admin-login/page.tsx` | Página de autenticação | `@/lib/supabase/client` |

### APIs
| API | Caminho | Descrição | Dependências |
|-----|---------|-----------|--------------|
| Leads API | `src/app/api/leads/route.ts` | CRUD de leads | `@/lib/supabase/client` |
| Quizzes API | `src/app/api/quizzes/` | Gerenciamento de quizzes | `@/lib/supabase/client` |
| Sessions API | `src/app/api/sessions/` | Gerenciamento de sessões | `@/lib/supabase/client` |
| Webhooks | `src/app/api/webhook/` | Integração com sistemas externos | `@/lib/supabase/client` |

### Componentes UI Compartilhados
| Componente | Caminho | Descrição | Utilizados por |
|------------|---------|-----------|----------------|
| Button | `src/components/ui/Button.tsx` | Botão estilizado | Admin Dashboard, Quizzes, Leads |
| Input | `src/components/ui/Input.tsx` | Input estilizado | Admin Dashboard, Quizzes, Leads |

### Dependências Externas
| Dependência | Utilização | Observações |
|-------------|------------|-------------|
| Supabase | Autenticação, Banco de Dados | Utilizado tanto pelo módulo Quiz quanto Admin |
| Next.js | Framework, Roteamento | Infraestrutura básica do projeto |
| React | Biblioteca UI | Utilizado por todos os componentes |
| TailwindCSS | Estilização | Utilizado por todos os componentes |

## Análise de Dependências

### Dependências Compartilhadas com o Módulo Quiz
- **Cliente Supabase**: Ambos módulos utilizam o mesmo cliente para acesso ao banco
- **Tipos de Dados**: Esquemas de quizzes, sessões e respostas
- **Componentes UI**: Button, Input são utilizados por ambos

### Dependências Internas do Admin
- **Layout → Páginas**: Todas as páginas do admin dependem do layout compartilhado
- **Autenticação**: Verificação de auth em todas as páginas do admin
- **APIs → Páginas**: As páginas consomem as APIs correspondentes
- **Estado Compartilhado**: Dados entre telas de listagem e detalhe

## Principais Desafios Identificados

1. **Autenticação Compartilhada**: O sistema de autenticação está fortemente acoplado ao Supabase e é utilizado tanto no admin quanto no front público

2. **Acesso a Dados**: O módulo Admin precisa acessar dados gerenciados pelo módulo Quiz (como detalhes de quizzes, sessões)

3. **Navegação**: O sistema de navegação é específico para o admin, mas precisa interagir com o Next.js App Router

4. **Componentes UI**: Há componentes compartilhados que precisam ser migrados ou referenciados de maneira consistente

## Estratégia de Migração Sugerida

### 1. Criar Adaptadores Primeiro
- Implementar adaptadores para Supabase específicos do admin
- Isolar a lógica de autenticação

### 2. Estabelecer Tipo/Interfaces
- Definir claramente os tipos compartilhados entre Quiz e Admin
- Criar interfaces para comunicação entre módulos

### 3. Migrar Componentes Base
- Começar com componentes UI específicos do admin
- Migrar o sistema de navegação/layout

### 4. Refatorar Páginas Principais
- Migrar de forma progressiva, começando pelas menos complexas
- Testar cada migração antes de prosseguir

## Próximos Passos (Fase 2)

1. Criar a estrutura de pastas do módulo Admin conforme planejado
2. Implementar o adapter Supabase específico do Admin
3. Migrar os componentes UI básicos
4. Configurar o sistema de exportação do módulo (index.ts) 