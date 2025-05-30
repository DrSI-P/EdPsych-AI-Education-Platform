# Manual Supabase Setup Guide for EdPsych Connect Platform

This guide provides step-by-step instructions for manually setting up the Supabase configuration for the EdPsych Connect Platform.

## Prerequisites

- Access to the Supabase project dashboard (https://app.supabase.com)
- Admin privileges for the Supabase project

## Step 0: Create a New Supabase Project

Our tests indicate that the Supabase project reference "refespeumjnuldqlxhcs" in the .env.production file cannot be resolved. This suggests that the project may no longer exist or the reference is incorrect.

You'll need to create a new Supabase project:

1. Log in to your Supabase dashboard at [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Enter "EdPsych-Connect-Platform" as the project name
4. Choose a strong database password
5. Select a region close to your users
6. Click "Create new project"

Once the project is created, you'll need to update the .env.production file with the new project reference:

```bash
cd EdPsych-AI-Education-Platform/supabase-tools
npm run update-env -- "https://your-new-project-ref.supabase.co" "your-anon-key"
```

Replace "your-new-project-ref" with your actual Supabase project reference and "your-anon-key" with your actual Supabase anon key.

## Step 1: Verify Connectivity

After creating a new project and updating the .env.production file, verify that you can connect to the Supabase project:

```bash
cd EdPsych-AI-Education-Platform/supabase-tools
npm run check-connection -- "https://your-new-project-ref.supabase.co"
```

If the connection is successful, you should see:
```
✅ Connection successful!
Status: 200 OK
```

If the connection fails, you may need to:
1. Check that the Supabase project reference is correct
2. Verify your network connectivity
3. Ensure the Supabase project exists and is accessible

## Step 2: Create Required Tables

1. Log in to your Supabase dashboard at [app.supabase.com](https://app.supabase.com)
2. Select the EdPsych Connect project (Project Reference: your-new-project-ref)
3. Go to the SQL Editor in the left sidebar
4. Execute the following SQL statements one by one:

```sql
-- Create the users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_role TEXT DEFAULT 'student',
  display_name TEXT,
  avatar_url TEXT
);

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

## Step 3: Configure Row-Level Security (RLS)

1. Execute the following SQL statements to enable RLS on all tables:

```sql
-- Enable RLS on tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatar_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
```

2. Execute the following SQL statements to create RLS policies:

```sql
-- Avatar videos are viewable by all authenticated users
CREATE POLICY "Avatar videos are viewable by all users" 
ON public.avatar_videos FOR SELECT 
TO authenticated 
USING (true);

-- Users can only view and update their own data
CREATE POLICY "Users can view their own data" 
ON public.users FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
ON public.users FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

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

-- Achievement policies
CREATE POLICY "Users can view their own achievements" 
ON public.achievements FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);
```

## Step 4: Insert Seed Data

Execute the following SQL statements to insert seed data:

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

## Step 5: Set Up Storage Buckets

1. Navigate to Storage in the Supabase dashboard
2. Create the following buckets:
   - `avatars` (for user profile images)
   - `video-thumbnails` (for video thumbnail images)
   - `public-assets` (for public assets)
3. Configure appropriate bucket policies:
   - For `avatars` and `video-thumbnails`: Restrict access to authenticated users
   - For `public-assets`: Allow public access

## Step 6: Configure Authentication Settings

1. Go to Authentication > Settings in the Supabase dashboard
2. Set Site URL to your production URL: `https://edpsychconnect.com`
3. Enable Email provider
4. Configure any additional authentication providers as needed

## Step 7: Update API Settings

1. Go to Settings > API in the Supabase dashboard
2. Set JWT expiry time to an appropriate value (e.g., 3600 seconds)

## Step 8: Verify Configuration

After completing all the steps above, run the manual verification script to ensure everything is set up correctly:

```bash
cd EdPsych-AI-Education-Platform/supabase-tools
npm run manual-verify -- "https://your-new-project-ref.supabase.co" "your-anon-key"
```

Replace "your-anon-key" with your actual Supabase anon key.

This script will check:
- If all required tables exist
- If seed data has been properly inserted
- If storage buckets have been created
- Remind you to verify authentication settings manually

## Troubleshooting

### Common Issues

1. **SQL Syntax Errors**
   - Make sure you're using the SQL Editor in the Supabase dashboard
   - Check for any special characters or formatting issues in the SQL script
   - Ensure that each statement ends with a semicolon (;)

2. **uuid_generate_v4() Function Not Available**
   - If you encounter an error about uuid_generate_v4() not being available, run:
     ```sql
     CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
     ```
   - Then try creating the tables again

3. **Foreign Key Constraints**
   - Make sure you create the tables in the correct order (users, avatar_videos, user_progress, achievements)
   - Ensure that referenced tables exist before creating tables with foreign key constraints

4. **Authentication Configuration Issues**
   - Ensure the Site URL is correctly set to https://edpsychconnect.com
   - Check that Email authentication is enabled

5. **Storage Bucket Permission Issues**
   - Verify that the bucket policies are correctly set
   - Test uploads and downloads to ensure permissions are working