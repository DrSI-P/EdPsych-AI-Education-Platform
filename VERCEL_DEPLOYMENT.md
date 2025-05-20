# Vercel Deployment Configuration

This document outlines the Vercel deployment configuration for the EdPsych-AI-Education-Platform.

## Overview

The platform is configured for optimal deployment on Vercel with automated database migrations, environment validation, performance optimizations, monitoring, and integration with Vercel's advanced services.

## Vercel Services Integration

The platform integrates with the following Vercel services:

### 1. Vercel Analytics
- Real-time user analytics and insights
- Configured in `src/app/analytics.js`
- Automatically tracks page views, navigation, and user interactions

### 2. Vercel Speed Insights
- Performance monitoring and optimization
- Configured in `src/app/speed-insights.js`
- Tracks Core Web Vitals and user experience metrics

### 3. Vercel Edge Config
- Feature flags and remote configuration
- Configured in `src/lib/edge-config.ts`
- Sample configuration in `edge-config.json`

### 4. Vercel KV
- Redis-compatible key-value storage
- Configured in `src/lib/kv-storage.ts`
- Used for caching, session storage, and rate limiting

### 5. Vercel Blob
- File storage solution
- Configured in `src/lib/blob-storage.ts`
- Used for storing user uploads, educational resources, and media

## Custom Domains Configuration

The platform is configured to use the following custom domains:

```json
"domains": [
  "edpsychconnect.com",
  "www.edpsychconnect.com",
  "app.edpsychconnect.com"
]
```

A redirect is configured to ensure that www.edpsychconnect.com redirects to the apex domain:

```json
"redirects": [
  {
    "source": "www.edpsychconnect.com",
    "destination": "https://edpsychconnect.com",
    "permanent": true
  }
]
```

## Deployment Protection

The platform is configured with deployment protection to restrict access to both production and preview environments:

```json
"protection": {
  "production": {
    "enabled": true,
    "accessRules": [
      {
        "type": "email",
        "value": "*@edpsychconnect.com"
      },
      {
        "type": "team",
        "teamId": "team_edpsych"
      }
    ]
  },
  "preview": {
    "enabled": true,
    "accessRules": [
      {
        "type": "email",
        "value": "*@edpsychconnect.com"
      },
      {
        "type": "team",
        "teamId": "team_edpsych"
      }
    ]
  }
}
```

This ensures that only authorized users with edpsychconnect.com email addresses or members of the specified team can access the deployed environments.

## Configuration Files

- **vercel.json**: Main configuration file for Vercel deployment
- **next.config.js**: Next.js configuration with Vercel-specific optimizations
- **.env.example**: Template for environment variables needed for deployment
- **scripts/validate-env.js**: Script to validate environment variables before deployment
- **.github/workflows/ci.yml**: GitHub Actions workflow for CI/CD

## Key Features

### 1. Automated Database Migrations

The platform automatically runs Prisma migrations during deployment to ensure the database schema is up-to-date:

```json
"buildCommand": "node scripts/validate-env.js && npx prisma migrate deploy && npm run build"
```

See [PRISMA_DEPLOYMENT.md](./PRISMA_DEPLOYMENT.md) for more details on database configuration.

### 2. Environment Variable Validation

Environment variables are validated before deployment to prevent deploying with missing configuration:

- **Pre-build validation**: The `scripts/validate-env.js` script runs before the build process
- **Runtime validation**: The `src/lib/env-validation.ts` module provides typed access to environment variables

### 3. Serverless Function Configuration

AI and speech recognition API routes are configured with increased memory and execution time:

```json
"functions": {
  "src/app/api/ai/*/route.ts": {
    "memory": 1024,
    "maxDuration": 60
  },
  "src/app/api/speech-recognition/*/route.ts": {
    "memory": 1024,
    "maxDuration": 60
  }
}
```

### 4. Caching and Performance

The platform includes optimized caching configurations:

- **Static assets**: Cache static assets for 1 year with immutable cache control
- **API responses**: Cache API responses for curriculum and resources for 1 hour
- **Image optimization**: Configured with optimal device sizes and formats

### 5. Automated Database Maintenance

A daily cron job runs at midnight UTC to perform database maintenance tasks:

```json
"crons": [
  {
    "path": "/api/cron/db-maintenance",
    "schedule": "0 0 * * *"
  }
]
```

### 6. Rate Limiting

API routes are protected with rate limiting to prevent abuse:

- **Standard routes**: 100 requests per minute
- **AI routes**: 20 requests per minute
- **Authentication routes**: 10 requests per minute

## Deployment Environments

### Production Environment

- **URL**: https://edpsych-ai-education-platform.vercel.app
- **Branch**: main
- **Environment Variables**: See `.env.example` for required variables

### Preview Environment

- **URL**: https://preview.edpsych-ai-education-platform.vercel.app
- **Branch**: Any branch with a pull request
- **Environment Variables**: Same as production, but can use a separate database

## Monitoring and Logging

- **Cron Job Monitoring**: Available in the Vercel dashboard under "Settings" > "Cron Jobs"
- **Function Execution**: Available in the Vercel dashboard under "Functions"
- **Deployment Logs**: Available in the Vercel dashboard under "Deployments"

## CI/CD Pipeline

The GitHub Actions workflow in `.github/workflows/ci.yml` provides:

1. **Linting and Testing**: Runs on all pushes and pull requests
2. **Building**: Builds the application on the main branch
3. **Preview Deployment**: Deploys to a preview environment for pull requests
4. **Production Deployment**: Deploys to production when merged to main

## Troubleshooting

If you encounter deployment issues:

1. Check the Vercel deployment logs for errors
2. Verify all required environment variables are set
3. Ensure the database is accessible from Vercel
4. Check that Prisma migrations are running successfully

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/solutions/nextjs)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)