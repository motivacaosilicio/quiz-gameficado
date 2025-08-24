import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="quiz-layout">
      {/* Sem cabeçalho nem rodapé, apenas o conteúdo principal */}
      {children}
    </div>
  );
} 