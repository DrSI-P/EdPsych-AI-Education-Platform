-- Supabase Database Reset Script
-- WARNING: This script will delete all data in your database
-- Make sure you have a backup before running this script

-- Step 1: Disable foreign key checks to avoid constraint errors during table drops
-- This is automatically handled in PostgreSQL

-- Step 2: Get a list of all tables except the Supabase system tables
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all tables except Supabase system tables
    FOR r IN (
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'supabase_%'
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE 'auth_%'
        AND tablename NOT LIKE 'storage_%'
        AND tablename NOT LIKE 'graphql_%'
        AND tablename NOT LIKE 'realtime_%'
    ) 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS "' || r.tablename || '" CASCADE';
    END LOOP;
    
    -- Also drop the _prisma_migrations table specifically
    EXECUTE 'DROP TABLE IF EXISTS "_prisma_migrations" CASCADE';
END $$;

-- Step 3: Verify all tables have been dropped
-- You can run this query to check if any non-system tables remain
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'supabase_%' AND tablename NOT LIKE 'pg_%' AND tablename NOT LIKE 'auth_%' AND tablename NOT LIKE 'storage_%' AND tablename NOT LIKE 'graphql_%' AND tablename NOT LIKE 'realtime_%';

-- Step 4: Create a fresh _prisma_migrations table (optional, Prisma will create this automatically)
-- CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
--     id VARCHAR(36) NOT NULL,
--     checksum VARCHAR(64) NOT NULL,
--     finished_at TIMESTAMP WITH TIME ZONE,
--     migration_name VARCHAR(255) NOT NULL,
--     logs TEXT,
--     rolled_back_at TIMESTAMP WITH TIME ZONE,
--     started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
--     applied_steps_count INTEGER NOT NULL DEFAULT 0,
--     PRIMARY KEY (id)
-- );

-- Note: After running this script, you should run:
-- 1. npx prisma migrate reset --force
-- 2. npx prisma migrate dev
-- This will recreate all tables and apply all migrations
