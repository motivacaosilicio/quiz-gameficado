// Template para quiz de Aprendizagem IA para Crianças
import { QuizTemplate } from '../types';

// Define question types
export const quizTemplate: QuizTemplate = {
  slug: 'aprendizagem-ia-criancas',
  title: 'Aprendizagem com IA para Crianças',
  description: 'Descubra como seu filho pode aprender mais rápido e se destacar na escola com a ajuda da inteligência artificial.',
  questions: [
    {
      id: 'opening',
      title: 'Seu filho pode aprender mais rápido e se destacar na escola! Descubra como em 1 minuto!',
      subtitle: 'Responda algumas perguntas e veja como acelerar o aprendizado do seu filho com uma nova tecnologia!',
    },
    {
      id: 'age',
      category: 'demographics',
      question: 'Qual a idade do seu filho?',
      options: ['6 anos', '7 anos', '8 anos', '9 anos', '10 anos'],
    },
    {
      id: 'tech',
      category: 'demographics',
      question: 'Seu filho já usa tecnologia para aprender?',
      options: [
        'Sim, ele adora aprender no celular/tablet', 
        'Sim, mas só para tarefas escolares', 
        'Não, mas quero que ele use melhor a tecnologia', 
        'Não, prefiro métodos tradicionais'
      ],
    },
    {
      id: 'socialProof',
      text: 'Mais de 1.000 pais já estão usando essa estratégia para acelerar o aprendizado dos filhos!',
      image: 'URL_IMAGEM_PROVA_SOCIAL',
    },
    {
      id: 'difficulty',
      category: 'diagnostic',
      question: 'Seu filho tem dificuldade em aprender novos conteúdos?',
      options: ['Sim, ele demora para entender', 'Às vezes, depende do assunto', 'Não, ele aprende rápido'],
    },
    {
      id: 'distraction',
      category: 'diagnostic',
      question: 'Ele se distrai com facilidade durante os estudos?',
      options: ['Sim, qualquer coisa tira a atenção dele', 'Às vezes, mas consigo trazer de volta', 'Não, ele é bem focado'],
    },
    {
      id: 'help',
      category: 'diagnostic',
      question: 'Você sente que poderia ajudar mais no aprendizado dele, mas não sabe como?',
      options: ['Sim, quero ajudá-lo mais, mas não sei como', 'Tento ajudar, mas não tenho tempo', 'Não, ele aprende bem sozinho'],
    },
    {
      id: 'ai',
      category: 'diagnostic',
      question: 'Você já tentou usar inteligência artificial para ajudar no aprendizado do seu filho?',
      options: ['Sim, mas não deu certo', 'Não, mas quero testar', 'Não, acho complicado', 'Sim, e funcionou muito bem'],
    },
    {
      id: 'pain',
      category: 'painPoints',
      question: 'Quais desses problemas você já percebeu no aprendizado do seu filho? (Escolha até 3)',
      options: [
        'Dificuldade de concentração', 
        'Falta de motivação para estudar', 
        'Dificuldade para entender textos', 
        'Problemas com cálculos matemáticos', 
        'Medo de provas e testes', 
        'Falta de apoio para aprender em casa'
      ],
      multiSelect: true,
      maxSelections: 3,
    },
    {
      id: 'feeling',
      category: 'painPoints',
      question: 'Como você se sente ao ver seu filho com dificuldades para aprender?',
      options: [
        'Preocupado(a), porque isso pode afetar o futuro dele', 
        'Frustrado(a), porque não sei como ajudar', 
        'Normal, acho que faz parte do processo'
      ],
    },
    {
      id: 'desire',
      question: 'Se pudesse melhorar apenas um aspecto do aprendizado do seu filho, qual seria?',
      options: [
        'Melhorar a concentração', 
        'Ajudá-lo a entender conteúdos mais rápido', 
        'Tornar o estudo mais divertido', 
        'Aumentar a confiança dele nos estudos'
      ],
    },
    {
      id: 'testimonials',
      text: 'Veja o que pais que já usaram o método estão dizendo!',
      image: 'URL_IMAGEM_DEPOIMENTOS',
    },
    {
      id: 'helpPromise',
      text: 'A boa notícia é que existe uma forma simples e acessível de transformar o aprendizado do seu filho!',
      question: 'Você gostaria de aprender como usar o ChatGPT para acelerar o aprendizado do seu filho em apenas 14 dias?',
      options: ['Sim! Quero ajudar meu filho a aprender mais rápido!'],
    },
    {
      id: 'microCommitment',
      question: 'Qual o seu nível de motivação para ajudar seu filho a aprender melhor?',
      options: ['Estou muito motivado(a)!', 'Quero testar, mas tenho dúvidas', 'Tenho interesse, mas preciso saber mais'],
    },
    {
      id: 'loading',
      text: 'Analisando suas respostas... Criando plano personalizado para o aprendizado do seu filho...',
    },
    {
      id: 'solution',
      title: 'Parabéns! Seu filho está pronto para aprender mais rápido e se destacar nos estudos!',
      text: 'Com base nas suas respostas, seu filho pode melhorar a concentração, aprender de forma mais interativa e se destacar na escola usando nosso método com ChatGPT!',
      comparisonImage: 'URL_IMAGEM_COMPARACAO',
      benefits: ['Passo a passo para usar o ChatGPT no aprendizado', 'Exercícios práticos para aplicar com seu filho', 'Técnicas para manter a atenção e o foco'],
      price: 'Oferta especial para quem fez o quiz!',
      cta: 'Quero transformar o aprendizado do seu filho agora!',
    },
  ],
  testimonials: [
    {
      text: "Este método transformou a maneira como meu filho estuda. Ele está muito mais engajado e aprende muito mais rápido!",
      author: "Maria S., mãe de Pedro (8 anos)"
    },
    {
      text: "Minha filha tinha dificuldade com matemática. Com essa abordagem, ela superou seus bloqueios e agora adora resolver problemas!",
      author: "Carlos M., pai de Ana (9 anos)"
    }
  ],
  // Lista ordenada de IDs das perguntas para controle de navegação
  questionOrder: [
    'opening', 'age', 'tech', 'socialProof', 'difficulty',
    'distraction', 'help', 'ai', 'pain', 'feeling', 'desire',
    'testimonials', 'helpPromise', 'microCommitment', 'loading', 'solution'
  ]
};