@echo off
REM Script to commit changes and deploy to Vercel

echo === EdPsych Connect Deployment Script ===
echo This script will commit your changes and prepare for Vercel deployment
echo.

REM Step 1: Add all changes to git
echo Step 1: Adding changes to git...
git add .
if %ERRORLEVEL% neq 0 (
  echo Error: Failed to add files to git
  exit /b 1
)
echo Changes added successfully
echo.

REM Step 2: Commit changes
echo Step 2: Committing changes...
git commit -m "Fix: Enhanced Prisma client initialization and build process for Vercel deployment"
if %ERRORLEVEL% neq 0 (
  echo Error: Failed to commit changes
  exit /b 1
)
echo Changes committed successfully
echo.

REM Step 3: Push to GitHub
echo Step 3: Pushing to GitHub (clean-unified-branch branch)...
git push origin clean-unified-branch
if %ERRORLEVEL% neq 0 (
  echo Error: Failed to push to GitHub
  echo You may need to pull changes first or force push:
  echo git pull origin clean-unified-branch --rebase
  echo or
  echo git push origin clean-unified-branch --force
  exit /b 1
)
echo Changes pushed to GitHub successfully
echo.

REM Step 4: Instructions for Vercel deployment
echo === Next Steps for Vercel Deployment ===
echo 1. Go to the Vercel dashboard: https://vercel.com/dashboard
echo 2. Select your project: EdPsych-AI-Education-Platform
echo 3. Click on 'Deployments' tab
echo 4. Click 'Create New Deployment'
echo 5. Select the 'clean-unified-branch' branch
echo 6. Verify environment variables match .env.production
echo 7. Click 'Deploy'
echo.

echo === Environment Variables Checklist ===
echo Ensure these environment variables are set in Vercel:
echo DATABASE_URL="postgresql://postgres:Kanopatrick1@db.wxwcvqnbjorztzjwfi.supabase.co:5432/postgres?sslmode=require"
echo NEXTAUTH_URL="https://edpsychconnect.com"
echo NEXTAUTH_SECRET="your-secure-secret-key"
echo MAINTENANCE_MODE="false"
echo NODE_ENV="production"
echo SKIP_PRISMA_MIGRATIONS="false"
echo SKIP_DB_CONNECT="false"
echo NEXT_PUBLIC_SKIP_DB_INIT="false"
echo NEXT_SKIP_STATIC_GENERATION="true"
echo NEXT_TELEMETRY_DISABLED="1"
echo NEXT_PUBLIC_SITE_URL="https://edpsychconnect.com"
echo.

echo === Troubleshooting ===
echo If deployment fails, check:
echo 1. Vercel build logs for specific error messages
echo 2. Ensure DATABASE_URL is correctly set and accessible
echo 3. Verify Prisma client generation in the build logs
echo 4. Check for any syntax errors in the updated files
echo.

echo === After Successful Deployment ===
echo Verify:
echo 1. Blog pages load correctly at https://edpsychconnect.com/blog
echo 2. Database operations work as expected
echo 3. No runtime errors in the browser console
echo.

echo Deployment preparation completed!
pause