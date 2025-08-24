-- Views para análise de dados dos quizzes

-- 1. Visão geral do funil por quiz (todas as etapas)
CREATE OR REPLACE VIEW public.quiz_funnel_overview AS
SELECT
    q.id AS quiz_id,
    q.slug AS quiz_slug,
    q.title AS quiz_title,
    qs.step_id,
    qs.title AS step_title,
    qs.step_order,
    qs.step_type,
    count(DISTINCT qe.session_id) AS total_views,
    count(DISTINCT CASE WHEN qe.event_type = 'step_complete' THEN qe.session_id END) AS completions,
    CASE 
        WHEN LAG(count(DISTINCT qe.session_id)) OVER (PARTITION BY q.id ORDER BY qs.step_order) > 0 
        THEN ROUND(count(DISTINCT CASE WHEN qe.event_type = 'step_complete' THEN qe.session_id END)::decimal / 
            LAG(count(DISTINCT qe.session_id)) OVER (PARTITION BY q.id ORDER BY qs.step_order) * 100, 2)
        ELSE NULL
    END AS step_conversion_rate,
    count(DISTINCT CASE WHEN l.id IS NOT NULL THEN qe.session_id END) AS resulted_in_lead
FROM
    public.quizzes q
    JOIN public.quiz_steps qs ON q.id = qs.quiz_id
    LEFT JOIN public.quiz_events qe ON qs.step_id = (qe.event_data->>'step_id')
    LEFT JOIN public.quiz_sessions s ON qe.session_id = s.id
    LEFT JOIN public.leads l ON s.id = l.quiz_session_id
WHERE 
    qe.event_type IN ('step_view', 'step_complete')
GROUP BY
    q.id, q.slug, q.title, qs.step_id, qs.title, qs.step_order, qs.step_type
ORDER BY
    q.slug, qs.step_order;

-- 2. Detalhes de respostas para cada pergunta
CREATE OR REPLACE VIEW public.quiz_question_answers AS
SELECT
    q.id AS quiz_id,
    q.slug AS quiz_slug,
    q.title AS quiz_title,
    qs.step_id,
    qs.title AS step_title,
    qs.step_order,
    qa.question,
    qa.answer,
    COUNT(*) AS answer_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY q.id, qa.question), 2) AS answer_percentage
FROM
    public.quizzes q
    JOIN public.quiz_steps qs ON q.id = qs.quiz_id
    JOIN public.quiz_sessions s ON q.id = s.quiz_id
    JOIN public.quiz_answers qa ON s.id = qa.session_id AND qs.step_id = qa.step_id
WHERE
    qs.step_type = 'question'
GROUP BY
    q.id, q.slug, q.title, qs.step_id, qs.title, qs.step_order, qa.question, qa.answer
ORDER BY
    q.slug, qs.step_order, qa.question, answer_count DESC;

-- 3. Desempenho de conversão por quiz
CREATE OR REPLACE VIEW public.quiz_conversion_rates AS
SELECT
    q.id AS quiz_id,
    q.slug AS quiz_slug,
    q.title AS quiz_title,
    COUNT(DISTINCT s.id) AS total_sessions,
    COUNT(DISTINCT CASE WHEN s.finished_at IS NOT NULL THEN s.id END) AS completed_sessions,
    ROUND(COUNT(DISTINCT CASE WHEN s.finished_at IS NOT NULL THEN s.id END)::decimal / 
          NULLIF(COUNT(DISTINCT s.id), 0) * 100, 2) AS completion_rate,
    COUNT(DISTINCT l.id) AS total_leads,
    ROUND(COUNT(DISTINCT l.id)::decimal / 
          NULLIF(COUNT(DISTINCT s.id), 0) * 100, 2) AS lead_conversion_rate,
    ROUND(COUNT(DISTINCT l.id)::decimal / 
          NULLIF(COUNT(DISTINCT CASE WHEN s.finished_at IS NOT NULL THEN s.id END), 0) * 100, 2) AS complete_to_lead_rate
FROM
    public.quizzes q
    LEFT JOIN public.quiz_sessions s ON q.id = s.quiz_id
    LEFT JOIN public.leads l ON s.id = l.quiz_session_id
GROUP BY
    q.id, q.slug, q.title
ORDER BY
    total_sessions DESC;

-- 4. Tempo médio por etapa
CREATE OR REPLACE VIEW public.quiz_step_time AS
WITH step_times AS (
    SELECT
        q.id AS quiz_id,
        q.slug AS quiz_slug,
        qs.step_id,
        qs.step_order,
        qe.session_id,
        MIN(qe.created_at) AS step_start_time,
        LEAD(MIN(qe.created_at)) OVER (
            PARTITION BY qe.session_id 
            ORDER BY qs.step_order
        ) AS next_step_start_time
    FROM
        public.quizzes q
        JOIN public.quiz_steps qs ON q.id = qs.quiz_id
        JOIN public.quiz_events qe ON qs.step_id = (qe.event_data->>'step_id') AND qe.event_type = 'step_view'
    GROUP BY
        q.id, q.slug, qs.step_id, qs.step_order, qe.session_id
)
SELECT
    quiz_id,
    quiz_slug,
    step_id,
    step_order,
    COUNT(session_id) AS session_count,
    AVG(EXTRACT(EPOCH FROM (next_step_start_time - step_start_time))) AS avg_time_seconds,
    MIN(EXTRACT(EPOCH FROM (next_step_start_time - step_start_time))) AS min_time_seconds,
    MAX(EXTRACT(EPOCH FROM (next_step_start_time - step_start_time))) AS max_time_seconds,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (next_step_start_time - step_start_time))) AS median_time_seconds
FROM
    step_times
WHERE
    next_step_start_time IS NOT NULL
GROUP BY
    quiz_id, quiz_slug, step_id, step_order
ORDER BY
    quiz_slug, step_order;

-- 5. Sessões e leads por dia
CREATE OR REPLACE VIEW public.quiz_daily_stats AS
SELECT
    q.id AS quiz_id,
    q.slug AS quiz_slug,
    q.title AS quiz_title,
    DATE_TRUNC('day', s.started_at) AS date,
    COUNT(DISTINCT s.id) AS total_sessions,
    COUNT(DISTINCT CASE WHEN s.finished_at IS NOT NULL THEN s.id END) AS completed_sessions,
    COUNT(DISTINCT l.id) AS total_leads,
    ROUND(COUNT(DISTINCT l.id)::decimal / 
          NULLIF(COUNT(DISTINCT s.id), 0) * 100, 2) AS conversion_rate
FROM
    public.quizzes q
    LEFT JOIN public.quiz_sessions s ON q.id = s.quiz_id
    LEFT JOIN public.leads l ON s.id = l.quiz_session_id
GROUP BY
    q.id, q.slug, q.title, DATE_TRUNC('day', s.started_at)
ORDER BY
    date DESC, quiz_slug;