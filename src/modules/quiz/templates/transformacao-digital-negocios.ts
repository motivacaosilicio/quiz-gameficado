// Template para quiz de Transformação Digital para Negócios

import { QuizTemplate } from '../types';

export const quizTemplate: QuizTemplate = {
  slug: 'transformacao-digital-negocios',
  title: 'Transformação Digital para Negócios',
  description: 'Descubra como a tecnologia pode transformar seu negócio e aumentar seus resultados.',
  questions: [
    {
      id: 'opening',
      title: 'Sua empresa está pronta para a transformação digital?',
      subtitle: 'Responda algumas perguntas e descubra como adaptar seu negócio para o mundo digital em menos de 2 minutos!',
    },
    {
      id: 'business_size',
      category: 'demographics',
      question: 'Qual o tamanho da sua empresa?',
      options: ['Autônomo/MEI', 'Micro (até 9 funcionários)', 'Pequena (10-49 funcionários)', 'Média (50-99 funcionários)', 'Grande (100+ funcionários)'],
    },
    {
      id: 'segment',
      category: 'demographics',
      question: 'Em qual segmento sua empresa atua?',
      options: [
        'Comércio varejista', 
        'Prestação de serviços', 
        'Indústria/Manufatura', 
        'Tecnologia/Software', 
        'Educação',
        'Saúde',
        'Outro'
      ],
    },
    {
      id: 'socialProof',
      text: 'Mais de 500 empresas já transformaram seu negócio com nossa metodologia!',
      image: 'URL_IMAGEM_PROVA_SOCIAL',
    },
    {
      id: 'digital_presence',
      category: 'assessment',
      question: 'Como está a presença digital da sua empresa atualmente?',
      options: ['Não temos presença online', 'Temos apenas redes sociais', 'Temos site e redes sociais', 'Temos site, redes sociais e vendemos online'],
    },
    {
      id: 'digital_tools',
      category: 'assessment',
      question: 'Quais ferramentas digitais você utiliza no dia a dia do negócio? (Selecione todas que se aplicam)',
      options: [
        'CRM ou sistema de gestão de clientes', 
        'Software de gestão financeira', 
        'Ferramentas de marketing digital', 
        'Automação de e-mail marketing', 
        'Aplicativos de produtividade (Google Workspace, Microsoft 365)',
        'Sistemas de pagamento digital'
      ],
      multiSelect: true,
      maxSelections: 6,
    },
    {
      id: 'challenges',
      category: 'painPoints',
      question: 'Quais são os maiores desafios para digitalizar seu negócio? (Selecione até 3)',
      options: [
        'Falta de conhecimento técnico', 
        'Custos elevados', 
        'Falta de tempo para implementação', 
        'Resistência da equipe', 
        'Dificuldade em escolher as tecnologias certas', 
        'Preocupações com segurança digital'
      ],
      multiSelect: true,
      maxSelections: 3,
    },
    {
      id: 'investment',
      category: 'assessment',
      question: 'Quanto você investe mensalmente em tecnologia e ferramentas digitais?',
      options: ['Nada', 'Até R$ 500', 'Entre R$ 500 e R$ 2.000', 'Entre R$ 2.000 e R$ 5.000', 'Mais de R$ 5.000'],
    },
    {
      id: 'goals',
      category: 'objectives',
      question: 'Qual o principal objetivo com a transformação digital?',
      options: [
        'Aumentar vendas', 
        'Reduzir custos operacionais', 
        'Melhorar a experiência do cliente', 
        'Automatizar processos internos', 
        'Expandir para novos mercados'
      ],
    },
    {
      id: 'testimonials',
      text: 'Veja como pequenas empresas estão crescendo com a transformação digital',
      image: 'URL_IMAGEM_DEPOIMENTOS',
    },
    {
      id: 'timeframe',
      question: 'Em quanto tempo você gostaria de implementar mudanças digitais no seu negócio?',
      options: ['Imediatamente', 'Nos próximos 3 meses', 'Nos próximos 6 meses', 'No próximo ano'],
    },
    {
      id: 'commitment',
      question: 'Qual seu nível de comprometimento com a transformação digital?',
      options: ['Muito comprometido', 'Moderadamente comprometido', 'Estou apenas explorando opções'],
    },
    {
      id: 'loading',
      text: 'Analisando suas respostas... Criando seu plano de transformação digital personalizado...',
    },
    {
      id: 'solution',
      title: 'Seu Plano de Transformação Digital',
      text: 'Com base nas suas respostas, criamos um plano personalizado para digitalizar seu negócio e aumentar seus resultados!',
      comparisonImage: 'URL_IMAGEM_COMPARACAO',
      benefits: [
        'Diagnóstico completo de maturidade digital', 
        'Roteiro personalizado de transformação digital', 
        'Seleção das ferramentas ideais para seu negócio',
        'Estratégias de implementação com baixo investimento'
      ],
      price: 'Oferta especial para quem completou o diagnóstico!',
      cta: 'Quero transformar meu negócio agora!',
    },
  ],
  questionOrder: [
    'opening', 'business_size', 'segment', 'socialProof', 'digital_presence',
    'digital_tools', 'challenges', 'investment', 'goals', 'testimonials',
    'timeframe', 'commitment', 'loading', 'solution'
  ],
  testimonials: [
    {
      text: "Aumentamos nossas vendas em 70% após implementar as estratégias digitais recomendadas!",
      author: "João Silva, Loja de Calçados"
    },
    {
      text: "Conseguimos reduzir custos e aumentar a produtividade com as ferramentas certas para nosso negócio.",
      author: "Luciana Mendes, Consultório Odontológico"
    }
  ]
};