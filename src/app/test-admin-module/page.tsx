import React from 'react';
import AdminClientPage from './page.client';

/**
 * Página de teste para o módulo Admin
 * Usa um componente cliente para renderizar a interface interativa
 */
export default function TestAdminModulePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Teste do Módulo Admin</h1>
      <AdminClientPage />
    </div>
  );
}
