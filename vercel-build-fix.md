# Vercel Build Fix Instructions

## Issue Identified
The build is failing due to a conflict between routing systems:

```
Conflicting app and page file was found, please remove the conflicting files to continue:
"pages/analytics.js" - "app/analytics/page.tsx"
```

## Root Cause Analysis
- The project appears to have files in both the `/pages` directory (Pages Router) and the `/app` directory (App Router)
- However, our local repository does not contain an `/app` directory
- This suggests the conflict is due to a stale build cache on Vercel

## Solution Steps

### 1. Clear Vercel Build Cache
1. Log into the Vercel dashboard
2. Navigate to the EdPsych project
3. Go to Settings > General
4. Scroll down to the "Build and Development Settings" section
5. Click on "Clear Build Cache"
6. Confirm the action

### 2. Force Clean Deployment
1. After clearing the cache, go to the "Deployments" tab
2. Click "Deploy" to trigger a new deployment
3. Select the "complete-rebuild" branch
4. Enable the "Force Clean Deployment" option if available
5. Start the deployment

### 3. Verify Build Success
1. Monitor the build logs to ensure no conflicts are reported
2. Check that all pages are accessible without 404 errors
3. Verify that client-side exceptions are resolved

## Additional Recommendations
- Consider standardizing on a single routing system (either Pages Router or App Router)
- Remove any references to the unused routing system in configuration files
- Update the deployment documentation to include cache clearing steps for future deployments
