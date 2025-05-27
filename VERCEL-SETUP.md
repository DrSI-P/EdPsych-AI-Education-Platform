# Vercel Project Setup Guide for EdPsych Connect

This guide provides step-by-step instructions for setting up the EdPsych Connect project on Vercel, including configuring environment variables, deployment settings, and connecting to the GitHub repository.

## Prerequisites

Before setting up the Vercel project, ensure you have:

1. A GitHub account with access to the EdPsych Connect repository
2. A Vercel account (you can sign up at https://vercel.com)
3. Access to the Supabase database credentials

## Step 1: Create a New Vercel Project

1. Log in to your Vercel account at https://vercel.com
2. Click on "Add New..." and select "Project"
3. Connect your GitHub account if you haven't already
4. Select the EdPsych Connect repository from the list
5. If the repository isn't visible, you may need to configure the Vercel GitHub integration to include it

## Step 2: Configure Project Settings

### Basic Settings

1. **Project Name**: Enter "edpsych-connect" or your preferred name
2. **Framework Preset**: Select "Next.js"
3. **Root Directory**: Leave as default (should be "/")
4. **Build Command**: Override with `npm run vercel-build`
5. **Output Directory**: Leave as default (should be ".next")
6. **Install Command**: Leave as default (should be `npm install`)

### Environment Variables

Add the following environment variables:

1. **DATABASE_URL**:
   - Value: `postgresql://postgres:Kanopatrick1@db.wxwcvqnbjorztzjwfi.supabase.co:5432/postgres?sslmode=require`
   - Note: Replace with your actual Supabase connection string if different

2. **NEXTAUTH_URL**:
   - Value: `https://edpsychconnect.com`
   - Note: This should match your production domain

3. **NEXTAUTH_SECRET**:
   - Value: `your-secure-secret-key`
   - Note: Replace with a secure random string (you can generate one with `openssl rand -base64 32`)

4. **NODE_ENV**:
   - Value: `production`

5. Any other environment variables required by your application

### Advanced Settings

1. **Development Command**: `npm run dev`
2. **Install Command**: `npm install`

## Step 3: Configure Domain Settings

1. Go to the "Settings" tab of your Vercel project
2. Click on "Domains"
3. Add your domain: `edpsychconnect.com`
4. Follow Vercel's instructions to verify domain ownership and configure DNS settings

## Step 4: Configure Git Integration

1. Go to the "Settings" tab of your Vercel project
2. Click on "Git"
3. Under "Production Branch", select "complete-rebuild"
4. Configure automatic deployments:
   - Enable "Deploy on Push"
   - Enable "Deploy on Pull Request"

## Step 5: Configure Build & Development Settings

1. Go to the "Settings" tab of your Vercel project
2. Click on "Build & Development Settings"
3. Set the following:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
   - **Development Command**: `npm run dev`

## Step 6: Initial Deployment

1. Go to the "Deployments" tab of your Vercel project
2. Click on "Deploy" to trigger a manual deployment
3. Monitor the deployment logs for any errors
4. Once deployment is complete, click on the deployment URL to verify that the application is working correctly

## Troubleshooting Vercel Deployments

If you encounter issues during deployment, check the following:

### Build Failures

1. Check the build logs for specific error messages
2. Verify that all environment variables are correctly set
3. Ensure that the build command is correctly configured
4. Check that the Prisma schema is valid and the database is accessible

### Runtime Errors

1. Check the Function Logs in the Vercel dashboard
2. Verify that the application is correctly configured for production
3. Ensure that all required environment variables are set
4. Check that the database connection is working correctly

### Domain Configuration Issues

1. Verify that the domain is correctly configured in Vercel
2. Check that the DNS settings are correctly configured
3. Ensure that the SSL certificate is valid and properly configured

## Vercel CLI

You can also use the Vercel CLI for more advanced deployment options:

1. Install the Vercel CLI: `npm install -g vercel`
2. Log in to your Vercel account: `vercel login`
3. Deploy the project: `vercel --prod`

## Monitoring and Analytics

Vercel provides built-in monitoring and analytics:

1. Go to the "Analytics" tab of your Vercel project to view performance metrics
2. Go to the "Logs" tab to view function logs and error messages
3. Consider setting up additional monitoring tools like Sentry for more comprehensive error tracking

## Scaling and Performance

Vercel automatically scales your application based on traffic. However, you can optimize performance by:

1. Implementing caching strategies
2. Optimizing database queries
3. Using Vercel's Edge Network for global distribution
4. Implementing serverless functions for specific tasks

## Security Considerations

1. Ensure that all environment variables containing sensitive information are properly secured
2. Regularly rotate secrets and API keys
3. Implement proper authentication and authorization
4. Configure CORS settings appropriately
5. Enable rate limiting for API endpoints

## Backup and Recovery

1. Regularly backup your database
2. Document the deployment process for disaster recovery
3. Consider setting up a staging environment for testing changes before deploying to production