-- Atualizar o enum quiz_event_type para incluir os novos tipos de eventos
ALTER TYPE quiz_event_type ADD VALUE IF NOT EXISTS 'step_view';
ALTER TYPE quiz_event_type ADD VALUE IF NOT EXISTS 'answer';
ALTER TYPE quiz_event_type ADD VALUE IF NOT EXISTS 'submit_lead';
ALTER TYPE quiz_event_type ADD VALUE IF NOT EXISTS 'webhook_success';
ALTER TYPE quiz_event_type ADD VALUE IF NOT EXISTS 'webhook_failure';