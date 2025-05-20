# Prisma Database Migration Setup

This document outlines how database migrations are configured to run automatically during Vercel deployments.

## Configuration

The project is set up to automatically run Prisma migrations during the Vercel build process. This is configured in two places:

1. **vercel.json**: The `buildCommand` includes `npx prisma migrate deploy` before running the build process.
2. **package.json**: Contains dedicated scripts for Prisma operations:
   - `npm run prisma:deploy` - Runs `prisma migrate deploy` to apply pending migrations
   - `npm run prisma:generate` - Runs `prisma generate` to generate the Prisma client

## Environment Variables

For the migrations to work properly, you must configure the following environment variable in your Vercel project:

- `DATABASE_URL`: The connection string to your PostgreSQL database

### Setting up Environment Variables in Vercel

1. Go to the Vercel dashboard: https://vercel.com/ed-psych-connect-limited/ed-psych-ai-education-platform
2. Navigate to "Settings" > "Environment Variables"
3. Add or verify the `DATABASE_URL` environment variable
4. Ensure the variable is available in the "Production" environment

## Manual Migration

If you need to run migrations manually, you can use the following command:

```bash
npx prisma migrate deploy
```

Or use the npm script:

```bash
npm run prisma:deploy
```

## Troubleshooting

If migrations fail during deployment:

1. Check the Vercel build logs for specific error messages
2. Verify that the `DATABASE_URL` is correctly configured
3. Ensure the database user has sufficient permissions to create/alter tables
4. Check if there are any conflicting migrations or schema issues

## Automated Database Maintenance

The project is configured with a daily cron job that performs database maintenance tasks. This helps keep the database clean and performant.

### Cron Job Configuration

- The cron job is configured in `vercel.json` to run daily at midnight (UTC)
- It calls the `/api/cron/db-maintenance` endpoint
- Current maintenance tasks include:
  - Cleaning up expired sessions
  - Removing expired verification tokens

### Monitoring Maintenance Jobs

You can monitor the execution of maintenance jobs in the Vercel dashboard:
1. Go to the Vercel dashboard: https://vercel.com/ed-psych-connect-limited/ed-psych-ai-education-platform
2. Navigate to "Settings" > "Cron Jobs"
3. Check the status and logs of the maintenance job

## Database Seeding

The project includes a database seeding mechanism for development and testing environments. This allows you to populate your database with initial data.

### Seed Configuration

- The seed script is located at `prisma/seed.ts`
- It's configured in package.json under the "prisma" section
- You can run it with `npm run prisma:seed`

### When to Use Seeding

- Development: To quickly set up a development environment with test data
- Testing: To ensure consistent test data for automated tests
- Initial Deployment: To populate a new environment with required initial data

> **Note**: Seeding is not automatically run during production deployments. It's primarily intended for development and testing.

## Connection Pooling

For better database performance in production, the project is configured to use connection pooling. This is especially important for serverless environments like Vercel.

### Connection Pool Configuration

- The connection pool configuration is in `prisma/connection-pool.ts`
- It implements a singleton pattern to prevent multiple Prisma Client instances
- It includes performance monitoring for slow queries

### Using with PgBouncer

If you're using PgBouncer for connection pooling, you'll need to add the following to your DATABASE_URL:

```
?pgbouncer=true&connection_limit=10&pool_timeout=20
```

## Additional Resources

- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Prisma Connection Management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Prisma with PgBouncer](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer)