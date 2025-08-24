'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  FunnelChart,
  Funnel,
  FunnelProps,
  Cell,
  LabelList,
  PieChart,
  Pie,
} from 'recharts';

// Definição das interfaces
interface QuizAnalytics {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  created_at: string;
  
  // Métricas gerais
  totalSessions: number;
  totalCompletions: number;
  totalLeads: number;
  completionRate: number;
  
  // Dados por etapa
  funnelData: {
    name: string;
    value: number;
    stepId: string;
    conversionRate: number; // % em relação à etapa anterior
  }[];
  
  // Dados por pergunta
  questionData: {
    question: string;
    stepId: string;
    answers: {
      answer: string;
      count: number;
      percentage: number;
    }[];
  }[];
  
  // Dados por dia
  dailyData: {
    date: string;
    sessions: number;
    leads: number;
  }[];
}

export default function QuizAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'7' | '30' | 'all'>('7');
  
  // Usar React.use() para acessar os parâmetros de forma segura
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  
  // Paleta de cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#83A6ED', '#8DD1E1', '#82CA9D'];

  useEffect(() => {
    async function fetchAnalytics() {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Usar diretamente o cliente Supabase
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          'http://127.0.0.1:54321',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
        );
        
        // Buscar informações do quiz
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', id)
          .single();
        
        if (quizError) throw quizError;
        if (!quizData) throw new Error('Quiz não encontrado');
        
        // Filtrar por período
        let dateFilter;
        if (period !== 'all') {
          const daysAgo = new Date();
          daysAgo.setDate(daysAgo.getDate() - parseInt(period));
          dateFilter = daysAgo.toISOString();
        }
        
        // Buscar estatísticas gerais
        let sessionQuery = supabase
          .from('quiz_sessions')
          .select('count', { count: 'exact' })
          .eq('quiz_id', id);
          
        if (dateFilter) {
          sessionQuery = sessionQuery.gte('started_at', dateFilter);
        }
        
        const { data: totalSessionsData, error: sessionsError } = await sessionQuery;
        
        if (sessionsError) throw sessionsError;
        
        // Buscar total de sessões completadas
        let completionsQuery = supabase
          .from('quiz_sessions')
          .select('count', { count: 'exact' })
          .eq('quiz_id', id)
          .not('finished_at', 'is', null);
          
        if (dateFilter) {
          completionsQuery = completionsQuery.gte('started_at', dateFilter);
        }
        
        const { data: completionsData, error: completionsError } = await completionsQuery;
        
        if (completionsError) throw completionsError;
        
        // Buscar total de leads - Consulta separada para evitar erro de embedded resource
        // Primeiro buscamos todos os IDs de sessão para este quiz
        let sessionsIdsQuery = supabase
          .from('quiz_sessions')
          .select('id')
          .eq('quiz_id', id);
        
        if (dateFilter) {
          sessionsIdsQuery = sessionsIdsQuery.gte('started_at', dateFilter);
        }
        
        const { data: sessionsIdsData, error: sessionsIdsError } = await sessionsIdsQuery;
        
        if (sessionsIdsError) throw sessionsIdsError;
        
        // Inicializar valor padrão
        let totalLeads = 0;
        
        // Usamos os IDs de sessão para buscar os leads
        if (sessionsIdsData && sessionsIdsData.length > 0) {
          const sessionIds = sessionsIdsData.map(s => s.id);
          let leadsQuery = supabase
            .from('leads')
            .select('count', { count: 'exact' })
            .in('quiz_session_id', sessionIds);
            
          if (dateFilter) {
            leadsQuery = leadsQuery.gte('created_at', dateFilter);
          }
          
          const { data: leadsData, error: leadsError } = await leadsQuery;
          
          if (leadsError) throw leadsError;
          
          totalLeads = leadsData?.[0]?.count || 0;
        }
        
        // Buscar dados do funil (passos do quiz) - simplificados por enquanto
        // Inicializar com um array vazio para evitar erro
        const funnelData = [];
        
        try {
          let funnelQuery = supabase
            .from('quiz_funnel_overview')
            .select('*')
            .eq('quiz_id', id);
            
          if (dateFilter) {
            funnelQuery = funnelQuery.gte('date', dateFilter);
          }
          
          const { data, error } = await funnelQuery;
          
          if (!error && data) {
            // Adicionar ao array de dados de funil
            funnelData.push(...data);
          } else {
            console.warn('Aviso: Dados de funil não disponíveis:', error);
          }
        } catch (e) {
          console.warn('Erro ao buscar dados de funil:', e);
          // Continuar mesmo se houver erro, já que não é crítico
        }
        
        // Buscar dados de respostas às perguntas - simplificados por enquanto
        // Inicializar com um array vazio para evitar erro
        const questionData = [];
        
        try {
          let questionsQuery = supabase
            .from('quiz_question_answers')
            .select('*')
            .eq('quiz_id', id);
            
          if (dateFilter) {
            questionsQuery = questionsQuery.gte('date', dateFilter);
          }
          
          const { data, error } = await questionsQuery;
          
          if (!error && data) {
            // Adicionar ao array de dados de perguntas
            questionData.push(...data);
          } else {
            console.warn('Aviso: Dados de perguntas não disponíveis:', error);
          }
        } catch (e) {
          console.warn('Erro ao buscar dados de perguntas:', e);
          // Continuar mesmo se houver erro, já que não é crítico
        }
        
        // Buscar dados diários - simplificados por enquanto
        // Inicializar com um array vazio para evitar erro
        const dailyData = [];
        
        try {
          let dailyQuery = supabase
            .from('quiz_daily_stats')
            .select('*')
            .eq('quiz_id', id);
            
          if (dateFilter) {
            dailyQuery = dailyQuery.gte('date', dateFilter);
          }
          
          const { data, error } = await dailyQuery;
          
          if (!error && data) {
            // Adicionar ao array de dados diários
            dailyData.push(...data);
          } else {
            console.warn('Aviso: Dados diários não disponíveis:', error);
          }
        } catch (e) {
          console.warn('Erro ao buscar dados diários:', e);
          // Continuar mesmo se houver erro, já que não é crítico
        }
        
        // Processar dados do funil
        const processedFunnel = processFunnelData(funnelData);
        
        // Processar dados de perguntas
        const processedQuestions = processQuestionData(questionData);
        
        // Processar dados diários
        const processedDaily = processDailyData(dailyData);
        
        // Calcular taxa de conclusão
        const totalSessions = totalSessionsData?.[0]?.count || 0;
        const totalCompletions = completionsData?.[0]?.count || 0;
        // totalLeads já foi definido acima
        const completionRate = totalSessions > 0 
          ? (totalCompletions / totalSessions) * 100 
          : 0;
        
        setAnalytics({
          id: quizData.id,
          title: quizData.title,
          slug: quizData.slug,
          description: quizData.description,
          created_at: quizData.created_at,
          totalSessions,
          totalCompletions,
          totalLeads,
          completionRate,
          funnelData: processedFunnel,
          questionData: processedQuestions,
          dailyData: processedDaily,
        });
      } catch (err: any) {
        console.error('Erro ao buscar analytics:', err);
        setError(err.message || 'Erro ao carregar os dados analíticos');
      } finally {
        setIsLoading(false);
      }
    }
    
    // Funções auxiliares para processar dados
    function processFunnelData(data: any[]) {
      if (!data || data.length === 0) return [];
      
      // Agrupar por step_id, nome e contar views/completes
      const stepCounts: Record<string, { name: string, views: number, completes: number }> = {};
      
      data.forEach(item => {
        if (!stepCounts[item.step_id]) {
          stepCounts[item.step_id] = {
            name: item.step_name || `Etapa ${item.step_id}`,
            views: 0,
            completes: 0,
          };
        }
        
        stepCounts[item.step_id].views += item.view_count || 0;
        stepCounts[item.step_id].completes += item.complete_count || 0;
      });
      
      // Converter para array e ordenar por step_id
      const steps = Object.entries(stepCounts)
        .map(([stepId, counts]) => ({
          stepId,
          name: counts.name,
          value: counts.views, // Usar views como valor principal
          completion: counts.completes,
          conversionRate: counts.views > 0 ? (counts.completes / counts.views) * 100 : 0,
        }))
        .sort((a, b) => a.stepId.localeCompare(b.stepId));
      
      // Calcular taxa de conversão em relação à etapa anterior
      return steps.map((step, index) => {
        if (index === 0) {
          return { ...step, conversionRate: 100 };
        }
        
        const prevStep = steps[index - 1];
        const conversionRate = prevStep.value > 0 
          ? (step.value / prevStep.value) * 100 
          : 0;
        
        return { ...step, conversionRate };
      });
    }
    
    function processQuestionData(data: any[]) {
      if (!data || data.length === 0) return [];
      
      // Agrupar por pergunta e contar respostas
      const questionMap: Record<string, { 
        question: string, 
        stepId: string,
        answers: Record<string, number> 
      }> = {};
      
      data.forEach(item => {
        const key = `${item.step_id}:${item.question}`;
        
        if (!questionMap[key]) {
          questionMap[key] = {
            question: item.question,
            stepId: item.step_id,
            answers: {},
          };
        }
        
        if (!questionMap[key].answers[item.answer]) {
          questionMap[key].answers[item.answer] = 0;
        }
        
        questionMap[key].answers[item.answer] += item.count || 0;
      });
      
      // Converter para o formato esperado
      return Object.values(questionMap).map(q => {
        const total = Object.values(q.answers).reduce((sum, count) => sum + count, 0);
        
        const answers = Object.entries(q.answers)
          .map(([answer, count]) => ({
            answer,
            count,
            percentage: total > 0 ? (count / total) * 100 : 0,
          }))
          .sort((a, b) => b.count - a.count);
        
        return {
          question: q.question,
          stepId: q.stepId,
          answers,
        };
      });
    }
    
    function processDailyData(data: any[]) {
      if (!data || data.length === 0) return [];
      
      // Agrupar por data e contar sessões e leads
      const dailyMap: Record<string, { sessions: number, leads: number }> = {};
      
      data.forEach(item => {
        const date = item.date.split('T')[0];
        
        if (!dailyMap[date]) {
          dailyMap[date] = {
            sessions: 0,
            leads: 0,
          };
        }
        
        dailyMap[date].sessions += item.session_count || 0;
        dailyMap[date].leads += item.lead_count || 0;
      });
      
      // Converter para array e ordenar por data
      return Object.entries(dailyMap)
        .map(([date, counts]) => ({
          date,
          sessions: counts.sessions,
          leads: counts.leads,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }

    fetchAnalytics();
  }, [id, period]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erro!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Aviso!</strong>
        <span className="block sm:inline"> Quiz não encontrado</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => window.location.href = '/admin/quizzes'}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para quizzes
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{analytics.title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Análise detalhada de desempenho do quiz
        </p>
      </div>
      
      {/* Seletor de período */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Período:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => setPeriod('7')}
              className={`px-3 py-1 text-sm rounded-md ${
                period === '7'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setPeriod('30')}
              className={`px-3 py-1 text-sm rounded-md ${
                period === '30'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              30 dias
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`px-3 py-1 text-sm rounded-md ${
                period === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todo período
            </button>
          </div>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">Sessões</p>
              <p className="text-2xl font-semibold text-gray-800">{analytics.totalSessions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">Conclusões</p>
              <p className="text-2xl font-semibold text-gray-800">{analytics.totalCompletions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">Leads</p>
              <p className="text-2xl font-semibold text-gray-800">{analytics.totalLeads}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm">Taxa de Conclusão</p>
              <p className="text-2xl font-semibold text-gray-800">{analytics.completionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráfico de Funil */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Funil de Conversão</h2>
        <div className="h-80">
          {analytics.funnelData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip />
                <Funnel
                  dataKey="value"
                  data={analytics.funnelData}
                  isAnimationActive
                >
                  {analytics.funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <LabelList
                    position="right"
                    fill="#000"
                    stroke="none"
                    dataKey="name"
                  />
                  <LabelList
                    position="center"
                    fill="#fff"
                    stroke="none"
                    dataKey={(entry) => `${Math.round(entry.conversionRate)}%`}
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Não há dados suficientes para mostrar o funil
            </div>
          )}
        </div>
      </div>
      
      {/* Gráfico Diário */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Desempenho Diário</h2>
        <div className="h-80">
          {analytics.dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.dailyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sessions" fill="#8884d8" name="Sessões" />
                <Bar dataKey="leads" fill="#82ca9d" name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Não há dados diários suficientes
            </div>
          )}
        </div>
      </div>
      
      {/* Análise de Respostas */}
      {analytics.questionData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Análise de Respostas</h2>
          
          <div className="space-y-6">
            {analytics.questionData.map((question, qIndex) => (
              <div key={`question-${qIndex}`} className="border-t pt-6 first:border-t-0 first:pt-0">
                <h3 className="font-medium text-gray-900 mb-3">{question.question}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={question.answers}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="answer"
                        >
                          {question.answers.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${value} respostas`, props.payload.answer]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="overflow-hidden">
                    <div className="divide-y">
                      {question.answers.map((answer, aIndex) => (
                        <div key={`answer-${aIndex}`} className="py-2 first:pt-0 last:pb-0">
                          <div className="flex items-center justify-between">
                            <div className="pr-4 text-sm text-gray-900">{answer.answer}</div>
                            <div className="text-sm font-medium text-gray-900">
                              {answer.count} ({answer.percentage.toFixed(1)}%)
                            </div>
                          </div>
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${answer.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}