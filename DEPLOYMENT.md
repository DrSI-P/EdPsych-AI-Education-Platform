# EdPsych-AI-Education-Platform Deployment Guide

This document provides instructions for deploying the EdPsych-AI-Education-Platform to Vercel.

## Deployment Steps

1. Push your changes to the GitHub repository
2. Log in to Vercel and connect to your GitHub repository
3. Configure the build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build` (migrations are skipped during build)
   - Output Directory: `.next`
   - Install Command: `npm install`

4. Add the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - Any other required environment variables for your application

5. Click "Deploy" to start the deployment process

## Post-Deployment Database Migration

Since migrations are skipped during the build process to avoid errors, you'll need to run migrations manually after deployment:

### Option 1: Run migrations locally against the production database

```bash
# Update your local .env file with the production DATABASE_URL
# Then run:
npm run fix-migrations
npx prisma migrate deploy
```

### Option 2: Use Vercel CLI to run migrations

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Run migrations on the production environment
vercel run npm run fix-migrations
vercel run npx prisma migrate deploy
```

## Known Issues and Workarounds

### Migration Issues

The project has some migration conflicts that were causing build failures:

1. **Missing migration.sql files**: Some migrations were looking for migration.sql files that didn't exist
2. **Column already exists errors**: Some migrations were trying to add columns that already existed
3. **Constraint conflicts**: Some migrations were trying to add constraints with different behaviors

These issues have been addressed by:

1. Creating a `fix-failed-migration.js` script that marks problematic migrations as applied
2. Modifying migration files to handle cases where columns already exist
3. Updating the build process to skip migrations during deployment

### TypeScript Errors

TypeScript errors in the accessibility-controls.tsx file have been fixed by:

1. Removing console.log statements
2. Fixing class names from "toggle" to "checkbox"
3. Fixing Alert component usage

## Reverting to Build with Migrations

If you want to run migrations during the build process, you can use:

```bash
npm run build-with-migrations
```

This will run the fix-failed-migration.js script, apply migrations, and then build the application.