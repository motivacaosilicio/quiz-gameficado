-- Criar funções utilitárias para verificação de conexão e debugging

-- Função para listar todas as tabelas disponíveis no schema public
CREATE OR REPLACE FUNCTION public.available_tables()
RETURNS TABLE (table_name text, table_schema text) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tables.table_name::text, 
    tables.table_schema::text
  FROM 
    information_schema.tables tables
  WHERE 
    tables.table_schema = 'public'
  ORDER BY 
    tables.table_name;
END;
$$ LANGUAGE plpgsql;

-- Conceder permissões para a função
GRANT EXECUTE ON FUNCTION public.available_tables() TO anon, authenticated, service_role;

-- Função para retornar a versão do PostgreSQL
CREATE OR REPLACE FUNCTION public.version()
RETURNS text
SECURITY DEFINER
AS $$
BEGIN
  RETURN current_setting('server_version');
END;
$$ LANGUAGE plpgsql;

-- Conceder permissões para a função
GRANT EXECUTE ON FUNCTION public.version() TO anon, authenticated, service_role;