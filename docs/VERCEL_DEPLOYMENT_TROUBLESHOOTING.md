# Vercel Deployment Troubleshooting Guide

This document provides a comprehensive guide for troubleshooting deployment failures on Vercel for the EdPsych-AI-Education-Platform.

## Common Deployment Issues

### 1. Build Failures

#### Symptoms
- Build fails during the deployment process
- Error messages in Vercel deployment logs related to build commands

#### Potential Causes and Solutions

**Node.js Version Incompatibility**
- **Issue**: The Node.js version specified in the project is incompatible with dependencies
- **Solution**: Update the Node.js version in the `package.json` engines field:
  ```json
  "engines": {
    "node": ">=16.x"
  }
  ```

**Dependency Installation Failures**
- **Issue**: Package installation fails during build
- **Solution**: 
  - Check for conflicting dependencies in `package.json`
  - Ensure all dependencies are compatible with each other
  - Try using `npm ci` instead of `npm install` in the build command

**Build Script Errors**
- **Issue**: The build script in `package.json` fails
- **Solution**:
  - Test the build locally with `npm run build`
  - Check for TypeScript errors or ESLint issues
  - Ensure all required environment variables are set in Vercel

### 2. Environment Variable Issues

#### Symptoms
- Application builds but crashes at runtime
- References to undefined environment variables in logs

#### Potential Causes and Solutions

**Missing Environment Variables**
- **Issue**: Required environment variables not set in Vercel
- **Solution**: 
  - Add all required environment variables in the Vercel dashboard
  - Ensure environment variable names match exactly between code and Vercel dashboard

**Environment Variable Scope**
- **Issue**: Environment variables not available in the correct scope
- **Solution**:
  - Prefix client-side variables with `NEXT_PUBLIC_`
  - Ensure server-side variables are properly accessed in API routes

### 3. API Route Failures

#### Symptoms
- API routes return 500 errors
- Server-side functionality fails

#### Potential Causes and Solutions

**API Route Structure**
- **Issue**: API routes not structured correctly for Vercel
- **Solution**:
  - Ensure API routes follow Next.js conventions
  - Check that API routes are in the correct directory structure

**Serverless Function Limitations**
- **Issue**: API routes exceed Vercel serverless function limits
- **Solution**:
  - Optimise code to reduce bundle size
  - Split complex functions into smaller functions
  - Check for memory leaks or excessive resource usage

### 4. Static Asset Issues

#### Symptoms
- Missing images or other static assets
- 404 errors for static files

#### Potential Causes and Solutions

**Asset Path Configuration**
- **Issue**: Incorrect paths to static assets
- **Solution**:
  - Use relative paths or the `public` directory for static assets
  - Ensure assets are included in the build process

**Large Asset Files**
- **Issue**: Asset files exceed size limits
- **Solution**:
  - Optimise images and other large assets
  - Consider using external storage for very large files

## Vercel-Specific Troubleshooting

### Checking Deployment Logs

1. Go to the Vercel dashboard
2. Select your project
3. Click on the deployment that failed
4. Click "View Build Logs" to see detailed error information

### Debugging with Development Deployments

1. Create a branch for testing deployment fixes
2. Push changes to this branch
3. Vercel will create a preview deployment
4. Test fixes in the preview environment before merging to main

### Verifying Project Configuration

Ensure your `vercel.json` file is correctly configured:

```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}
```

### Testing Locally with Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel login` to authenticate
3. Run `vercel` in your project directory to test deployment locally
4. Check for any issues reported by the CLI

## Step-by-Step Deployment Verification

1. **Verify package.json**
   - Check build scripts
   - Ensure all dependencies are listed correctly
   - Verify engines field if specified

2. **Check Next.js Configuration**
   - Review `next.config.js` for any issues
   - Ensure configuration is compatible with Vercel

3. **Test Build Locally**
   - Run `npm run build` locally
   - Fix any errors that occur during local build

4. **Review Environment Variables**
   - Compare local `.env` with Vercel environment variables
   - Ensure all required variables are set in Vercel

5. **Examine API Routes**
   - Test API routes locally
   - Check for any serverless function limitations

6. **Simplify for Testing**
   - Create a simplified version of the application
   - Deploy the simplified version to isolate issues

## Getting Help

If you continue to experience deployment issues after following this guide:

1. Contact Vercel support with specific error logs
2. Check the Vercel status page for any ongoing service issues
3. Search the Vercel documentation and forums for similar issues
4. Consider posting on Stack Overflow with the `vercel` and `next.js` tags

## Recommended Configuration for EdPsych-AI-Education-Platform

Based on the current project structure, we recommend the following configuration:

1. **Simplified vercel.json**:
```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}
```

2. **Required Environment Variables**:
- `NEXT_PUBLIC_BASE_URL`
- Any API keys or secrets needed for third-party services

3. **Build Optimization**:
- Consider using `next build && next export` for static site generation if possible
- Implement code splitting to reduce initial load time
- Optimise image assets using Next.js Image component

4. **Incremental Deployment**:
- Deploy a minimal version first
- Gradually add features to identify problematic components
