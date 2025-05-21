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