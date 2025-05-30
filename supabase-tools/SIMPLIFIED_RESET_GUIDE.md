# Simplified Supabase Reset Guide for EdPsych Connect Platform

This guide provides simplified instructions for resetting and configuring the Supabase database for the EdPsych Connect Platform.

## Prerequisites

- Access to the Supabase project dashboard
- Admin privileges for the Supabase project

## Step 1: Create a New Supabase Project (if needed)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Enter project details:
   - Name: "EdPsych-Connect-Platform"
   - Database Password: (create a secure password)
   - Region: (select appropriate region)
4. Click "Create new project"

## Step 2: Reset Database Schema

### Option 1: Using the SQL Editor

1. Navigate to the SQL Editor in your Supabase dashboard
2. Execute the following scripts in order:
   
   a. First, drop existing tables:
   ```sql
   -- From 1_drop_tables.sql
   DROP TABLE IF EXISTS public.achievements;
   DROP TABLE IF EXISTS public.user_progress;
   DROP TABLE IF EXISTS public.avatar_videos;
   DROP TABLE IF EXISTS public.users;
   ```

   b. Create extensions and schemas:
   ```sql
   -- From 2_create_extensions_schemas.sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE SCHEMA IF NOT EXISTS auth;
   CREATE SCHEMA IF NOT EXISTS public;
   ```

   c. Create all tables and configure RLS:
   - Copy the contents of `combined_create_tables.sql` and execute it in the SQL Editor
   
   d. Insert seed data:
   - Copy the contents of `simplified_seed_data.sql` and execute it in the SQL Editor

### Option 2: Using Individual Scripts

If you prefer to execute scripts individually, follow these steps:

1. Execute `1_drop_tables.sql`
2. Execute `2_create_extensions_schemas.sql`
3. Execute `combined_create_tables.sql`
4. Execute `simplified_seed_data.sql`

## Step 3: Configure Authentication Settings

1. Go to Authentication > Settings
2. Set Site URL to your production URL (e.g., https://edpsychconnect.com)
3. Enable Email provider
4. Configure any additional authentication providers as needed

## Step 4: Set Up Storage Buckets

1. Go to Storage
2. Create the following buckets:
   - `avatars` (for user profile images)
   - `video-thumbnails` (for video thumbnail images)
   - `public-assets` (for public assets)
3. Configure appropriate bucket policies

## Step 5: Update API Settings

1. Go to Settings > API
2. Set JWT expiry time to an appropriate value (e.g., 3600 seconds)

## Step 6: Update Environment Variables

1. Update your application's environment variables with the new Supabase credentials:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`

2. You can use the provided `update_supabase_env.js` script to update these variables:
   ```
   node supabase-tools/update_supabase_env.js
   ```

## Step 7: Verify Configuration

1. Run the verification script to ensure everything is set up correctly:
   ```
   node supabase-tools/verify_supabase_reset.js
   ```

## Troubleshooting

If you encounter issues with SQL execution:
- Try executing smaller portions of the script
- Check for syntax errors
- Ensure the uuid-ossp extension is properly installed
- Verify that you have the necessary permissions

For authentication issues:
- Check that the Site URL is correctly configured
- Verify that the Email provider is enabled

For storage issues:
- Ensure bucket policies are correctly set
- Verify that the buckets have been created with the correct names