# Prisma Migration Best Practices

This document outlines best practices for working with Prisma migrations to prevent issues like the one we encountered with failed migrations.

## Common Migration Issues

1. **Failed migrations**: When a migration fails, Prisma's migration system enters a locked state where it refuses to apply any new migrations until the failed migration is resolved.
2. **Conflicts with existing database objects**: Migrations can fail if they try to create objects that already exist or modify objects that don't exist.
3. **Schema drift**: When the database schema doesn't match what Prisma expects, causing unexpected errors.

## Best Practices

### 1. Use Defensive SQL in Migrations

Always write defensive SQL that handles potential errors and edge cases:

```sql
-- Use IF NOT EXISTS when creating tables
CREATE TABLE IF NOT EXISTS "MyTable" (
  -- columns
);

-- Use DO blocks with exception handling for constraints and indexes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'my_constraint'
  ) THEN
    ALTER TABLE "MyTable" 
    ADD CONSTRAINT "my_constraint" 
    FOREIGN KEY ("columnId") REFERENCES "OtherTable"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END
$$;
```

### 2. Test Migrations Locally Before Deploying

Always test migrations in a local development environment before applying them to production:

```bash
# Generate a migration
npx prisma migrate dev --name my_migration

# Test the migration locally
npx prisma migrate reset --force
```

### 3. Use Shadow Database for Safer Migrations

Configure a shadow database in your Prisma schema to allow Prisma to verify migrations before applying them:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL") // Add this line
}
```

### 4. Implement a Staging Environment

Set up a staging environment that mirrors your production environment to test migrations before deploying to production.

### 5. Create Migration Scripts with Error Handling

For complex migrations, create custom migration scripts with proper error handling:

```javascript
// scripts/apply-migration.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Perform migration steps with error handling
    console.log('Starting migration...');
    
    // Example: Add a column if it doesn't exist
    await prisma.$executeRaw`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'my_table' AND column_name = 'new_column'
        ) THEN
          ALTER TABLE "my_table" ADD COLUMN "new_column" TEXT;
        END IF;
      END
      $$;
    `;
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

### 6. Backup Before Migrations

Always create a database backup before applying migrations to production:

```bash
# For PostgreSQL
pg_dump -U username -d database_name > backup.sql
```

### 7. Monitor Migration Logs

Keep track of migration logs to quickly identify and resolve issues:

```bash
# Run migrations with verbose logging
npx prisma migrate deploy --verbose
```

### 8. Use Transactions for Complex Migrations

Wrap complex migrations in transactions to ensure atomicity:

```sql
BEGIN;

-- Migration steps here

COMMIT;
```

### 9. Version Control Your Migrations

Always keep your migrations in version control and never modify existing migrations that have been applied to any environment.

### 10. Document Database Changes

Maintain documentation of significant database changes, especially those that might affect application behavior.

## Handling Failed Migrations

If a migration fails despite these precautions:

1. Identify the cause of the failure by checking the migration logs
2. Fix the issue in a new migration rather than modifying the failed one
3. Consider using direct database access to clean up failed migration records if necessary
4. Apply the fix migration using a custom script that bypasses Prisma's migration system if needed

## Conclusion

Following these best practices will help prevent migration issues and make them easier to resolve when they do occur. Remember that database migrations are critical operations that should be approached with caution and thorough testing.