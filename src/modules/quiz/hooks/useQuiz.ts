'use client'

import { useState, useEffect } from 'react';
import { createQuizClient } from '../adapters/supabase';

// TODO: Usar os tipos do módulo quando fizermos a migração completa
// import { QuizState, EventType } from '../types';

interface QuizState {
  currentQuestionIndex: number;
  answers: { [key: string]: string };
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
  totalQuestions: number;
}

// Enum de tipos de eventos compatível com o backend
type EventType = 'page_view' | 'button_click' | 'form_submit' | 'quiz_start' | 'quiz_complete' | 'step_complete' | 'step_view' | 'answer' | 'submit_lead' | 'webhook_success' | 'webhook_failure';

/**
 * Hook para gerenciar o estado e a lógica do quiz.
 * Em uma futura refatoração, este hook usará os tipos definidos em @/modules/quiz/types
 */
const useQuiz = (slug?: string) => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    sessionId: null,
    isLoading: true, // Começar com loading true
    error: null,
    totalQuestions: 16, // Total number of questions (agora desagrupadas)
  });

  const supabase = createQuizClient();

  // Initialize quiz session
  useEffect(() => {
    if (!slug) {
      // Se não houver slug, deixar em estado de carregamento mas sem erro
      setQuizState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const initializeSession = async () => {
      try {
        setQuizState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Get quiz ID from slug
        const { data: quiz, error: quizError } = await supabase
          .from('quizzes')
          .select('id')
          .eq('slug', slug)
          .single();

        if (quizError) {
          console.error('Error fetching quiz:', quizError);
          throw new Error(`Failed to fetch quiz: ${quizError.message}`);
        }

        if (!quiz) {
          throw new Error(`Quiz with slug "${slug}" not found`);
        }

        // Create a new session
        const response = await fetch(`/api/quizzes/${slug}/sessions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quiz_id: quiz.id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to create session: ${errorData.message}`);
        }

        const session = await response.json();
        
        setQuizState(prev => ({ 
          ...prev, 
          sessionId: session.id,
          isLoading: false 
        }));

        // Record quiz_start event
        await recordEvent('quiz_start', 'opening', { quiz_id: quiz.id, quiz_slug: slug });
        
        // Record step view event for the first step
        await recordStepView('opening');
      } catch (error: unknown) {
        console.error('Error initializing quiz session:', error);
        setQuizState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error.message 
        }));
      }
    };

    initializeSession();
  }, [slug, recordEvent, recordStepView, supabase]);

  // Generic event recording function
  const recordEvent = async (eventType: EventType, stepId: string, additionalData: Record<string, unknown> = {}) => {
    if (!quizState.sessionId) {
      console.warn('Cannot record event: No session ID', { eventType, stepId });
      return;
    }

    try {
      const sessionId = quizState.sessionId;
      console.log(`Recording ${eventType} event for step ${stepId} in session ${sessionId}`);
      
      const response = await fetch(`/api/sessions/${sessionId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: eventType,
          step_id: stepId,
          event_data: {
            ...additionalData,
            timestamp: new Date().toISOString(),
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error recording ${eventType} event:`, errorData);
      } else {
        console.log(`Successfully recorded ${eventType} event`);
      }
    } catch (error) {
      console.error(`Error recording ${eventType} event:`, error);
    }
  };

  const recordStepView = async (stepId: string) => {
    await recordEvent('step_view', stepId);
  };

  const nextQuestion = async () => {
    // Verificar se há uma próxima questão
    const nextIndex = Math.min(quizState.currentQuestionIndex + 1, quizState.totalQuestions - 1);
    
    // Lista de todas as questões individuais (desagrupadas)
    const questions = [
      'opening', 'age', 'tech', 'socialProof', 'difficulty',
      'distraction', 'help', 'ai', 'pain', 'feeling', 'desire',
      'testimonials', 'helpPromise', 'microCommitment', 'loading', 'solution'
    ];
    
    // Registrar que o usuário completou esta etapa
    if (quizState.currentQuestionIndex < questions.length) {
      const currentStepId = questions[quizState.currentQuestionIndex];
      await recordEvent('step_complete', currentStepId);
    }
    
    setQuizState((prevState) => ({
      ...prevState,
      currentQuestionIndex: nextIndex,
    }));

    if (nextIndex < questions.length) {
      await recordStepView(questions[nextIndex]);
    }

    // If we're at the last question, complete the session
    if (nextIndex === questions.length - 1) {
      await completeSession();
    }
  };

  const previousQuestion = async () => {
    if (quizState.currentQuestionIndex > 0) {
      const prevIndex = quizState.currentQuestionIndex - 1;
      
      setQuizState((prevState) => ({
        ...prevState,
        currentQuestionIndex: prevIndex,
      }));

      // Lista de todas as questões individuais (desagrupadas)
      const questions = [
        'opening', 'age', 'tech', 'socialProof', 'difficulty',
        'distraction', 'help', 'ai', 'pain', 'feeling', 'desire',
        'testimonials', 'helpPromise', 'microCommitment', 'loading', 'solution'
      ];

      await recordStepView(questions[prevIndex]);
    }
  };

  const recordAnswer = async (questionId: string, answer: string) => {
    if (!quizState.sessionId) return;

    setQuizState((prevState) => ({
      ...prevState,
      answers: {
        ...prevState.answers,
        [questionId]: answer,
      },
    }));

    try {
      const sessionId = quizState.sessionId;
      const stepId = getCurrentStepId();
      
      console.log(`Recording answer for question ${questionId} in step ${stepId}`);
      
      // Record the answer in the database
      const answerResponse = await fetch(`/api/sessions/${sessionId}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step_id: stepId,
          question: questionId,
          answer: answer,
        }),
      });
      
      if (!answerResponse.ok) {
        const errorData = await answerResponse.json();
        console.error('Error recording answer:', errorData);
      }

      // Record answer event with the actual answer data
      await recordEvent('answer', stepId, { question: questionId, answer });
    } catch (error) {
      console.error('Error recording answer:', error);
    }
  };

  const getCurrentStepId = () => {
    // Lista de todas as questões individuais (desagrupadas)
    const questions = [
      'opening', 'age', 'tech', 'socialProof', 'difficulty',
      'distraction', 'help', 'ai', 'pain', 'feeling', 'desire',
      'testimonials', 'helpPromise', 'microCommitment', 'loading', 'solution'
    ];
    // Garantir que o índice está dentro dos limites
    const index = Math.min(quizState.currentQuestionIndex, questions.length - 1);
    return questions[index];
  };

  const completeSession = async () => {
    if (!quizState.sessionId) return;

    try {
      const sessionId = quizState.sessionId;
      
      // Register quiz_complete event
      await recordEvent('quiz_complete', 'solution');
      
      // Mark session as complete
      const response = await fetch(`/api/sessions/${sessionId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error completing session:', errorData);
      }
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  return {
    quizState,
    nextQuestion,
    previousQuestion,
    recordAnswer,
    getCurrentStepId,
  };
};

export default useQuiz;