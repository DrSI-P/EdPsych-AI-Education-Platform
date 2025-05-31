# Supabase Tools for EdPsych Connect Platform

This directory contains tools for resetting and configuring the Supabase database for the EdPsych Connect Platform.

## Overview

These tools help you:

1. Reset the Supabase database
2. Create the necessary schema and tables
3. Configure row-level security policies
4. Insert initial seed data
5. Update application environment variables
6. Verify the database configuration

## Files

- `supabase_reset.sql`: Complete SQL script to reset and configure the Supabase database
- `1_drop_tables.sql`: Script to drop existing tables
- `2_create_extensions_schemas.sql`: Script to create extensions and schemas
- `3_create_users_table.sql`: Script to create users table
- `4_create_avatar_videos_table.sql`: Script to create avatar_videos table
- `5_create_user_progress_table.sql`: Script to create user_progress table
- `6_create_achievements_table.sql`: Script to create achievements table
- `7_configure_rls.sql`: Script to configure row-level security
- `8_insert_seed_data.sql`: Script to insert seed data
- `update_supabase_env.js`: Script to update environment variables with new Supabase credentials
- `verify_supabase_reset.js`: Script to verify the database reset and configuration
- `setup_supabase.js`: Script to automate the Supabase setup process
- `combined_create_tables.sql`: Consolidated script for creating all tables
- `simplified_seed_data.sql`: Script for inserting basic seed data
- `package.json`: NPM package configuration for dependencies and scripts

## Installation

```bash
# Navigate to the supabase-tools directory
cd supabase-tools

# Install dependencies
npm install
```

## Usage

### 1. Reset and Configure Supabase Database

#### Option 1: Execute the entire script at once

1. Log in to your Supabase dashboard at [app.supabase.com](https://app.supabase.com)
2. Select the EdPsych Connect project
3. Go to the SQL Editor in the left sidebar
4. Open the `supabase_reset.sql` file from this directory
5. Copy the entire contents of the file
6. Paste the contents into the SQL Editor in Supabase
7. Click "Run" to execute the script

#### Option 2: Execute the script in smaller chunks (recommended)

If you encounter errors when executing the entire script at once, use the individual SQL files:

1. Log in to your Supabase dashboard at [app.supabase.com](https://app.supabase.com)
2. Select the EdPsych Connect project
3. Go to the SQL Editor in the left sidebar
4. Execute each of the following files in order:
   - `1_drop_tables.sql` - Drops existing tables
   - `2_create_extensions_schemas.sql` - Creates the uuid-ossp extension and schemas
   - `3_create_users_table.sql` - Creates the users table
   - `4_create_avatar_videos_table.sql` - Creates the avatar_videos table
   - `5_create_user_progress_table.sql` - Creates the user_progress table
   - `6_create_achievements_table.sql` - Creates the achievements table
   - `7_configure_rls.sql` - Configures row-level security
   - `8_insert_seed_data.sql` - Inserts seed data

For each file:
1. Open the file from this directory
2. Copy the contents of the file
3. Paste the contents into the SQL Editor
4. Click "Run" to execute the script
5. Verify that the script executed successfully before proceeding to the next file

#### Option 3: Use the Automated Setup Script

The `setup_supabase.js` script automates the entire setup process:

1. Creates all required tables
2. Configures RLS policies
3. Inserts seed data
4. Creates storage buckets

To use the automated setup script:

```bash
# Run the setup script with your Supabase URL and anon key
npm run setup -- "https://your-project-ref.supabase.co" "your-anon-key"
```

Or run the script directly:

```bash
node setup_supabase.js "https://your-project-ref.supabase.co" "your-anon-key"
```

This approach handles all the setup steps in the correct order and provides detailed feedback on each operation.

#### Option 4: Manual Setup (Recommended)

If you encounter issues with the automated setup script, you can follow the manual setup process:

1. Follow the step-by-step instructions in the `MANUAL_SUPABASE_SETUP.md` file in the parent directory
2. Execute the SQL statements manually in the Supabase SQL Editor
3. Create the storage buckets manually in the Supabase dashboard
4. Configure Authentication settings manually
5. Update API Settings manually

After completing the manual setup, verify the configuration using the manual verification script:

```bash
# Run the manual verification script with your Supabase URL and anon key
npm run manual-verify -- "https://your-project-ref.supabase.co" "your-anon-key"
```

Or run the script directly:

```bash
node manual_verify.js "https://your-project-ref.supabase.co" "your-anon-key"
```

The manual setup process is more reliable but requires more manual steps.

### 2. Update Environment Variables

After resetting the database, update your application's environment variables to point to the new Supabase instance:

```bash
# Run the update script with your Supabase URL and anon key
npm run update-env -- "https://your-project-ref.supabase.co" "your-anon-key"
```

Or run the script directly:

```bash
node update_supabase_env.js "https://your-project-ref.supabase.co" "your-anon-key"
```

### 3. Verify Database Configuration

Verify that the database has been properly reset and configured:

```bash
# Run the verification script with your Supabase URL and anon key
npm run verify -- "https://your-project-ref.supabase.co" "your-anon-key"
```

Or run the script directly:

```bash
node verify_supabase_reset.js "https://your-project-ref.supabase.co" "your-anon-key"
```

## Additional Configuration

### Authentication

1. Go to "Authentication" in the Supabase dashboard
2. Click on "Settings"
3. Configure the following settings:
   - Site URL: https://edpsychconnect.com
   - Enable Email authentication
   - Set any additional auth providers as needed

### Storage Buckets

1. Go to "Storage" in the Supabase dashboard
2. Create the following buckets:
   - avatars (for user profile images)
   - video-thumbnails (for avatar video thumbnails)
   - public-assets (for general public assets)
3. Set appropriate bucket policies:
   - For avatars: Authenticated users can read, only owner can write
   - For video-thumbnails: Public read, authenticated write
   - For public-assets: Public read, authenticated write

## Troubleshooting

### Common Issues

1. **SQL Syntax Errors**
   - Make sure you're using the SQL Editor in the Supabase dashboard
   - Try executing the script in smaller chunks using the individual SQL files
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

3. **Authentication Configuration Issues**
   - Ensure the Site URL is correctly set to https://edpsychconnect.com
   - Check that Email authentication is enabled

4. **Storage Bucket Permission Issues**
   - Verify that the bucket policies are correctly set
   - Test uploads and downloads to ensure permissions are working

5. **Environment Variable Updates Not Taking Effect**
   - Restart your application after updating environment variables
   - Check that the variables are correctly formatted in your .env files

6. **Issues with the Automated Setup Script**
   - Make sure you have installed all dependencies with `npm install`
   - Verify that you're using the correct Supabase URL and anon key
   - Check if the Supabase REST API is accessible from your network
   - If SQL execution fails, try running the SQL statements manually in the Supabase SQL Editor
   - For storage bucket creation issues, try creating the buckets manually in the Supabase dashboard

## Help

For more detailed instructions, refer to the `COMPLETE_SUPABASE_SETUP.md` file in the parent directory, which provides a comprehensive step-by-step guide for completing the Supabase configuration.