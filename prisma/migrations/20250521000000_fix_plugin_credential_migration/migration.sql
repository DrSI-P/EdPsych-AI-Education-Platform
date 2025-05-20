-- This migration fixes the failed plugin credential migration
-- It first removes the failed migration record, then creates the table and constraints properly

-- Delete the failed migration record
DELETE FROM "_prisma_migrations"
WHERE migration_name = '20250520130900_add_plugin_credential_model'
  AND finished_at IS NULL;

-- Delete any other failed migration records related to this issue
DELETE FROM "_prisma_migrations"
WHERE migration_name IN (
  '20250520160000_create_accessibility_log',
  '20250520180000_combined_plugin_credential_and_accessibility_log',
  '20250520190000_reset_migration_state',
  '20250520200000_reset_failed_migrations'
)
AND finished_at IS NULL;

-- Ensure PluginCredential table exists with the correct structure
CREATE TABLE IF NOT EXISTS "PluginCredential" (
    "id" TEXT NOT NULL,
    "pluginId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentials" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PluginCredential_pkey" PRIMARY KEY ("id")
);

-- Ensure AccessibilityLog table exists with the correct structure
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

-- Create unique index on PluginCredential if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'PluginCredential_pluginId_userId_key'
    ) THEN
        CREATE UNIQUE INDEX "PluginCredential_pluginId_userId_key" ON "PluginCredential"("pluginId", "userId");
    END IF;
END
$$;

-- Add foreign key constraint to PluginCredential if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'PluginCredential_userId_fkey'
    ) THEN
        -- Check if the User table exists before adding the constraint
        IF EXISTS (
            SELECT 1 FROM pg_tables WHERE tablename = 'User'
        ) THEN
            ALTER TABLE "PluginCredential" 
            ADD CONSTRAINT "PluginCredential_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "User"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
    END IF;
END
$$;

-- Add foreign key constraint to AccessibilityLog if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'AccessibilityLog_userId_fkey'
    ) THEN
        -- Check if the User table exists before adding the constraint
        IF EXISTS (
            SELECT 1 FROM pg_tables WHERE tablename = 'User'
        ) THEN
            ALTER TABLE "AccessibilityLog" 
            ADD CONSTRAINT "AccessibilityLog_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "User"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
    END IF;
END
$$;

-- Mark all related migrations as completed in the _prisma_migrations table
-- This ensures Prisma thinks these migrations have been applied
INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
SELECT 
    gen_random_uuid(), 
    'dummy_checksum', 
    NOW(), 
    migration_name, 
    'Applied by fix migration', 
    NULL, 
    NOW(), 
    1
FROM (
    VALUES 
        ('20250520130900_add_plugin_credential_model'),
        ('20250520160000_create_accessibility_log'),
        ('20250520180000_combined_plugin_credential_and_accessibility_log')
) AS migrations(migration_name)
WHERE NOT EXISTS (
    SELECT 1 FROM "_prisma_migrations" 
    WHERE migration_name = migrations.migration_name 
    AND finished_at IS NOT NULL
);