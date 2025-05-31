-- 6. Create achievements table
CREATE TABLE public.achievements (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID REFERENCES public.users("id") ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);