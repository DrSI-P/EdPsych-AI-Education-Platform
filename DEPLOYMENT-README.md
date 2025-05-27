# EdPsych Connect Deployment Guide

This document outlines the deployment process for the EdPsych Connect platform to Vercel, including the changes made to fix deployment issues.

## Overview

The EdPsych Connect platform is a Next.js application that uses Prisma ORM to interact with a PostgreSQL database hosted on Supabase. The application is deployed to Vercel for hosting.

## Deployment Solution

We've implemented several changes to ensure smooth deployment to Vercel:

### 1. Prisma Client Configuration

We've created a dedicated Prisma client initialization file that follows Vercel's best practices for handling Prisma in a serverless environment:

- `prisma/client.ts`: Initializes the Prisma client with proper caching for serverless environments
- `src/lib/prisma-client.ts`: Re-exports the Prisma client for easier imports throughout the application

This approach prevents multiple Prisma Client instances from being created during hot reloads in development and ensures proper connection pooling in production.

### 2. Build Process Optimization

We've enhanced the build process with:

- `vercel-build.js`: A custom build script that handles Prisma generation and Next.js build with improved error handling and logging
- Updated `package.json` scripts to use our custom build script
- Added a `postinstall` script to ensure Prisma client is generated after dependencies are installed

### 3. Environment Configuration

We've set up proper environment configuration:

- `.env.production`: Contains all necessary environment variables for production deployment
- Configured Vercel environment variables to match our `.env.production` file

### 4. Deployment Scripts

We've created deployment scripts to simplify the deployment process:

- `deploy-to-vercel.sh`: Bash script for Unix-based systems (macOS, Linux)
- `deploy-to-vercel.bat`: Batch script for Windows systems

These scripts help push changes to GitHub and trigger a new deployment on Vercel.

### 5. Troubleshooting Guide

We've created a comprehensive troubleshooting guide:

- `DEPLOYMENT-TROUBLESHOOTING.md`: Provides solutions for common deployment issues

## Deployment Process

To deploy the EdPsych Connect platform to Vercel:

1. Ensure all changes are committed to the "complete-rebuild" branch
2. Run the appropriate deployment script for your operating system:
   - Windows: `deploy-to-vercel.bat`
   - macOS/Linux: `./deploy-to-vercel.sh`
3. The script will push your changes to GitHub and trigger a new deployment on Vercel
4. Monitor the deployment progress on the Vercel dashboard
5. Once deployment is complete, verify that the application is working correctly at https://edpsychconnect.com

## Environment Variables

The following environment variables must be set in Vercel:

- `DATABASE_URL`: The connection string for the PostgreSQL database
- `NEXTAUTH_URL`: The URL of the deployed application (https://edpsychconnect.com)
- `NEXTAUTH_SECRET`: A secret key for NextAuth.js

## Vercel Configuration

The following Vercel-specific configuration has been added:

- `.vercelignore`: Excludes node_modules from being uploaded to Vercel
- Custom build command in Vercel project settings: `npm run vercel-build`

## Troubleshooting

If you encounter issues during deployment, refer to the `DEPLOYMENT-TROUBLESHOOTING.md` file for detailed troubleshooting steps.

## Key Files

- `prisma/client.ts`: Prisma client initialization
- `src/lib/prisma-client.ts`: Prisma client re-export
- `vercel-build.js`: Custom build script
- `.env.production`: Production environment variables
- `deploy-to-vercel.sh`: Unix deployment script
- `deploy-to-vercel.bat`: Windows deployment script
- `DEPLOYMENT-TROUBLESHOOTING.md`: Troubleshooting guide

## Future Improvements

- Set up continuous integration with GitHub Actions
- Implement automated testing before deployment
- Add monitoring and alerting for production issues
- Create staging environment for pre-production testing