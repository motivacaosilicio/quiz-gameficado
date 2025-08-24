export const metadata = {
  title: 'Login Administrativo',
  description: 'Acesse o painel administrativo do sistema de funil de quizzes',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}