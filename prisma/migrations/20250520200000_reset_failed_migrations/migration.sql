-- This migration resets the failed migration state by deleting the failed migration records
-- It allows Prisma to retry the migrations

-- Delete the failed migration record for the PluginCredential model
DELETE FROM "_prisma_migrations"
WHERE migration_name = '20250520130900_add_plugin_credential_model'
  AND finished_at IS NULL;

-- Delete the failed migration record for the AccessibilityLog model if it exists
DELETE FROM "_prisma_migrations"
WHERE migration_name = '20250520160000_create_accessibility_log'
  AND finished_at IS NULL;

-- Delete the failed migration record for the combined migration if it exists
DELETE FROM "_prisma_migrations"
WHERE migration_name = '20250520180000_combined_plugin_credential_and_accessibility_log'
  AND finished_at IS NULL;

-- Delete the failed migration record for the reset migration state if it exists
DELETE FROM "_prisma_migrations"
WHERE migration_name = '20250520190000_reset_migration_state'
  AND finished_at IS NULL;