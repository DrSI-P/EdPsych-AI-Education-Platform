-- Simplified seed data script

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