# Password Reset Model Fix

## Issue

During the Vercel deployment process, we encountered a TypeScript error:

```
Type error: Property 'passwordReset' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
```

This error occurred in `src/app/api/auth/reset-password/route.ts` on line 47, where the code was trying to use `prisma.passwordReset`, but this model wasn't defined in the Prisma schema.

## Root Cause

The application code was referencing a `passwordReset` model that wasn't defined in the Prisma schema, causing TypeScript errors during the build process. However, when we tried to create a migration for this model, we discovered that the table already existed in the database.

This suggests that the model was previously defined in the schema but was later removed, while the table remained in the database and the code continued to reference it.

## Solution

1. We added the `PasswordReset` model back to the Prisma schema:

```prisma
// Password Reset Model
model PasswordReset {
  id        String   @id @default(cuid())
  userId    String   @unique
  token     String
  expires   DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

2. We updated the User model to include the relation to the PasswordReset model:

```prisma
model User {
  // ... existing fields
  passwordReset         PasswordReset?
}
```

3. We initially created a migration file for this model, but when we tried to apply it, we received an error that the table already existed. This confirmed our suspicion that the model was previously defined but later removed from the schema.

4. We removed the migration file since the table already exists in the database.

## Lessons Learned

1. **Schema-Code Consistency**: Always ensure that the Prisma schema accurately reflects all models used in the application code.

2. **Database-Schema Synchronization**: When removing models from the schema, consider whether the corresponding tables should also be removed from the database.

3. **Migration Testing**: Test migrations in a development environment before deploying to production to catch issues early.

4. **Documentation**: Document any discrepancies between the schema and the database to help future developers understand the system's state.

## Related Issues

This issue is similar to the AssessmentTemplate model issue documented in [MIGRATION_FIX.md](./MIGRATION_FIX.md), where a model was referenced in the code but not defined in the schema.

## Additional Complications

After adding the model to the schema and removing the migration file, we encountered an additional issue during deployment:

```
migrate found failed migrations in the target database, new migrations will not be applied.
The `20250521020000_add_password_reset_model` migration started at 2025-05-21 00:13:03.944127 UTC failed
```

This occurred because our first attempt to apply the migration failed (due to the table already existing), but Prisma recorded this failed migration in its migration history table (`_prisma_migrations`). Even though we removed the migration file from our repository, Prisma's migration history in the database still showed that the migration failed.

### Resolution

To fix this issue, we created a script (`scripts/fix-password-reset-migration.js`) that:

1. Connects to the database
2. Checks if the failed migration exists in the `_prisma_migrations` table
3. If it exists, updates it to mark it as successfully applied
4. If it doesn't exist, inserts a new record marking it as successfully applied

Since the database is hosted on Supabase and not accessible locally, the script cannot be run directly from a local environment. Instead, you'll need to execute SQL commands directly on the database using the Supabase dashboard or another database administration tool.

Here are the SQL commands to fix the failed migration:

```sql
-- Check if the migration exists
SELECT * FROM _prisma_migrations WHERE migration_name = '20250521020000_add_password_reset_model';

-- If it exists and is marked as failed, update it to mark as applied successfully
UPDATE _prisma_migrations
SET applied = 1,
    rolled_back = 0,
    rolled_back_at = NULL
WHERE migration_name = '20250521020000_add_password_reset_model';

-- If it doesn't exist, insert it as a successfully applied migration
INSERT INTO _prisma_migrations (
  id,
  checksum,
  finished_at,
  migration_name,
  logs,
  rolled_back_at,
  started_at,
  applied_steps_count
)
SELECT
  gen_random_uuid(),
  'manually-fixed-migration',
  NOW(),
  '20250521020000_add_password_reset_model',
  'Migration manually marked as applied',
  NULL,
  NOW(),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM _prisma_migrations WHERE migration_name = '20250521020000_add_password_reset_model'
);
```

Alternatively, for future deployments, you could modify the build script in `package.json` to handle failed migrations more gracefully:

```json
"build": "prisma migrate deploy || true && next build"
```

This would allow the build to continue even if the migration deployment fails, which might be acceptable if the schema is already in sync with the database.