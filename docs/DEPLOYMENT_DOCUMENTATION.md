# Deployment and DevOps Documentation

This document provides comprehensive documentation for the deployment and DevOps setup for the EdPsych-AI-Education-Platform.

## Overview

The EdPsych-AI-Education-Platform is deployed using Vercel for hosting and GitHub Actions for CI/CD automation. This setup provides a robust, scalable infrastructure with automated testing, building, and deployment processes.

## Deployment Architecture

### Environments

The platform uses two primary environments:

1. **Staging Environment**
   - Purpose: Testing and validation before production release
   - Triggered by: Pushes to the `development` branch or manual workflow dispatch
   - URL: https://staging.edpsychconnect.com

2. **Production Environment**
   - Purpose: Live environment for end users
   - Triggered by: Pushes to the `main` branch or manual workflow dispatch
   - URL: https://edpsychconnect.com

### Infrastructure Components

- **Hosting**: Vercel (Next.js optimized hosting)
- **CI/CD**: GitHub Actions
- **Database**: PostgreSQL (managed by Vercel or external provider)
- **Domain Management**: Custom domain (edpsychconnect.com)
- **SSL/TLS**: Automatically managed by Vercel
- **CDN**: Vercel Edge Network

## Deployment Configuration

### Vercel Configuration

The `vercel.json` file contains the core configuration for the Vercel deployment:

```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_BASE_URL": "https://edpsychconnect.com"
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1",
      "headers": {
        "cache-control": "s-maxage=0"
      }
    },
    {
      "src": "/(.*\\.(js|css|png|jpg|jpeg|svg|ico|webp|woff|woff2)$)",
      "dest": "/$1",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/$1",
      "headers": {
        "x-content-type-options": "nosniff",
        "x-frame-options": "DENY",
        "x-xss-protection": "1; mode=block"
      }
    }
  ],
  "regions": ["lhr1"],
  "github": {
    "silent": true,
    "autoJobCancelation": true
  }
}
```

Key aspects of this configuration:
- **Framework**: Configured for Next.js
- **Build Commands**: Standard Next.js build process
- **Environment Variables**: Base URL set for production
- **Routes**: Custom routing with security headers and caching rules
- **Regions**: Deployed to London region (lhr1) for UK-based users
- **GitHub Integration**: Configured for silent deployments and auto job cancelation

### CI/CD Pipeline

The CI/CD pipeline is implemented using GitHub Actions and defined in `.github/workflows/ci-cd.yml`. The workflow includes the following stages:

1. **Lint**: Code quality checks using ESLint
2. **Test**: Automated testing with Jest
3. **Build**: Application build process including Prisma client generation
4. **Deploy to Staging**: Deployment to the staging environment
5. **Deploy to Production**: Deployment to the production environment

The workflow is triggered by:
- Pushes to the `main` branch (production deployment)
- Pushes to the `development` branch (staging deployment)
- Manual workflow dispatch (with environment selection)

## Environment Variables

The following environment variables are required for deployment:

| Variable | Description | Required In |
|----------|-------------|-------------|
| `DATABASE_URL` | PostgreSQL connection string | All environments |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | All environments |
| `NEXTAUTH_URL` | URL for NextAuth.js callbacks | All environments |
| `OPENAI_API_KEY` | OpenAI API key | All environments |
| `ANTHROPIC_API_KEY` | Anthropic API key | All environments |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | All environments |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | All environments |
| `VEED_API_KEY` | VEED.IO API key for AI avatars | All environments |
| `SIMLI_API_KEY` | Simli API key for AI avatars | All environments |
| `ELEVENLABS_API_KEY` | ElevenLabs API key for AI avatars | All environments |
| `HEYGEN_API_KEY` | HeyGen API key for AI avatars | All environments |

These variables should be stored as GitHub Secrets and are automatically injected during the deployment process.

## Domain Configuration

The platform is configured to use the custom domain `edpsychconnect.com`. To set up the domain:

1. **DNS Configuration**:
   - Add an A record pointing to Vercel's load balancer
   - Add CNAME records for www and staging subdomains
   - Configure MX records if email services are needed

2. **Vercel Domain Settings**:
   - Add the domain in the Vercel project settings
   - Verify domain ownership
   - Configure SSL/TLS certificates (automatic with Vercel)

3. **Environment-Specific URLs**:
   - Production: https://edpsychconnect.com
   - Staging: https://staging.edpsychconnect.com

## Backup and Recovery

### Database Backup

Database backups are handled through:

1. **Automated Daily Backups**: Configured through the database provider
2. **Pre-Deployment Snapshots**: Created before each production deployment
3. **Manual Backup Script**: Available in `/scripts/backup.sh`

### Recovery Procedures

In case of deployment issues or data corruption:

1. **Rollback to Previous Deployment**:
   ```
   vercel rollback --token $VERCEL_TOKEN
   ```

2. **Database Restoration**:
   ```
   ./scripts/recovery.sh --backup-file=<backup_file> --environment=<environment>
   ```

3. **Emergency Contact**: Technical support available at support@edpsychconnect.com

## Monitoring and Maintenance

### Performance Monitoring

- **Vercel Analytics**: Real-time performance metrics
- **Error Tracking**: Integration with Sentry for error monitoring
- **Uptime Monitoring**: Regular health checks via GitHub Actions

### Security Monitoring

- **Dependency Scanning**: Automated vulnerability scanning
- **Security Headers**: Implemented via Vercel routing configuration
- **Authentication Monitoring**: Alerts for unusual login patterns

## Deployment Best Practices

1. **Testing Before Deployment**:
   - Always run the full test suite locally before pushing
   - Use the staging environment for final validation

2. **Environment Variable Management**:
   - Never commit sensitive information to the repository
   - Use GitHub Secrets for all sensitive values
   - Regularly rotate API keys and secrets

3. **Deployment Verification**:
   - Always verify deployments with manual testing
   - Check critical user flows after each deployment
   - Monitor error rates after deployment

4. **Rollback Readiness**:
   - Be prepared to quickly roll back problematic deployments
   - Document the rollback procedure for all team members

## Troubleshooting

### Common Issues and Solutions

1. **Build Failures**:
   - Check for TypeScript errors
   - Verify that all dependencies are correctly installed
   - Ensure environment variables are properly configured

2. **Deployment Timeouts**:
   - Check for long-running build steps
   - Optimize large dependencies or assets
   - Consider increasing build timeout in Vercel settings

3. **Database Connection Issues**:
   - Verify database connection string
   - Check network access rules
   - Ensure database service is running

4. **Authentication Problems**:
   - Verify NEXTAUTH_URL and NEXTAUTH_SECRET
   - Check OAuth provider configuration
   - Ensure callback URLs are correctly set

## Conclusion

This deployment and DevOps setup provides a robust, automated pipeline for the EdPsych-AI-Education-Platform. By leveraging Vercel for hosting and GitHub Actions for CI/CD, the platform benefits from modern cloud infrastructure with minimal operational overhead. The configuration supports both staging and production environments, ensuring thorough testing before changes reach end users.
