# Supabase Configuration Reset Guide for EdPsych Connect Platform

This guide provides step-by-step instructions for resetting and configuring your Supabase database for the EdPsych Connect Platform.

## Tools Directory

All the tools mentioned in this guide are available in the `supabase-tools` directory:

```
EdPsych-AI-Education-Platform/supabase-tools/
├── README.md                       # Overview and quick reference
├── package.json                    # Dependencies and npm scripts
├── supabase_reset.sql              # Complete SQL script for database reset
├── 1_drop_tables.sql               # Script to drop existing tables
├── 2_create_extensions_schemas.sql # Script to create extensions and schemas
├── 3_create_users_table.sql        # Script to create users table
├── 4_create_avatar_videos_table.sql # Script to create avatar_videos table
├── 5_create_user_progress_table.sql # Script to create user_progress table
├── 6_create_achievements_table.sql  # Script to create achievements table
├── 7_configure_rls.sql             # Script to configure row-level security
├── 8_insert_seed_data.sql          # Script to insert seed data
├── update_supabase_env.js          # Script to update environment variables
└── verify_supabase_reset.js        # Script to verify configuration
```

For quick setup instructions, refer to the README.md file in the supabase-tools directory.

## Prerequisites

- Access to your Supabase project dashboard
- Admin credentials for your Supabase project

## Steps to Reset and Configure Supabase

### 1. Backup Current Database (Optional Safety Measure)

Before proceeding with the reset, it's recommended to create a backup of your current database:

1. Log in to your Supabase dashboard at [app.supabase.com](https://app.supabase.com)
2. Select the EdPsych Connect project
3. Go to Project Settings (gear icon in the left sidebar)
4. Navigate to Database
5. Scroll down to find the "Database Backups" section
6. Click "Create a new backup" or download any existing recent backup

### 2. Access the SQL Editor

1. From your Supabase project dashboard, click on "SQL Editor" in the left sidebar
2. Create a new query or use an existing one

### 3. Execute the Reset Script

#### Option 1: Execute the entire script at once

1. Open the `supabase-tools/supabase_reset.sql` file from this repository
2. Copy the entire contents of the file
3. Paste the contents into the SQL Editor in Supabase
4. Click "Run" to execute the script

#### Option 2: Execute the script in smaller chunks (recommended)

If you encounter errors when executing the entire script at once, we've provided separate SQL files for each section that you can execute individually:

1. Navigate to the `supabase-tools` directory in the repository
2. Execute each of the following files in order:

   a. `1_drop_tables.sql` - Drops existing tables
   b. `2_create_extensions_schemas.sql` - Creates the uuid-ossp extension and schemas
   c. `3_create_users_table.sql` - Creates the users table
   d. `4_create_avatar_videos_table.sql` - Creates the avatar_videos table
   e. `5_create_user_progress_table.sql` - Creates the user_progress table
   f. `6_create_achievements_table.sql` - Creates the achievements table
   g. `7_configure_rls.sql` - Configures row-level security
   h. `8_insert_seed_data.sql` - Inserts seed data

To execute each file:
1. Open the SQL Editor in the Supabase dashboard
2. Open the file from the repository
3. Copy the contents of the file
4. Paste the contents into the SQL Editor
5. Click "Run" to execute the script
6. Verify that the script executed successfully before proceeding to the next file

This approach helps avoid syntax errors and makes it easier to identify and fix any issues that may arise during the reset process.

The script will:
- Drop existing tables (if they exist)
- Create the auth and public schemas
- Create the required tables (users, avatar_videos, user_progress, achievements)
- Configure row-level security policies
- Insert initial seed data for avatar videos

### 4. Verify Database Reset and Configuration

After running the script, verify that the database has been properly reset and configured:

1. Go to the "Table Editor" in the left sidebar
2. You should see the following tables:
   - users
   - avatar_videos
   - user_progress
   - achievements
3. Click on the "avatar_videos" table to verify that the seed data has been inserted (18 records)

### 5. Configure Authentication

1. Go to "Authentication" in the left sidebar
2. Click on "Settings"
3. Configure the following settings:
   - Site URL: https://edpsychconnect.com
   - Enable Email authentication
   - Set any additional auth providers as needed

### 6. Set Up Storage Buckets

1. Go to "Storage" in the left sidebar
2. Create the following buckets:
   - avatars (for user profile images)
   - video-thumbnails (for avatar video thumbnails)
   - public-assets (for general public assets)
3. Set appropriate bucket policies:
   - For avatars: Authenticated users can read, only owner can write
   - For video-thumbnails: Public read, authenticated write
   - For public-assets: Public read, authenticated write

### 7. Update API Settings

1. Go to Project Settings > API
2. Ensure JWT expiry is set to an appropriate value (e.g., 3600 seconds)
3. Copy the API URL and anon/service keys for use in your application

### 8. Update Application Environment Variables

Update your application's environment variables to point to the new Supabase instance. You can do this manually or use the provided script:

#### Option 1: Manual Update
Edit your environment files (.env, .env.local, .env.production, etc.) to update the Supabase URL and anon key:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### Option 2: Using the Update Script
We've provided a script to automatically update your environment variables:

1. Navigate to the supabase-tools directory in the terminal:
   ```bash
   cd supabase-tools
   ```

2. Install dependencies if you haven't already:
   ```bash
   npm install
   ```

3. Run the script with your Supabase URL and anon key:
   ```bash
   npm run update-env -- "https://your-project-ref.supabase.co" "your-anon-key"
   ```

   Or run the script directly:
   ```bash
   node update_supabase_env.js "https://your-project-ref.supabase.co" "your-anon-key"
   ```

The script will:
- Update Supabase URL and anon key in all .env files
- Update the DATABASE_URL in .env.production with the correct project reference

## Troubleshooting

If you encounter any issues during the reset process:

- Check the error messages in the SQL Editor for specific issues
- Ensure you have the necessary permissions to execute the script
- If specific commands fail, you can try executing them individually

## Verification

### Verify Database Reset and Configuration

You can verify that the database has been properly reset and configured using the provided verification script:

1. Navigate to the supabase-tools directory if you're not already there:
   ```bash
   cd supabase-tools
   ```

2. Install dependencies if you haven't already:
   ```bash
   npm install
   ```

3. Run the verification script with your Supabase URL and anon key:
   ```bash
   npm run verify -- "https://your-project-ref.supabase.co" "your-anon-key"
   ```

   Or run the script directly:
   ```bash
   node verify_supabase_reset.js "https://your-project-ref.supabase.co" "your-anon-key"
   ```

The script will:
- Check if all required tables exist
- Verify that seed data has been inserted into the avatar_videos table
- Check if the required storage buckets exist

If any issues are found, the script will provide specific error messages to help you troubleshoot.

### Manual Verification

You can also manually verify the reset and configuration:

1. Test the database connection from your application
2. Create a test user through the Supabase Authentication UI
3. Verify that the user appears in the users table
4. Test basic CRUD operations through the Supabase UI
5. Verify that row-level security policies are working correctly
6. Test storage bucket access with appropriate permissions

## Files Included in This Solution

- `supabase-tools/supabase_reset.sql`: Complete SQL script to reset and configure the Supabase database
- `supabase-tools/1_drop_tables.sql`: Script to drop existing tables
- `supabase-tools/2_create_extensions_schemas.sql`: Script to create extensions and schemas
- `supabase-tools/3_create_users_table.sql`: Script to create users table
- `supabase-tools/4_create_avatar_videos_table.sql`: Script to create avatar_videos table
- `supabase-tools/5_create_user_progress_table.sql`: Script to create user_progress table
- `supabase-tools/6_create_achievements_table.sql`: Script to create achievements table
- `supabase-tools/7_configure_rls.sql`: Script to configure row-level security
- `supabase-tools/8_insert_seed_data.sql`: Script to insert seed data
- `supabase_reset_guide.md`: This guide document
- `supabase-tools/update_supabase_env.js`: Script to update environment variables with new Supabase credentials
- `supabase-tools/verify_supabase_reset.js`: Script to verify the database reset and configuration
- `supabase-tools/package.json`: NPM package configuration for dependencies and scripts
- `supabase-tools/README.md`: Quick reference guide for the tools

## Completion Checklist

- [ ] Database has been reset
- [ ] Schema and tables have been created
- [ ] Row-level security policies have been configured
- [ ] Initial seed data has been inserted
- [ ] Authentication has been configured
- [ ] Storage buckets have been set up
- [ ] Application environment variables have been updated
- [ ] Verification script has been run successfully
- [ ] Database connection has been tested from the application

## Troubleshooting

### Common Issues

1. **SQL Syntax Errors**
   - Make sure you're using the SQL Editor in the Supabase dashboard
   - Try executing the script in smaller chunks as described in Option 2 above
   - Check for any special characters or formatting issues in the SQL script
   - Ensure that each statement ends with a semicolon (;)

2. **"id" Syntax Error**
   - If you encounter an error like "syntax error at or near 'id'", try:
     - Ensuring there are no invisible characters before "id"
     - Manually typing the table creation statements instead of copy-pasting
     - Using double quotes around column names: "id" instead of id

3. **uuid_generate_v4() Function Not Available**
   - If you encounter an error about uuid_generate_v4() not being available, run:
     ```sql
     CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
     ```
   - Then try creating the tables again

4. **Missing Tables After Reset**
   - Check the SQL Editor output for any error messages
   - Verify that you have the necessary permissions to create tables
   - Try refreshing the Table Editor view to see the new tables

5. **Authentication Configuration Issues**
   - Ensure the Site URL is correctly set to https://edpsychconnect.com
   - Check that Email authentication is enabled

6. **Storage Bucket Permission Issues**
   - Verify that the bucket policies are correctly set
   - Test uploads and downloads to ensure permissions are working

7. **Environment Variable Updates Not Taking Effect**
   - Restart your application after updating environment variables
   - Check that the variables are correctly formatted in your .env files