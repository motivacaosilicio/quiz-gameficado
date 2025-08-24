-- Schema Consolidation Migration
-- This migration resolves inconsistencies between previous migrations and adds person tracking

-- Ensure UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop old tables if they exist to avoid conflicts
DROP TABLE IF EXISTS public.quiz_answers CASCADE;
DROP TABLE IF EXISTS public.quiz_events CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.quiz_sessions CASCADE;
DROP TABLE IF EXISTS public.quizzes CASCADE;
DROP TABLE IF EXISTS public.persons CASCADE;

-- Create consolidated tables with improved structure
CREATE TABLE public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    final_url TEXT,
    webhook_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create persons table to track unique individuals
CREATE TABLE public.persons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_persons_email ON public.persons (email);

CREATE TABLE public.quiz_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    current_step TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    person_id UUID REFERENCES public.persons(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_quiz_sessions_quiz_id ON public.quiz_sessions (quiz_id);
CREATE INDEX idx_quiz_sessions_person_id ON public.quiz_sessions (person_id);

CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    additional_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(quiz_session_id)
);
CREATE INDEX idx_leads_person_id ON public.leads (person_id);
CREATE INDEX idx_leads_quiz_session_id ON public.leads (quiz_session_id);

-- Create ENUM for event types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quiz_event_type') THEN
        CREATE TYPE quiz_event_type AS ENUM ('page_view', 'button_click', 'form_submit', 'quiz_start', 'quiz_complete', 'step_complete');
    END IF;
END$$;

CREATE TABLE public.quiz_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
    event_type quiz_event_type NOT NULL,
    event_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_quiz_events_session_id ON public.quiz_events (session_id);
CREATE INDEX idx_quiz_events_created_at ON public.quiz_events (created_at);

CREATE TABLE public.quiz_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
    step_id TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_quiz_answers_session_id ON public.quiz_answers (session_id);
CREATE INDEX idx_quiz_answers_step_id ON public.quiz_answers (step_id);

-- Create function for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_quizzes_updated_at
BEFORE UPDATE ON public.quizzes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_persons_updated_at
BEFORE UPDATE ON public.persons
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_sessions_updated_at
BEFORE UPDATE ON public.quiz_sessions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add basic RLS policies
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

-- For development, create permissive policies (replace with proper policies in production)
CREATE POLICY "Allow all" ON public.quizzes FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.persons FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.quiz_sessions FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.leads FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.quiz_events FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.quiz_answers FOR ALL USING (true);

-- Add sample quizzes (make sure tables are created first)
INSERT INTO public.quizzes (slug, title, description) 
VALUES 
('aprendizagem-ia-criancas', 'Aprendizagem com IA para Crianças', 'Descubra como a IA pode melhorar o aprendizado infantil'),
('transformacao-digital-negocios', 'Transformação Digital para Negócios', 'Avalie o nível de maturidade digital do seu negócio');

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;