# Modified Supabase Scripts for EdPsych Connect Platform

This directory contains modified versions of the SQL scripts for resetting and configuring the Supabase database for the EdPsych Connect Platform. The modifications address the "id" syntax error issue mentioned in the troubleshooting section of the original README.

## Modifications Made

The main modification is the removal of double quotes around column names in all table creation scripts and RLS policies. This should help avoid syntax errors when executing the scripts in the Supabase SQL Editor.

Specifically:

1. Removed double quotes around `"id"` and `"user_id"` columns in all table creation scripts
2. Updated foreign key references to use `id` instead of `"id"`
3. Fixed the inconsistency in the user_progress table's UNIQUE constraint
4. Updated RLS policies to reference columns without quotes

## Files

- `modified_3_create_users_table.sql`: Modified script to create users table
- `modified_4_create_avatar_videos_table.sql`: Modified script to create avatar_videos table
- `modified_5_create_user_progress_table.sql`: Modified script to create user_progress table
- `modified_6_create_achievements_table.sql`: Modified script to create achievements table
- `modified_7_configure_rls.sql`: Modified script to configure row-level security
- `modified_supabase_reset.sql`: Complete modified SQL script to reset and configure the Supabase database

## Usage

### Option 1: Execute the entire modified script at once

1. Log in to your Supabase dashboard at [app.supabase.com](https://app.supabase.com)
2. Select the EdPsych Connect project
3. Go to the SQL Editor in the left sidebar
4. Open the `modified_supabase_reset.sql` file from this directory
5. Copy the entire contents of the file
6. Paste the contents into the SQL Editor in Supabase
7. Click "Run" to execute the script

### Option 2: Execute the modified scripts in smaller chunks

If you encounter errors when executing the entire script at once, use the individual modified SQL files:

1. Log in to your Supabase dashboard at [app.supabase.com](https://app.supabase.com)
2. Select the EdPsych Connect project
3. Go to the SQL Editor in the left sidebar
4. Execute each of the following files in order:
   - `1_drop_tables.sql` - Drops existing tables (use the original file)
   - `2_create_extensions_schemas.sql` - Creates the uuid-ossp extension and schemas (use the original file)
   - `modified_3_create_users_table.sql` - Creates the users table
   - `modified_4_create_avatar_videos_table.sql` - Creates the avatar_videos table
   - `modified_5_create_user_progress_table.sql` - Creates the user_progress table
   - `modified_6_create_achievements_table.sql` - Creates the achievements table
   - `modified_7_configure_rls.sql` - Configures row-level security
   - `8_insert_seed_data.sql` - Inserts seed data (use the original file)

For each file:
1. Open the file from this directory
2. Copy the contents of the file
3. Paste the contents into the SQL Editor
4. Click "Run" to execute the script
5. Verify that the script executed successfully before proceeding to the next file

## Additional Tips

1. If you still encounter syntax errors, try manually typing the statements in the SQL Editor instead of copy-pasting.
2. Make sure the uuid-ossp extension is created before creating the tables.
3. After executing the scripts, follow the remaining steps in the original README to configure Authentication, Storage Buckets, and update environment variables.