import { NextRequest } from 'next/server';
import { completeSessionApi } from '@/modules/quiz/api';

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Aguardar os parâmetros dinâmicos conforme recomendação do Next.js
    const awaitedParams = await params;
    const sessionId = awaitedParams.sessionId;
    
    // Usar a função do módulo para completar a sessão
    return completeSessionApi(sessionId);
  } catch (e: any) {
    console.error('Unexpected error in route handler:', e);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
