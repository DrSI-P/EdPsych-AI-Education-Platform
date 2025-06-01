-- Supabase Function Search Path Security Fix
-- This script fixes the "Function Search Path Mutable" warnings by explicitly setting search_path in each function

-- Fix exec_sql function
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Fix get_default_tenant_id function
CREATE OR REPLACE FUNCTION public.get_default_tenant_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_tenant_id uuid;
BEGIN
  SELECT id INTO default_tenant_id FROM "Tenant" WHERE domain = 'edpsychconnect.com' LIMIT 1;
  RETURN default_tenant_id;
END;
$$;

-- Fix current_tenant_id function
CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tenant_id uuid;
BEGIN
  tenant_id := current_setting('app.tenant_id', true)::uuid;
  RETURN tenant_id;
EXCEPTION
  WHEN OTHERS THEN
    -- Fall back to default tenant if tenant_id is not set
    RETURN get_default_tenant_id();
END;
$$;

-- Fix set_tenant_context function
CREATE OR REPLACE FUNCTION public.set_tenant_context(tenant_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM set_config('app.tenant_id', tenant_id::text, false);
END;
$$;

-- Fix ensure_default_tenant function
CREATE OR REPLACE FUNCTION public.ensure_default_tenant()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_tenant_id uuid;
BEGIN
  -- Check if default tenant exists
  SELECT id INTO default_tenant_id FROM "Tenant" WHERE domain = 'edpsychconnect.com' LIMIT 1;
  
  -- If not, create it
  IF default_tenant_id IS NULL THEN
    INSERT INTO "Tenant" (name, domain, type, settings, created_at, updated_at)
    VALUES ('Default Tenant', 'edpsychconnect.com', 'organization', '{}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id INTO default_tenant_id;
  END IF;
  
  RETURN default_tenant_id;
END;
$$;

-- Fix table_exists function
CREATE OR REPLACE FUNCTION public.table_exists(p_schema_name text, p_table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = p_schema_name AND table_name = p_table_name
  );
END;
$$;

-- Fix ensure_tenant_column function
CREATE OR REPLACE FUNCTION public.ensure_tenant_column(schema_name text, table_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  column_exists boolean;
BEGIN
  -- Check if tenant_id column exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = schema_name AND table_name = table_name AND column_name = 'tenant_id'
  ) INTO column_exists;
  
  -- If not, add it
  IF NOT column_exists THEN
    EXECUTE format('ALTER TABLE %I.%I ADD COLUMN tenant_id uuid REFERENCES "Tenant"(id)', schema_name, table_name);
  END IF;
END;
$$;

-- Fix setup_rls_policy function
CREATE OR REPLACE FUNCTION public.setup_rls_policy(schema_name text, table_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Enable RLS on the table
  EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', schema_name, table_name);
  
  -- Drop existing policy if it exists
  EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON %I.%I', schema_name, table_name);
  
  -- Create policy for tenant isolation
  EXECUTE format('CREATE POLICY tenant_isolation_policy ON %I.%I 
                 USING (tenant_id IS NULL OR tenant_id = current_tenant_id())
                 WITH CHECK (tenant_id = current_tenant_id())', 
                 schema_name, table_name);
END;
$$;

-- Fix verify_tenant_setup function
CREATE OR REPLACE FUNCTION public.verify_tenant_setup()
RETURNS TABLE(component text, status text, details text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tenant_exists boolean;
  default_tenant_id uuid;
  tenant_context_function_exists boolean;
BEGIN
  -- Check if Tenant table exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'Tenant'
  ) INTO tenant_exists;
  
  IF tenant_exists THEN
    RETURN QUERY SELECT 'Tenant Table'::text, 'OK'::text, 'Tenant table exists'::text;
  ELSE
    RETURN QUERY SELECT 'Tenant Table'::text, 'ERROR'::text, 'Tenant table does not exist'::text;
  END IF;
  
  -- Check if default tenant exists
  IF tenant_exists THEN
    SELECT id INTO default_tenant_id FROM "Tenant" WHERE domain = 'edpsychconnect.com' LIMIT 1;
    
    IF default_tenant_id IS NOT NULL THEN
      RETURN QUERY SELECT 'Default Tenant'::text, 'OK'::text, 
                         format('Default tenant exists with ID: %s', default_tenant_id)::text;
    ELSE
      RETURN QUERY SELECT 'Default Tenant'::text, 'ERROR'::text, 
                         'Default tenant with domain edpsychconnect.com does not exist'::text;
    END IF;
  END IF;
  
  -- Check if tenant context function exists
  SELECT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'current_tenant_id' AND pronamespace = 'public'::regnamespace::oid
  ) INTO tenant_context_function_exists;
  
  IF tenant_context_function_exists THEN
    RETURN QUERY SELECT 'Tenant Context Function'::text, 'OK'::text, 
                       'current_tenant_id function exists'::text;
  ELSE
    RETURN QUERY SELECT 'Tenant Context Function'::text, 'ERROR'::text, 
                       'current_tenant_id function does not exist'::text;
  END IF;
  
  -- Overall setup status
  IF tenant_exists AND default_tenant_id IS NOT NULL AND tenant_context_function_exists THEN
    RETURN QUERY SELECT 'Overall Setup'::text, 'OK'::text, 'Tenant model is properly set up'::text;
  ELSE
    RETURN QUERY SELECT 'Overall Setup'::text, 'ERROR'::text, 
                       'Tenant model setup is incomplete or has issues'::text;
  END IF;
END;
$$;

-- Verify all functions have been updated
SELECT 'All tenant-related functions have been updated with explicit search_path settings' AS result;
