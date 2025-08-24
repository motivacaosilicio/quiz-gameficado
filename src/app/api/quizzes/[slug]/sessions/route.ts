import { NextRequest } from 'next/server';
import { createQuizSessionApi } from '@/modules/quiz/api';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Aguardar os parâmetros dinâmicos conforme recomendação do Next.js
    const awaitedParams = await params;
    const slug = awaitedParams.slug;
    
    // Processar o corpo da requisição
    const body = await req.json();
    
    // Usar a função do módulo para criar a sessão
    return createQuizSessionApi(slug, body);
  } catch (e: any) {
    console.error('Unexpected error in route handler:', e);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}