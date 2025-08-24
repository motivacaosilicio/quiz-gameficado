# Estrutura do Banco de Dados

Este documento descreve a estrutura do banco de dados utilizado no sistema de Quiz Funnels.

## Modelagem de Dados

O sistema utiliza o seguinte modelo de dados:

```
persons (1) ---< quiz_sessions (1) ---< quiz_answers (many)
   |                |
   |                |---< quiz_events (many)
   |                |
   |                v
   |----< leads (1) 
```

## Tabelas e Relacionamentos

### persons
Armazena informações sobre pessoas individuais (usuários) que participam dos quizzes.
- `id`: UUID (PK)
- `email`: TEXT (UNIQUE)
- `name`: TEXT
- `phone`: TEXT
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### quizzes
Define os diferentes quizzes disponíveis no sistema.
- `id`: UUID (PK)
- `slug`: TEXT (UNIQUE)
- `title`: TEXT
- `description`: TEXT
- `final_url`: TEXT
- `webhook_url`: TEXT
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### quiz_sessions
Registra cada sessão individual de preenchimento de quiz.
- `id`: UUID (PK)
- `quiz_id`: UUID (FK -> quizzes.id)
- `person_id`: UUID (FK -> persons.id)
- `session_token`: TEXT (UNIQUE)
- `current_step`: TEXT
- `started_at`: TIMESTAMPTZ
- `finished_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### leads
Armazena informações de leads capturados em cada sessão de quiz.
- `id`: UUID (PK)
- `person_id`: UUID (FK -> persons.id)
- `quiz_session_id`: UUID (FK -> quiz_sessions.id)
- `additional_data`: JSONB
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### quiz_events
Rastreia eventos durante a sessão de quiz (cliques, visualizações, etc).
- `id`: UUID (PK)
- `session_id`: UUID (FK -> quiz_sessions.id)
- `event_type`: quiz_event_type ENUM
- `event_data`: JSONB
- `created_at`: TIMESTAMPTZ

### quiz_answers
Armazena as respostas individuais fornecidas durante uma sessão de quiz.
- `id`: UUID (PK)
- `session_id`: UUID (FK -> quiz_sessions.id)
- `step_id`: TEXT
- `question`: TEXT
- `answer`: TEXT
- `created_at`: TIMESTAMPTZ

## Fluxo de Funcionamento

1. Quando um usuário inicia um quiz, uma nova `quiz_session` é criada com um token único
2. Durante o quiz, respostas são registradas em `quiz_answers` e eventos em `quiz_events`
3. Quando o usuário fornece seus dados pessoais, uma entrada em `persons` é criada (ou atualizada se já existir)
4. A sessão é atualizada com o `person_id` 
5. Um registro em `leads` é criado, vinculando a pessoa à sessão do quiz
6. Isso permite que a mesma pessoa preencha múltiplos quizzes (ou o mesmo quiz várias vezes)

## Configuração do Banco de Dados

### Variáveis de Ambiente

O sistema depende das seguintes variáveis de ambiente:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico
```

Estas variáveis devem ser definidas em um arquivo `.env.local` na raiz do projeto.

### Aplicando as migrações

Para aplicar as migrações e configurar o banco de dados:

#### Método 1: Usando o Supabase CLI

1. Certifique-se de ter o Supabase CLI instalado:
   ```bash
   npm install -g supabase
   ```

2. Faça login no Supabase:
   ```bash
   supabase login
   ```

3. Inicialize o projeto (se ainda não inicializado):
   ```bash
   supabase init
   ```

4. Execute a migração mais recente:
   ```bash
   supabase migration up
   ```

#### Método 2: Usando o Script de Reset (Recomendado para Problemas)

Se você encontrar problemas com o método anterior, use o script de reset:

1. Acesse o SQL Editor no painel de controle do Supabase
2. Abra o arquivo `reset_schema.sql` localizado na pasta `supabase/` 
3. Execute todo o conteúdo do script no SQL Editor
4. Em seguida, execute o conteúdo do arquivo `20250227010000_util_functions.sql`
5. Este script irá:
   - Apagar todo o schema atual
   - Recriar as tabelas com a estrutura correta
   - Adicionar quizzes iniciais
   - Configurar permissões
   - Criar funções utilitárias para diagnóstico

**Nota**: O script de reset apaga todos os dados existentes. Use-o apenas em ambiente de desenvolvimento ou quando for seguro perder todos os dados.

## Resolução de Problemas

### Verificando a Conexão

Para verificar se a conexão com o banco de dados está funcionando corretamente:

1. Acesse o endpoint de teste:
   ```
   http://localhost:3000/api/check-db
   ```

2. Este endpoint verificará:
   - Se as variáveis de ambiente estão definidas
   - Se o cliente Supabase está sendo criado corretamente
   - Se é possível acessar as tabelas do banco de dados
   - Se é possível consultar os quizzes

### Erros Comuns

1. **Erro de coluna ausente**:
   - Verifique se a migração `20250227000000_schema_consolidation.sql` foi aplicada.
   - Esta migração consolida e corrige o esquema.

2. **Erro de conflito de schema**:
   - Use o script `reset_schema.sql` que elimina totalmente o schema atual e cria um novo.

3. **Erro de permissão no schema**:
   - Verifique se as variáveis de ambiente estão corretas
   - Certifique-se de que está usando a chave de serviço correta
   - Execute as seguintes consultas no SQL Editor para verificar permissões:
     ```sql
     -- Verificar permissões no schema public
     SELECT grantee, privilege_type 
     FROM information_schema.role_table_grants 
     WHERE table_schema = 'public';
     
     -- Verificar se o usuário anônimo tem acesso
     GRANT USAGE ON SCHEMA public TO anon;
     GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
     ```

4. **Erro ao listar tabelas**:
   - Execute a função RPC de diagnóstico:
     ```sql
     SELECT * FROM public.available_tables();
     ```
   - Se esta função não existir, execute o arquivo `20250227010000_util_functions.sql`

5. **Erro com dados existentes**:
   - Faça backup dos dados importantes antes de aplicar as migrações, especialmente se estiver migrando de um esquema anterior.