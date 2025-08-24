'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Quiz } from '../types';

interface QuizzesListPageProps {
  quizzes: Quiz[];
  basePath?: string;
}

/**
 * Componente de página para listagem de quizzes disponíveis
 * @param props.quizzes Lista de quizzes a serem exibidos
 * @param props.basePath Caminho base para os links de quizzes (padrão: '/quiz')
 */
export function QuizzesListPage({ quizzes, basePath = '/quiz' }: QuizzesListPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="w-full py-6 px-4 md:px-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
            Plataforma de Quizzes
          </h1>
        </div>
      </header>

      <main>
        <section className="py-10 md:py-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
              Quizzes Disponíveis
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Explore nossa seleção de quizzes interativos e encontre soluções personalizadas para suas necessidades.
            </p>
            
            {quizzes.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg">Não há quizzes disponíveis no momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{quiz.title}</h3>
                    <p className="text-gray-600 mb-8 h-20 overflow-hidden">{quiz.description}</p>
                    <Link 
                      href={`${basePath}/${quiz.slug}`}
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                    >
                      Iniciar quiz <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-5">
              Por que usar nossos quizzes?
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Nossa plataforma oferece diversas vantagens para você encontrar a solução ideal.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Rápido e Eficiente</h3>
                <p className="text-gray-600">Obtenha resultados personalizados em menos de 2 minutos, sem perder tempo.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Soluções Precisas</h3>
                <p className="text-gray-600">Algoritmos avançados para encontrar exatamente o que você precisa.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalizado</h3>
                <p className="text-gray-600">Cada recomendação é adaptada às suas necessidades específicas.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-8 px-4 md:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 mb-4">© {new Date().getFullYear()} Gemini Funnels. Todos os direitos reservados.</p>
          <p className="text-gray-500">Entre em contato: <a href="mailto:contato@geminifunnels.com" className="text-indigo-600 hover:underline">contato@geminifunnels.com</a></p>
        </div>
      </footer>
    </div>
  );
} 