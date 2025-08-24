import { NextRequest } from 'next/server';
import { recordSessionAnswerApi } from '@/modules/quiz/api';

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Aguardar os parâmetros dinâmicos conforme recomendação do Next.js
    const awaitedParams = await params;
    const sessionId = awaitedParams.sessionId;
    
    // Processar o corpo da requisição
    const body = await req.json();
    
    // Usar a função do módulo para registrar a resposta
    return recordSessionAnswerApi(sessionId, body);
  } catch (e: any) {
    console.error('Unexpected error in route handler:', e);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}