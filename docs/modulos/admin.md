# Plano de Modularização do Admin

## Visão Geral

O módulo Admin encapsulará toda a lógica relacionada à administração, visualização de dados, gestão de usuários e configuração de quizzes. Este documento apresenta o plano de migração da funcionalidade administrativa atual para uma estrutura modular, seguindo o padrão estabelecido com o módulo Quiz.

## Estrutura Proposta

```
src/modules/admin/
├── adapters/        # Adaptadores para serviços externos (Supabase)
├── api/             # Funções de API para rotas administrativas
├── components/      # Componentes específicos do painel admin
│   └── ui/          # Componentes UI reutilizáveis específicos do admin
├── hooks/           # Hooks React para gerenciar estado e lógica administrativa
├── utils/           # Utilitários específicos para o módulo admin
├── types/           # Definições de tipos TypeScript
└── index.ts         # Ponto de entrada e exportações públicas
```

## Componentes a Migrar

### Dashboard
- Painéis principais
- Visualizações de dados e estatísticas
- Gráficos e relatórios

### Gestão de Quizzes
- Lista de quizzes
- Editor de quiz
- Configurações de quiz

### Gestão de Usuários
- Lista de usuários/leads
- Detalhes de usuário
- Permissões e papéis

### Configurações
- Configurações gerais do sistema
- Webhooks e integrações
- Personalizações visuais

## Etapas de Migração

### Fase 1: Preparação
1. Identificar todos os componentes relacionados ao admin
2. Mapear dependências entre componentes
3. Identificar dependências compartilhadas com outros módulos

### Fase 2: Estrutura Base
1. Criar a estrutura de pastas do módulo
2. Configurar o arquivo index.ts principal
3. Estabelecer tipos básicos

### Fase 3: Migração de Componentes
1. Migrar componentes UI básicos
2. Migrar componentes de dashboard
3. Migrar componentes de gestão de quizzes
4. Migrar componentes de gestão de usuários

### Fase 4: Migração de Lógica
1. Criar hooks específicos do admin
2. Migrar funções de API
3. Implementar adaptadores para o Supabase

### Fase 5: Testes e Refinamento
1. Testar todos os componentes no novo contexto
2. Refinar interfaces entre módulos
3. Otimizar desempenho

## Interfaces com Outros Módulos

### Módulo Quiz
- Compartilhamento de tipos relacionados a quizzes
- Uso da API de quizzes para exibição e edição
- Acesso a templates de quiz

### Módulo Comum (Futuro)
- Possível extração de componentes UI comuns
- Compartilhamento de utilitários gerais
- Tipos compartilhados

## Benefícios Esperados

1. **Manutenção Simplificada**: Código organizado por domínio
2. **Melhor Testabilidade**: Componentes isolados com responsabilidades bem definidas
3. **Desenvolvimento Paralelo**: Equipes podem trabalhar em módulos diferentes simultaneamente
4. **Clareza Conceitual**: Separação clara entre funcionalidades de quiz e administração

## Desafios Previstos

1. **Compartilhamento de Estado**: Gerenciar estado compartilhado entre módulos
2. **Consistência de Estilo**: Manter padrões visuais consistentes
3. **Dependências Circulares**: Evitar referências circulares entre módulos
4. **Migração Gradual**: Garantir que o sistema funcione durante a migração

## Cronograma Estimado

1. **Fase 1**: 1-2 dias
2. **Fase 2**: 1 dia
3. **Fase 3**: 3-5 dias
4. **Fase 4**: 2-3 dias
5. **Fase 5**: 2-3 dias

Total estimado: 9-14 dias de desenvolvimento 