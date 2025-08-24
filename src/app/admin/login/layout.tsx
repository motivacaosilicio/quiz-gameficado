export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Login Administrativo</title>
      </head>
      <body className="min-h-screen bg-gray-100 flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}