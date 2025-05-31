-- 3. Create user tables
CREATE TABLE public.users (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_role TEXT DEFAULT 'student',
  display_name TEXT,
  avatar_url TEXT
);