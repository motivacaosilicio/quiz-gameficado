# Guia de Portabilidade dos Módulos

Este documento descreve como transferir e utilizar os módulos do projeto em outros projetos Next.js.

## Estrutura dos Módulos

O projeto está organizado em módulos independentes:

- **Módulo Quiz**: Implementa formulários interativos de quiz
- **Módulo Admin**: Oferece interface administrativa para gerenciar quizzes e leads

Cada módulo segue a mesma estrutura interna:

```
módulo/
  ├── adapters/     # Adaptadores para serviços externos (Supabase)
  ├── api/          # Funções de API para comunicação com backend
  ├── components/   # Componentes React do módulo
  ├── hooks/        # Hooks React customizados
  ├── types/        # Definições de tipos TypeScript
  ├── utils/        # Utilitários e funções auxiliares
  └── index.ts      # Ponto de entrada que exporta a API pública do módulo
```

## Requisitos para Portabilidade

### Configurações do Projeto Destino

1. **Versões das Dependências**:
   - Next.js 14.x ou superior (testado com 15.1.7)
   - React 18.x ou superior
   - TypeScript 5.x ou superior
   - @supabase/supabase-js 2.x ou superior

2. **Arquivo `next.config.js/ts`**:
   ```typescript
   import path from "path";

   const nextConfig = {
     webpack: (config) => {
       config.resolve.alias = {
         ...config.resolve.alias,
         '@/modules': path.resolve(__dirname, 'src/modules'),
       };
       return config;
     },
     experimental: {
       turbo: {
         resolveAlias: {
           '@/modules': path.resolve(__dirname, 'src/modules'),
         },
       },
       esmExternals: 'loose',
     },
   };
   
   export default nextConfig;
   ```

3. **Arquivo `tsconfig.json`**:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"],
         "@/modules/*": ["src/modules/*"]
       },
       "baseUrl": "."
     }
   }
   ```

4. **Arquivo `jsconfig.json`** (para projetos JavaScript):
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/modules/*": ["src/modules/*"]
       }
     }
   }
   ```

5. **Variáveis de Ambiente**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
   SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico-do-supabase
   ```

## Passos para Migração

1. **Copiar os Diretórios dos Módulos**:
   ```bash
   cp -r src/modules/quiz src/modules/admin /caminho/para/projeto-destino/src/modules/
   ```

2. **Instalar Dependências**:
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Criar Componentes Cliente**:
   Para cada página que utiliza os módulos, crie um componente cliente seguindo o padrão:

   ```tsx
   // arquivo: app/minha-pagina/page.client.tsx
   'use client';
   
   import React from 'react';
   import dynamic from 'next/dynamic';
   
   const QuizMain = dynamic(() => import('@/modules/quiz/components/QuizMain'), {
     loading: () => <p>Carregando...</p>
   });
   
   export default function MeuComponenteCliente({ slug }) {
     return <QuizMain slug={slug} />;
   }
   ```

   E uma página servidor que utiliza este componente cliente:

   ```tsx
   // arquivo: app/minha-pagina/page.tsx
   import React from 'react';
   import MeuComponenteCliente from './page.client';
   
   export default function MinhaPageServidor({ params }) {
     return <MeuComponenteCliente slug="meu-quiz" />;
   }
   ```

## Testes de Verificação

Após a migração, para verificar se os módulos estão funcionando corretamente:

1. **Teste do Módulo Quiz**:
   - Acesse a URL `/test-module` para verificar se o componente de quiz está carregando
   - Teste um quiz específico em `/quiz/[slug]` com um slug válido

2. **Teste do Módulo Admin**:
   - Acesse a URL `/test-admin-module` para verificar se o dashboard está carregando
   - Verifique se as estatísticas estão sendo carregadas corretamente

## Solução de Problemas Comuns

1. **Erro de `Module not found`**:
   - Verifique se as configurações de alias estão corretas em `next.config.js/ts`
   - Confirme que os caminhos nas importações estão corretos

2. **Erro de SSR**:
   - Certifique-se de que componentes que usam `useState`, `useEffect` ou `dynamic` têm a diretiva `'use client'`
   - Verifique se componentes cliente não estão sendo renderizados diretamente por componentes servidor

3. **Erros de Supabase**:
   - Confirme que as variáveis de ambiente estão configuradas corretamente
   - Verifique se o esquema do banco de dados é compatível

4. **Erros de Renderização**:
   - Use a importação dinâmica com `dynamic(() => import('@/modules/...'))` para componentes pesados
   - Separe claramente componentes cliente e servidor para evitar hidratação incorreta

## Conclusão

Seguindo este guia, os módulos Quiz e Admin devem funcionar corretamente em qualquer projeto Next.js devidamente configurado. A arquitetura modular permite que estes componentes sejam facilmente transferidos e reutilizados em diferentes projetos. 