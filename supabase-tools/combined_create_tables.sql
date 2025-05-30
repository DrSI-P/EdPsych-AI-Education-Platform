-- Combined script for creating all tables with simplified syntax

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

-- Configure Row-Level Security (RLS)
-- Enable RLS on tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatar_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
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