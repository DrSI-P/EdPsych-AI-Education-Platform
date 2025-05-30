-- 8. Insert initial seed data for Avatar Videos
INSERT INTO public.avatar_videos (title, description, video_url, thumbnail_url, duration, category, tags)
VALUES
  ('Platform Welcome - First-Time User', 'Executive Summary video introducing the platform', '/assets/videos/platform_welcome.mp4', '/assets/thumbnails/platform_welcome.jpg', 240, 'Onboarding', ARRAY['welcome', 'introduction']),
  ('Student Dashboard Introduction', 'Guide to using the student dashboard', '/assets/videos/student_dashboard.mp4', '/assets/thumbnails/student_dashboard.jpg', 180, 'Onboarding', ARRAY['student', 'dashboard']),
  ('Educator Dashboard Introduction', 'Guide to using the educator dashboard', '/assets/videos/educator_dashboard.mp4', '/assets/thumbnails/educator_dashboard.jpg', 210, 'Onboarding', ARRAY['educator', 'dashboard']),
  ('Curriculum Navigation Guide', 'How to navigate the curriculum', '/assets/videos/curriculum_navigation.mp4', '/assets/thumbnails/curriculum_navigation.jpg', 150, 'Navigation', ARRAY['curriculum', 'navigation']),
  ('Progress Tracking Feature Introduction', 'Guide to tracking progress', '/assets/videos/progress_tracking.mp4', '/assets/thumbnails/progress_tracking.jpg', 120, 'Features', ARRAY['progress', 'tracking']),
  ('Accessibility Features Introduction', 'Overview of accessibility features', '/assets/videos/accessibility_features.mp4', '/assets/thumbnails/accessibility_features.jpg', 180, 'Accessibility', ARRAY['accessibility']),
  ('Voice Input Feature Introduction', 'How to use voice input', '/assets/videos/voice_input.mp4', '/assets/thumbnails/voice_input.jpg', 150, 'Features', ARRAY['voice', 'input']),
  ('AI Video Creation Tool Introduction', 'Guide to creating AI videos', '/assets/videos/ai_video_creation.mp4', '/assets/thumbnails/ai_video_creation.jpg', 240, 'Features', ARRAY['ai', 'video', 'creation']),
  ('Collaborative Learning Space Introduction', 'Guide to collaborative learning', '/assets/videos/collaborative_learning.mp4', '/assets/thumbnails/collaborative_learning.jpg', 180, 'Features', ARRAY['collaborative', 'learning']),
  ('Error Recovery and Help Guide', 'How to recover from errors and get help', '/assets/videos/error_recovery.mp4', '/assets/thumbnails/error_recovery.jpg', 120, 'Help', ARRAY['error', 'help']),
  ('Search Assistance Guide', 'How to use search effectively', '/assets/videos/search_assistance.mp4', '/assets/thumbnails/search_assistance.jpg', 90, 'Help', ARRAY['search']),
  ('Assessment Preparation Guide', 'How to prepare for assessments', '/assets/videos/assessment_prep.mp4', '/assets/thumbnails/assessment_prep.jpg', 210, 'Academic', ARRAY['assessment', 'preparation']),
  ('Parent Guide Introduction', 'Guide for parents and guardians', '/assets/videos/parent_guide.mp4', '/assets/thumbnails/parent_guide.jpg', 240, 'Onboarding', ARRAY['parent', 'guardian']),
  ('Special Educational Needs Support Introduction', 'Overview of SEN support', '/assets/videos/sen_support.mp4', '/assets/thumbnails/sen_support.jpg', 210, 'Accessibility', ARRAY['sen', 'support']),
  ('Administrator Dashboard Introduction', 'Guide for administrators', '/assets/videos/admin_dashboard.mp4', '/assets/thumbnails/admin_dashboard.jpg', 180, 'Onboarding', ARRAY['administrator', 'dashboard']),
  ('Restorative Justice Module Introduction', 'Introduction to restorative justice', '/assets/videos/restorative_justice.mp4', '/assets/thumbnails/restorative_justice.jpg', 240, 'Features', ARRAY['restorative', 'justice']),
  ('Differentiated Instruction Toolkit', 'Guide to differentiated instruction', '/assets/videos/differentiated_instruction.mp4', '/assets/thumbnails/differentiated_instruction.jpg', 210, 'Academic', ARRAY['differentiated', 'instruction']),
  ('Social Skills Development Module Introduction', 'Guide to social skills development', '/assets/videos/social_skills.mp4', '/assets/thumbnails/social_skills.jpg', 180, 'Features', ARRAY['social', 'skills']);