-- 5. Create user_progress table
CREATE TABLE public.user_progress (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID REFERENCES public.users("id") ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  progress_percentage INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("user_id", content_id, content_type)
);