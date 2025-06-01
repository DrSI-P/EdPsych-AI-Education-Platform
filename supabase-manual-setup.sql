// Supabase SQL Setup Script
// This file contains SQL commands to be executed directly in the Supabase SQL Editor
// to resolve the "Tenant or user not found" error

-- Step 1: Create exec_sql function for running SQL commands
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create tenant table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Tenant" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "domain" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- Step 3: Insert default tenant if it doesn't exist
INSERT INTO "Tenant" ("id", "name", "domain", "updatedAt")
VALUES ('default', 'Default Tenant', 'edpsychconnect.com', CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Step 4: Create tenant context function
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.tenant_id', TRUE);
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'default';
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create function to set tenant context
CREATE OR REPLACE FUNCTION set_tenant_context(tenant_id TEXT)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.tenant_id', tenant_id, FALSE);
END;
$$ LANGUAGE plpgsql;

-- Step 6: Ensure User table has tenant column
DO $$ 
BEGIN 
  -- Add tenantId column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'User' AND column_name = 'tenantId'
  ) THEN
    ALTER TABLE "User" ADD COLUMN "tenantId" TEXT;
  END IF;
  
  -- Update null values to default tenant
  UPDATE "User" SET "tenantId" = 'default' WHERE "tenantId" IS NULL;
  
  -- Make column not null
  ALTER TABLE "User" ALTER COLUMN "tenantId" SET NOT NULL;
  
  -- Add foreign key if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'User_tenantId_fkey'
  ) THEN
    ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" 
    FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error ensuring tenant column in User: %', SQLERRM;
END $$;

-- Step 7: Ensure Course table has tenant column
DO $$ 
BEGIN 
  -- Add tenantId column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Course' AND column_name = 'tenantId'
  ) THEN
    ALTER TABLE "Course" ADD COLUMN "tenantId" TEXT;
  END IF;
  
  -- Update null values to default tenant
  UPDATE "Course" SET "tenantId" = 'default' WHERE "tenantId" IS NULL;
  
  -- Make column not null
  ALTER TABLE "Course" ALTER COLUMN "tenantId" SET NOT NULL;
  
  -- Add foreign key if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'Course_tenantId_fkey'
  ) THEN
    ALTER TABLE "Course" ADD CONSTRAINT "Course_tenantId_fkey" 
    FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error ensuring tenant column in Course: %', SQLERRM;
END $$;

-- Step 8: Ensure BlogPost table has tenant column
DO $$ 
BEGIN 
  -- Add tenantId column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'BlogPost' AND column_name = 'tenantId'
  ) THEN
    ALTER TABLE "BlogPost" ADD COLUMN "tenantId" TEXT;
  END IF;
  
  -- Update null values to default tenant
  UPDATE "BlogPost" SET "tenantId" = 'default' WHERE "tenantId" IS NULL;
  
  -- Make column not null
  ALTER TABLE "BlogPost" ALTER COLUMN "tenantId" SET NOT NULL;
  
  -- Add foreign key if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'BlogPost_tenantId_fkey'
  ) THEN
    ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_tenantId_fkey" 
    FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error ensuring tenant column in BlogPost: %', SQLERRM;
END $$;

-- Step 9: Ensure BlogCategory table has tenant column
DO $$ 
BEGIN 
  -- Add tenantId column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'BlogCategory' AND column_name = 'tenantId'
  ) THEN
    ALTER TABLE "BlogCategory" ADD COLUMN "tenantId" TEXT;
  END IF;
  
  -- Update null values to default tenant
  UPDATE "BlogCategory" SET "tenantId" = 'default' WHERE "tenantId" IS NULL;
  
  -- Make column not null
  ALTER TABLE "BlogCategory" ALTER COLUMN "tenantId" SET NOT NULL;
  
  -- Add foreign key if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'BlogCategory_tenantId_fkey'
  ) THEN
    ALTER TABLE "BlogCategory" ADD CONSTRAINT "BlogCategory_tenantId_fkey" 
    FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error ensuring tenant column in BlogCategory: %', SQLERRM;
END $$;

-- Step 10: Set up RLS policies
-- Enable RLS on User table
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy ON "User";
CREATE POLICY tenant_isolation_policy ON "User"
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() IS NULL);

-- Enable RLS on Course table
ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy ON "Course";
CREATE POLICY tenant_isolation_policy ON "Course"
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() IS NULL);

-- Enable RLS on BlogPost table
ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy ON "BlogPost";
CREATE POLICY tenant_isolation_policy ON "BlogPost"
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() IS NULL);

-- Enable RLS on BlogCategory table
ALTER TABLE "BlogCategory" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_policy ON "BlogCategory";
CREATE POLICY tenant_isolation_policy ON "BlogCategory"
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() IS NULL);

-- Step 11: Grant permissions to authenticated users
GRANT ALL ON "Tenant" TO authenticated;
GRANT ALL ON "User" TO authenticated;
GRANT ALL ON "Course" TO authenticated;
GRANT ALL ON "BlogPost" TO authenticated;
GRANT ALL ON "BlogCategory" TO authenticated;
