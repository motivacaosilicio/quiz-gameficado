-- Script de correção de emergência para aplicar diretamente no SQL Editor do Supabase
-- Este script corrige problemas com o enum quiz_event_type sem precisar recriar todo o schema

-- Primeiro, criamos a função enum_add_value que adiciona um valor a um enum se não existir
CREATE OR REPLACE FUNCTION enum_add_value(p_typname text, p_label text)
RETURNS void 
LANGUAGE plpgsql
AS $$
DECLARE
    enum_type_name regtype := p_typname::regtype;
BEGIN
    -- Add the new value
    EXECUTE format(
        'ALTER TYPE %s ADD VALUE IF NOT EXISTS %L',
        enum_type_name,
        p_label
    );
EXCEPTION
    WHEN duplicate_object THEN
        -- Valor já existe, podemos ignorar
        RAISE NOTICE 'Value % already exists in enum %', p_label, p_typname;
        RETURN;
END;
$$;

-- Depois, verificamos se o tipo já existe
DO $$
BEGIN
    -- Verificar se o tipo quiz_event_type existe
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quiz_event_type') THEN
        -- Adicionar cada valor que pode estar faltando
        PERFORM enum_add_value('quiz_event_type', 'step_view');
        PERFORM enum_add_value('quiz_event_type', 'answer');
        PERFORM enum_add_value('quiz_event_type', 'submit_lead');
        PERFORM enum_add_value('quiz_event_type', 'webhook_success');
        PERFORM enum_add_value('quiz_event_type', 'webhook_failure');
    ELSE
        -- Se o tipo não existe, criá-lo
        CREATE TYPE quiz_event_type AS ENUM (
            'page_view', 'button_click', 'form_submit', 'quiz_start', 'quiz_complete', 'step_complete',
            'step_view', 'answer', 'submit_lead', 'webhook_success', 'webhook_failure'
        );
    END IF;
END
$$;

-- Verifica se a tabela quiz_events existe e, se não, cria ela
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_events') THEN
        CREATE TABLE public.quiz_events (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
            event_type quiz_event_type NOT NULL,
            event_data JSONB,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX idx_quiz_events_session_id ON public.quiz_events (session_id);
        CREATE INDEX idx_quiz_events_created_at ON public.quiz_events (created_at);
        
        ALTER TABLE public.quiz_events ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow all" ON public.quiz_events FOR ALL USING (true);
        
        GRANT ALL ON public.quiz_events TO postgres, service_role;
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_events TO authenticated;
        GRANT SELECT, INSERT ON public.quiz_events TO anon;
    END IF;
END
$$;

-- Mensagem de confirmação para saber que o script rodou
SELECT 'Correção aplicada com sucesso. Os eventos agora devem funcionar corretamente.' as status;