-- This migration resets the migration state for the failed migration
-- It deletes the failed migration record from the _prisma_migrations table
-- This allows Prisma to apply the migration again

-- Delete the failed migration record
DELETE FROM "_prisma_migrations"
WHERE migration_name = '20250520130900_add_plugin_credential_model';

-- Ensure both tables exist with the correct structure
-- These statements will be skipped if the tables already exist

-- Ensure PluginCredential table exists
CREATE TABLE IF NOT EXISTS "PluginCredential" (
    "id" TEXT NOT NULL,
    "pluginId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentials" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PluginCredential_pkey" PRIMARY KEY ("id")
);

-- Ensure AccessibilityLog table exists
CREATE TABLE IF NOT EXISTS "AccessibilityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "settingChanged" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "action" TEXT,
    "feature" TEXT,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessibilityLog_pkey" PRIMARY KEY ("id")
);

-- Ensure indexes exist
CREATE UNIQUE INDEX IF NOT EXISTS "PluginCredential_pluginId_userId_key" ON "PluginCredential"("pluginId", "userId");

-- Ensure foreign keys exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'PluginCredential_userId_fkey'
    ) THEN
        ALTER TABLE "PluginCredential" 
        ADD CONSTRAINT "PluginCredential_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'AccessibilityLog_userId_fkey'
    ) THEN
        ALTER TABLE "AccessibilityLog" 
        ADD CONSTRAINT "AccessibilityLog_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;