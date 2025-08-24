import React from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Quiz Funnel System</h1>
      </header>
      <main>
        {children}
      </main>
      <footer className="mt-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Sua Empresa</p>
      </footer>
    </div>
  );
} 