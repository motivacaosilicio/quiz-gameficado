-- Adicionar tabela de passos do quiz para rastrear a ordem das etapas

-- Criação da tabela de passos do quiz
CREATE TABLE IF NOT EXISTS public.quiz_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    step_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    step_order INTEGER NOT NULL,
    step_type TEXT NOT NULL, -- 'question', 'info', 'form', etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(quiz_id, step_id)
);

-- Índices para melhorar performance
CREATE INDEX idx_quiz_steps_quiz_id ON public.quiz_steps (quiz_id);
CREATE INDEX idx_quiz_steps_step_id ON public.quiz_steps (step_id);
CREATE INDEX idx_quiz_steps_order ON public.quiz_steps (step_order);

-- Trigger para updated_at
CREATE TRIGGER update_quiz_steps_updated_at
BEFORE UPDATE ON public.quiz_steps
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE public.quiz_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON public.quiz_steps FOR ALL USING (true);

-- Permissões
GRANT ALL ON public.quiz_steps TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_steps TO authenticated;
GRANT SELECT ON public.quiz_steps TO anon;

-- Adicionar ordem das etapas para "aprendizagem-ia-criancas"
INSERT INTO public.quiz_steps (quiz_id, step_id, title, description, step_order, step_type)
VALUES
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'opening', 'Introdução', 'Tela de boas-vindas ao quiz', 1, 'info'),
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'age', 'Idade', 'Idade da criança', 2, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'tech', 'Uso de Tecnologia', 'Se a criança usa tecnologia para aprender', 3, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'socialProof', 'Prova Social', 'Demonstração de uso por outros pais', 4, 'info'),
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'difficulty', 'Dificuldade', 'Nível de dificuldade para aprender', 5, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'distraction', 'Distração', 'Nível de distração durante estudos', 6, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'help', 'Ajuda', 'Necessidade de ajuda no aprendizado', 7, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'ai', 'IA no Aprendizado', 'Uso de IA no aprendizado', 8, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'pain', 'Pontos de Dor', 'Problemas percebidos no aprendizado', 9, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'feeling', 'Sentimento', 'Como se sente sobre as dificuldades', 10, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'desire', 'Desejo', 'Aspecto que gostaria de melhorar', 11, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'testimonials', 'Depoimentos', 'Depoimentos de outros pais', 12, 'info'),
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'helpPromise', 'Promessa de Ajuda', 'Proposta de solução', 13, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'microCommitment', 'Micro Comprometimento', 'Nível de motivação', 14, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'loading', 'Formulário', 'Captura de dados do lead', 15, 'form'),
((SELECT id FROM public.quizzes WHERE slug = 'aprendizagem-ia-criancas'), 'solution', 'Solução', 'Apresentação da solução final', 16, 'info');

-- Adicionar ordem das etapas para "transformacao-digital-negocios"
INSERT INTO public.quiz_steps (quiz_id, step_id, title, description, step_order, step_type)
VALUES
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'opening', 'Introdução', 'Tela de boas-vindas ao quiz', 1, 'info'),
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'age', 'Idade da Empresa', 'Há quanto tempo a empresa existe', 2, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'tech', 'Uso de Tecnologia', 'Nível atual de tecnologia na empresa', 3, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'socialProof', 'Prova Social', 'Resultados de outras empresas', 4, 'info'),
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'difficulty', 'Dificuldade', 'Principais dificuldades na transformação digital', 5, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'distraction', 'Obstáculos', 'Obstáculos percebidos', 6, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'help', 'Necessidade', 'Nível de necessidade de ajuda', 7, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'ai', 'IA nos Negócios', 'Uso atual de IA nos processos', 8, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'pain', 'Pontos de Dor', 'Problemas percebidos nos processos', 9, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'feeling', 'Sentimento', 'Como se sente sobre o atual nível digital', 10, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'desire', 'Objetivo', 'Principal objetivo com transformação digital', 11, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'testimonials', 'Depoimentos', 'Casos de sucesso', 12, 'info'),
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'helpPromise', 'Promessa', 'O que o programa oferece', 13, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'microCommitment', 'Interesse', 'Nível de interesse no programa', 14, 'question'),
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'loading', 'Formulário', 'Captura de dados do lead', 15, 'form'),
((SELECT id FROM public.quizzes WHERE slug = 'transformacao-digital-negocios'), 'solution', 'Solução', 'Apresentação da solução final', 16, 'info');

-- Adicionar view para visualização e análise
CREATE OR REPLACE VIEW public.quiz_funnel_steps AS
SELECT
    q.id AS quiz_id,
    q.slug AS quiz_slug,
    q.title AS quiz_title,
    qs.step_id,
    qs.title AS step_title,
    qs.step_order,
    qs.step_type,
    count(DISTINCT qe.session_id) AS total_views,
    count(DISTINCT CASE WHEN qe.event_type = 'step_complete' THEN qe.session_id END) AS completions
FROM
    public.quizzes q
    JOIN public.quiz_steps qs ON q.id = qs.quiz_id
    LEFT JOIN public.quiz_events qe ON qs.step_id = (qe.event_data->>'step_id') AND qe.event_type IN ('step_view', 'step_complete')
GROUP BY
    q.id, q.slug, q.title, qs.step_id, qs.title, qs.step_order, qs.step_type
ORDER BY
    q.slug, qs.step_order;