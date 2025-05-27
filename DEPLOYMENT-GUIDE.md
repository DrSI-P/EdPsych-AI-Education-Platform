# EdPsych Connect Deployment Guide

This guide provides comprehensive instructions for deploying the EdPsych Connect platform to Vercel, ensuring that it displays correctly on edpsychconnect.com.

## Deployment Solution Overview

We've implemented a robust deployment solution that addresses several key areas:

1. **Prisma Client Configuration**: Properly initialized Prisma client for serverless environments
2. **Build Process Optimization**: Enhanced build scripts with improved error handling
3. **Environment Configuration**: Proper environment variable setup for production
4. **Error Handling**: Custom error pages and graceful error handling
5. **SEO Optimization**: Sitemap generation and robots.txt configuration
6. **Deployment Verification**: Scripts to verify successful deployment

## Pre-Deployment Checklist

Before deploying, ensure that:

- [ ] All code changes are committed to the "complete-rebuild" branch
- [ ] All environment variables are properly configured in `.env.production`
- [ ] The Prisma schema is valid and up-to-date
- [ ] All dependencies are installed and up-to-date
- [ ] The application builds successfully locally

## Deployment Process

### 1. Prepare for Deployment

Run the environment check to ensure all required environment variables are set:

```bash
npm run check-env
```

Generate the sitemap to ensure search engines can properly index the site:

```bash
npm run generate-sitemap
```

### 2. Deploy to Vercel

#### Option 1: Using Deployment Scripts

For Windows:

```bash
deploy-to-vercel.bat
```

For macOS/Linux:

```bash
./deploy-to-vercel.sh
```

These scripts will:
- Commit your changes
- Push to the "complete-rebuild" branch on GitHub
- Trigger a new deployment on Vercel

#### Option 2: Manual Deployment

1. Commit your changes:

```bash
git add .
git commit -m "Deployment: Fix Prisma client initialization for Vercel"
git push origin complete-rebuild
```

2. Go to the Vercel dashboard: https://vercel.com/dashboard
3. Select your project
4. Click on "Deployments" tab
5. Click "Create New Deployment"
6. Select the "complete-rebuild" branch
7. Verify environment variables match `.env.production`
8. Click "Deploy"

### 3. Verify Deployment

After deployment completes, verify that the platform is displaying correctly:

```bash
npm run verify-deployment
```

This script will check critical pages and ensure they contain the expected content.

## Environment Variables

The following environment variables must be set in Vercel:

```
DATABASE_URL="postgresql://postgres:Kanopatrick1@db.wxwcvqnbjorztzjwfi.supabase.co:5432/postgres?sslmode=require"
NEXTAUTH_URL="https://edpsychconnect.com"
NEXTAUTH_SECRET="your-secure-secret-key"
MAINTENANCE_MODE="false"
NODE_ENV="production"
SKIP_PRISMA_MIGRATIONS="false"
SKIP_DB_CONNECT="false"
NEXT_PUBLIC_SKIP_DB_INIT="false"
NEXT_SKIP_STATIC_GENERATION="true"
NEXT_TELEMETRY_DISABLED="1"
NEXT_PUBLIC_SITE_URL="https://edpsychconnect.com"
```

## Key Files and Components

### Prisma Client Configuration

- `prisma/client.ts`: Initializes the Prisma client with proper caching for serverless environments
- `src/lib/prisma-client.ts`: Re-exports the Prisma client for easier imports

### Build Process

- `vercel-build.js`: Custom build script with enhanced error handling and verification
- `package.json`: Contains scripts for building, deploying, and verifying

### Error Handling

- `src/pages/_error.tsx`: Custom error page for handling server errors
- `src/pages/404.tsx`: Custom 404 page for handling not found errors
- `src/pages/500.tsx`: Custom 500 page for handling server errors

### SEO Optimization

- `public/sitemap.xml`: XML sitemap for search engines
- `public/robots.txt`: Robots.txt file for controlling search engine crawling
- `scripts/generate-sitemap.js`: Script for generating the sitemap

### Deployment Verification

- `scripts/verify-deployment.js`: Script for verifying successful deployment
- `scripts/check-env.js`: Script for checking environment variables

## Troubleshooting

If you encounter issues during deployment, refer to the `DEPLOYMENT-TROUBLESHOOTING.md` file for detailed troubleshooting steps.

Common issues include:

1. **Prisma Client Generation Failure**:
   - Verify that the DATABASE_URL environment variable is correctly set
   - Check that the database is accessible from Vercel's deployment servers

2. **Next.js Build Failure**:
   - Check the build logs for specific errors
   - Verify that all imports are correct, especially the Prisma client imports

3. **Environment Variable Issues**:
   - Ensure all required environment variables are set in Vercel
   - Verify that the environment variables match those in `.env.production`

## Post-Deployment Tasks

After successful deployment:

1. Verify that all pages load correctly at https://edpsychconnect.com
2. Check that the blog pages load correctly at https://edpsychconnect.com/blog
3. Verify that database operations work as expected
4. Check for any runtime errors in the browser console
5. Test all critical user flows (authentication, content creation, etc.)

## Monitoring and Maintenance

To ensure the platform continues to display correctly:

1. Set up monitoring for critical pages and API endpoints
2. Regularly check the Vercel logs for any warnings or errors
3. Periodically regenerate the sitemap to include new content
4. Keep dependencies up-to-date to avoid security vulnerabilities

## Additional Resources

For more detailed information, refer to:

- `DEPLOYMENT-README.md`: Overview of the deployment process and changes
- `DEPLOYMENT-TROUBLESHOOTING.md`: Detailed troubleshooting guide
- `DEPLOYMENT-CHECKLIST.md`: Comprehensive verification checklist
- `DEPLOYMENT-FIXES.md`: Detailed explanation of the fixes implemented
- `VERCEL-SETUP.md`: Step-by-step guide for setting up the Vercel project
- `PRISMA-NEXTJS-BEST-PRACTICES.md`: Best practices for using Prisma with Next.js
- `NEXTJS-ENV-VARIABLES-GUIDE.md`: Guide to environment variables in Next.js
- `NEXTJS-SERVERLESS-FUNCTIONS-GUIDE.md`: Guide to serverless functions in Next.js