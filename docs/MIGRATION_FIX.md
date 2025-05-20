# Prisma Migration Fix Documentation

## Issue

The project was experiencing build failures on Vercel due to a failed Prisma migration: `20250520130900_add_plugin_credential_model`. When a Prisma migration fails, the migration system enters a locked state where it refuses to apply any new migrations until the failed migration is resolved.

The error message from the Vercel build log was:

```
Error: P3009
migrate found failed migrations in the target database, new migrations will not be applied. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve
The `20250520130900_add_plugin_credential_model` migration started at 2025-05-20 20:25:02.605329 UTC failed
```

## Migration History

Several attempts were made to fix this issue:

1. `20250520130900_add_plugin_credential_model`: The original migration that failed
2. `20250520160000_create_accessibility_log`: A migration to create the AccessibilityLog table
3. `20250520180000_combined_plugin_credential_and_accessibility_log`: A combined migration for both tables
4. `20250520190000_reset_migration_state`: An attempt to reset the migration state
5. `20250520200000_reset_failed_migrations`: Another attempt to reset failed migrations
6. `20250521000000_fix_plugin_credential_migration`: The final fix migration

## Solution

The solution involved a two-part approach:

1. **Direct Database Fix**: Created a script (`scripts/apply-fix-migration.js`) that applies the fix migration SQL directly to the database, bypassing Prisma's migration system. This script:
   - Connects directly to the PostgreSQL database
   - Executes the SQL from the fix migration file
   - Cleans up the failed migration records
   - Ensures the required tables exist with the correct structure
   - Marks the previously failed migrations as completed

2. **Build Process Update**: Modified the Vercel build command to run this fix script before running Prisma's migration deploy command.

## Implementation Details

1. Created a new script: `scripts/apply-fix-migration.js`
2. Added new npm scripts to package.json:
   - `fix:migrations`: Runs the fix script
   - `prisma:fix-and-deploy`: Runs the fix script and then runs Prisma's migration deploy
3. Updated the Vercel build command in vercel.json to use the new `prisma:fix-and-deploy` script

## Preventing Future Issues

To prevent similar issues in the future:

1. Always use `IF NOT EXISTS` clauses in your migration SQL when creating tables, indexes, and constraints
2. Use proper error handling in your migrations with `DO` blocks and exception handling
3. Test migrations locally before deploying to production
4. Consider using Prisma's shadow database feature for safer migrations
5. Implement a staging environment that mirrors production for testing migrations

## References

- [Prisma Migration Troubleshooting Guide](https://www.prisma.io/docs/guides/migrate/troubleshooting-migrations)
- [Resolving Failed Migrations in Production](https://pris.ly/d/migrate-resolve)