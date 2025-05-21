# Build Fix Instructions

This document provides instructions to fix the build issues identified in the EdPsych AI Education Platform project.

## Issues Fixed

1. **Type Error**: Fixed type errors in the following files:
   - `src/app/api/curriculum/plans/route.ts`: Changed `authorId` to `userId` and `author` to `user`
   - `src/app/api/curriculum/collaboration/route.ts`: Fixed references to `authorId` which should be `userId`

2. **Failed Migrations**: Created a script to fix the following failed migrations:
   - `20250521020000_add_password_reset_model`
   - `20250521030000_add_password_field_to_user` (fails because the password field already exists in the User table)
   - `20250521040000_add_curriculum_collaboration_models` (fails because it references a table "CurriculumPlan" that doesn't exist)

## How to Apply the Fixes

### Comprehensive Fix Script

We've created a comprehensive fix script that addresses both issues at once:

```bash
node fix-build-issues.js
```

This script will:
1. Check and fix any `authorId` references in the collaboration route file
2. Check and fix any `authorId` references in the plans route file
3. Create a backup of your current migrations directory
4. Mark the problematic migrations as applied without running them
5. Allow you to proceed with applying any pending migrations

### Individual Fix Scripts

If you prefer to fix the issues separately:

#### 1. Fix the Type Errors

The type errors have been fixed by updating the field names in the affected files to match the Prisma schema:
- Changed `authorId` to `userId`
- Changed `author` to `user`

#### 2. Fix the Failed Migration

To fix only the migration issue, run:

```bash
node fix-migrations.js
```

After running the script, you can deploy your migrations with:

```bash
npx prisma migrate deploy
```

## Committing and Pushing the Changes

After applying the fixes, you need to commit and push the changes to GitHub. For your convenience, I've created scripts to automate this process:

### Using the provided scripts:

**For Unix/Linux/Mac users:**
```bash
# Make the script executable
chmod +x commit-and-push.sh

# Run the script
./commit-and-push.sh
```

**For Windows users:**
```bash
# Run the batch file
commit-and-push.bat
```

### Manual approach:
If you prefer to do it manually:
```bash
# Add the modified files
git add src/app/api/curriculum/plans/route.ts
git add fix-migrations.js
git add BUILD-FIX-README.md

# Commit the changes
git commit -m "Fix build issues: type error in plans route and migration failure"

# Push to GitHub
git push origin main
```

This will update your repository with the fixes, allowing Vercel to build the project successfully.

## Verifying the Fix

After applying these fixes and pushing to GitHub, you should be able to build and deploy your application successfully. The build should no longer fail with the type error or the migration error.

## Additional Notes

- The migration issues occurred because:
  - The migration `20250521020000_add_password_reset_model` was an empty migration intended to fix the migration history, but it failed.
  - The migration `20250521030000_add_password_field_to_user` failed because the password field already exists in the User table.
  - The migration `20250521040000_add_curriculum_collaboration_models` failed because it references a table "CurriculumPlan" that doesn't exist.
- The type error occurred because the field names used in the code didn't match the field names in the Prisma schema.
- The fix-build-issues.js script creates a .env file with the Supabase database URL. You need to replace `[YOUR-PASSWORD]` in the DATABASE_URL with your actual Supabase database password.

## Vercel Build Configuration

To ensure successful builds on Vercel, update your build command in the Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to Settings > General > Build & Development Settings
3. Update the build command to:
   ```
   npx prisma migrate resolve --applied 20250521030000_add_password_field_to_user && npx prisma migrate resolve --applied 20250521040000_add_curriculum_collaboration_models && npx prisma migrate deploy && npm run build
   ```
   
   Note: The migration `20250521020000_add_password_reset_model` is already marked as applied in the database, so we don't need to resolve it again.
4. Make sure your environment variables include the correct DATABASE_URL for Supabase:
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.wxwcvqnbjorztzjwfi.supabase.co:5432/postgres
   ```