import React from 'react';
import QuizClient from './page.client';

/**
 * Componente servidor que renderiza a página do quiz
 * Usa um componente cliente para renderizar a interface interativa
 */
export default function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  return <QuizClient slug={slug} />;
}
