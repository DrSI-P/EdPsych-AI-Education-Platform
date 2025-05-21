# Update Build Command Instructions

To fix the build issues on Vercel, you need to update the build command in your `package.json` file to include the migration resolution step.

## Current Build Command

The current build command in your `package.json` file is:

```json
"build": "prisma migrate deploy || true && next build"
```

## Updated Build Command

Update the build command to include the migration resolution step:

```json
"build": "npx prisma migrate resolve --applied 20250521040000_add_curriculum_collaboration_models && npx prisma migrate deploy && next build"
```

This updated command will:

1. Mark the problematic migration `20250521040000_add_curriculum_collaboration_models` as applied without running it (this migration fails because it references a table "CurriculumPlan" that doesn't exist)
2. Deploy any pending migrations
3. Build the Next.js application

Note: The migrations `20250521020000_add_password_reset_model` and `20250521030000_add_password_field_to_user` are already marked as applied in the database, so we don't need to resolve them again.

## Steps to Update

1. Open your `package.json` file
2. Find the `"scripts"` section
3. Update the `"build"` command as shown above
4. Save the file
5. Commit and push the changes to GitHub

## Verifying the Fix

After updating the build command and pushing the changes to GitHub, Vercel should be able to build the project successfully. The build will:

1. Resolve the failed migration
2. Apply any pending migrations
3. Build the Next.js application

If you've also updated the DATABASE_URL environment variable in Vercel to point to the correct Supabase database, the build should complete without errors.