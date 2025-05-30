-- 7. Configure Row-Level Security (RLS)
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