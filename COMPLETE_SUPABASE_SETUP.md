# Complete Supabase Setup Guide for EdPsych Connect Platform

This guide provides step-by-step instructions to complete the Supabase configuration for the EdPsych Connect Platform.

## Prerequisites

- Access to the Supabase project dashboard (https://app.supabase.com)
- Admin privileges for the Supabase project

## Step 1: Create a New Supabase Project

Our tests indicate that the Supabase project reference "refespeumjnuldqlxhcs" in the .env.production file cannot be resolved. This suggests that the project may no longer exist or the reference is incorrect.

You'll need to create a new Supabase project:

1. Log in to your Supabase dashboard at [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Enter "EdPsych-Connect-Platform" as the project name
4. Choose a strong database password
5. Select a region close to your users
6. Click "Create new project"

Once the project is created, note down:
- The project URL (e.g., https://your-new-project-ref.supabase.co)
- The anon key (found in Project Settings > API)

## Step 2: Update Environment Variables

Update the `.env.production` file with the new Supabase project details:

```bash
cd EdPsych-AI-Education-Platform/supabase-tools
npm run update-env -- "https://your-new-project-ref.supabase.co" "your-anon-key"
```

Replace "your-new-project-ref" with your actual Supabase project reference and "your-anon-key" with your actual Supabase anon key.

This will update:
- DATABASE_URL pointing to the new Supabase project
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Step 3: Create Required Tables

The profiles table has already been created using the User Management Starter template. You need to create the following additional tables:

### Option A: Using the Automated Setup Script

The easiest way to complete the setup is to use the automated setup script:

1. Navigate to the supabase-tools directory:
   ```bash
   cd EdPsych-AI-Education-Platform/supabase-tools
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the setup script:
   ```bash
   npm run setup -- "https://your-new-project-ref.supabase.co" "your-anon-key"
   ```
   Replace "your-anon-key" with your actual Supabase anon key.

This script will:
- Create all required tables
- Configure RLS policies
- Insert seed data
- Create storage buckets

After running the script, skip to Step 7 to configure Authentication Settings.

### Option B: Using the Manual Setup Guide (Recommended)

If you encounter issues with the automated setup script, you can follow the manual setup process:

1. Follow the step-by-step instructions in the `MANUAL_SUPABASE_SETUP.md` file
2. Execute the SQL statements manually in the Supabase SQL Editor
3. Create the storage buckets manually in the Supabase dashboard
4. Configure Authentication settings manually
5. Update API Settings manually

After completing the manual setup, verify the configuration using the manual verification script:

```bash
cd EdPsych-AI-Education-Platform/supabase-tools
npm run manual-verify -- "https://your-new-project-ref.supabase.co" "your-anon-key"
```

The manual setup process is more reliable but requires more manual steps.

### Option C: Using Table Editor

1. Navigate to Table Editor in Supabase
2. Create each table with the following structure:

#### avatar_videos Table
```
id: UUID (Primary Key, Default: uuid_generate_v4())
created_at: TIMESTAMP WITH TIME ZONE (Default: NOW())
updated_at: TIMESTAMP WITH TIME ZONE (Default: NOW())
title: TEXT (NOT NULL)
description: TEXT
video_url: TEXT (NOT NULL)
thumbnail_url: TEXT
category: TEXT
tags: TEXT[]
```

#### user_progress Table
```
id: UUID (Primary Key, Default: uuid_generate_v4())
user_id: UUID (NOT NULL, References: public.users.id ON DELETE CASCADE)
created_at: TIMESTAMP WITH TIME ZONE (Default: NOW())
updated_at: TIMESTAMP WITH TIME ZONE (Default: NOW())
video_id: UUID (References: public.avatar_videos.id ON DELETE CASCADE)
progress_percent: INTEGER (Default: 0)
completed: BOOLEAN (Default: FALSE)
last_watched_at: TIMESTAMP WITH TIME ZONE
```

#### achievements Table
```
id: UUID (Primary Key, Default: uuid_generate_v4())
user_id: UUID (NOT NULL, References: public.users.id ON DELETE CASCADE)
created_at: TIMESTAMP WITH TIME ZONE (Default: NOW())
updated_at: TIMESTAMP WITH TIME ZONE (Default: NOW())
achievement_type: TEXT (NOT NULL)
achievement_data: JSONB
unlocked_at: TIMESTAMP WITH TIME ZONE (Default: NOW())
```

### Option D: Using SQL Editor

1. Navigate to SQL Editor in Supabase
2. Execute the following SQL statements one by one:

```sql
-- Create the avatar_videos table
CREATE TABLE public.avatar_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  tags TEXT[]
);

-- Create the user_progress table
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  video_id UUID REFERENCES public.avatar_videos(id) ON DELETE CASCADE,
  progress_percent INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_watched_at TIMESTAMP WITH TIME ZONE
);

-- Create the achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  achievement_type TEXT NOT NULL,
  achievement_data JSONB,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 4: Configure Row-Level Security (RLS)

1. Navigate to Authentication > Policies in Supabase
2. Enable RLS on all tables
3. Create the following policies:

#### For avatar_videos Table
```sql
-- Avatar videos are viewable by all authenticated users
CREATE POLICY "Avatar videos are viewable by all users" 
ON public.avatar_videos FOR SELECT 
TO authenticated 
USING (true);
```

#### For users Table
```sql
-- Users can only view and update their own data
CREATE POLICY "Users can view their own data" 
ON public.users FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
ON public.users FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);
```

#### For user_progress Table
```sql
-- User progress policies
CREATE POLICY "Users can view their own progress" 
ON public.user_progress FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.user_progress FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON public.user_progress FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);
```

#### For achievements Table
```sql
-- Achievement policies
CREATE POLICY "Users can view their own achievements" 
ON public.achievements FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);
```

## Step 5: Insert Seed Data

Execute the following SQL in the SQL Editor:

```sql
-- Insert sample users
INSERT INTO public.users (id, email, user_role, display_name, avatar_url)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@edpsychconnect.com', 'admin', 'Admin User', 'https://example.com/avatars/admin.png'),
  ('00000000-0000-0000-0000-000000000002', 'teacher@edpsychconnect.com', 'teacher', 'Teacher User', 'https://example.com/avatars/teacher.png'),
  ('00000000-0000-0000-0000-000000000003', 'student@edpsychconnect.com', 'student', 'Student User', 'https://example.com/avatars/student.png');

-- Insert sample avatar videos
INSERT INTO public.avatar_videos (id, title, description, video_url, thumbnail_url, category, tags)
VALUES 
  ('00000000-0000-0000-0000-000000000101', 'Introduction to Educational Psychology', 'An overview of educational psychology concepts', 'https://example.com/videos/intro.mp4', 'https://example.com/thumbnails/intro.jpg', 'Introduction', ARRAY['intro', 'overview']),
  ('00000000-0000-0000-0000-000000000102', 'Learning Theories', 'Exploration of different learning theories', 'https://example.com/videos/theories.mp4', 'https://example.com/thumbnails/theories.jpg', 'Theory', ARRAY['theory', 'learning']),
  ('00000000-0000-0000-0000-000000000103', 'Classroom Management', 'Techniques for effective classroom management', 'https://example.com/videos/classroom.mp4', 'https://example.com/thumbnails/classroom.jpg', 'Practice', ARRAY['classroom', 'management']);

-- Insert sample user progress
INSERT INTO public.user_progress (user_id, video_id, progress_percent, completed, last_watched_at)
VALUES 
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000101', 100, TRUE, NOW() - INTERVAL '7 days'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000102', 50, FALSE, NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000101', 100, TRUE, NOW() - INTERVAL '14 days');

-- Insert sample achievements
INSERT INTO public.achievements (user_id, achievement_type, achievement_data)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'video_completion', '{"video_id": "00000000-0000-0000-0000-000000000101", "title": "First Video Completed"}'),
  ('00000000-0000-0000-0000-000000000002', 'video_completion', '{"video_id": "00000000-0000-0000-0000-000000000101", "title": "First Video Completed"}');
```

## Step 6: Set Up Storage Buckets

1. Navigate to Storage in Supabase
2. Create the following buckets:
   - `avatars` (for user profile images)
   - `video-thumbnails` (for video thumbnail images)
   - `public-assets` (for public assets)
3. Configure appropriate bucket policies:
   - For `avatars` and `video-thumbnails`: Restrict access to authenticated users
   - For `public-assets`: Allow public access

## Step 7: Configure Authentication Settings

1. Go to Authentication > Settings
2. Set Site URL to your production URL (e.g., https://edpsychconnect.com)
3. Enable Email provider
4. Configure any additional authentication providers as needed

## Step 8: Update API Settings

1. Go to Settings > API
2. Set JWT expiry time to an appropriate value (e.g., 3600 seconds)

## Step 9: Verify Configuration

Run the verification script to ensure everything is set up correctly:

```bash
cd EdPsych-AI-Education-Platform/supabase-tools
npm run manual-verify -- "https://your-new-project-ref.supabase.co" "your-anon-key"
```

Replace "your-new-project-ref" with your actual Supabase project reference and "your-anon-key" with your actual Supabase anon key.

This script will check if:
- All required tables exist
- Seed data has been properly inserted
- Storage buckets have been created

## Troubleshooting

### SQL Execution Issues
- Try executing smaller portions of the script
- Check for syntax errors
- Ensure the uuid-ossp extension is properly installed
- Verify that you have the necessary permissions

### Authentication Issues
- Check that the Site URL is correctly configured
- Verify that the Email provider is enabled

### Storage Issues
- Ensure bucket policies are correctly set
- Verify that the buckets have been created with the correct names

### Automated Setup Script Issues
- Make sure you have installed all dependencies with `npm install`
- Verify that you're using the correct Supabase URL and anon key
- Check if the Supabase REST API is accessible from your network
- If SQL execution fails, try running the SQL statements manually in the Supabase SQL Editor
- For storage bucket creation issues, try creating the buckets manually in the Supabase dashboard
- If you encounter errors with the REST API, try using the manual setup methods (Options B or C)