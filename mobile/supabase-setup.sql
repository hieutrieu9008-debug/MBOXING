-- =====================================================
-- MUSTAFA'S BOXING - SLICE 01 DATABASE SETUP
-- =====================================================
-- Run this in Supabase SQL Editor: 
-- https://supabase.com/dashboard/project/nwxktguteksrnkxqgjc/sql
-- =====================================================

-- =====================================================
-- STEP 1: CREATE TABLES
-- =====================================================

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT 'boxing',
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  lesson_count INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  video_url TEXT,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);

-- =====================================================
-- STEP 2: ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Allow public read access to courses and lessons (no auth required for browsing)
CREATE POLICY "Allow public read access on courses" 
  ON courses FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access on lessons" 
  ON lessons FOR SELECT 
  USING (true);

-- =====================================================
-- STEP 3: SEED DATA - SAMPLE COURSES
-- =====================================================

INSERT INTO courses (title, description, thumbnail_url, category, difficulty, lesson_count, duration_minutes, is_premium) VALUES
(
  'Fundamentals of Boxing',
  'Master the foundational techniques of boxing. Learn proper stance, basic punches, and essential footwork from Coach Mustafa.',
  'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
  'boxing',
  'beginner',
  12,
  225,
  false
),
(
  'Power Punching Mastery',
  'Develop devastating knockout power in every punch. Advanced techniques for generating maximum force.',
  'https://images.unsplash.com/photo-1517438322307-e67111335449?w=800',
  'boxing',
  'intermediate',
  10,
  180,
  true
),
(
  'Footwork Fundamentals',
  'Move like a champion. Learn the footwork patterns that separate amateur boxers from professionals.',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
  'footwork',
  'beginner',
  8,
  120,
  false
),
(
  'Defensive Techniques',
  'Never get hit. Master slips, rolls, blocks, and parries to become an elusive fighter.',
  'https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?w=800',
  'defense',
  'intermediate',
  9,
  150,
  true
),
(
  'Advanced Combinations',
  'String together devastating multi-punch combinations that overwhelm opponents.',
  'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=800',
  'boxing',
  'advanced',
  8,
  135,
  true
),
(
  'Speed & Agility Training',
  'Increase your hand speed and reaction time with specialized drills and exercises.',
  'https://images.unsplash.com/photo-1517438322307-e67111335449?w=800',
  'boxing',
  'intermediate',
  6,
  90,
  false
);

-- =====================================================
-- STEP 4: SEED DATA - SAMPLE LESSONS
-- =====================================================

-- Get the course IDs we just created
DO $$
DECLARE
  fundamentals_id UUID;
  power_id UUID;
  footwork_id UUID;
  defense_id UUID;
BEGIN
  SELECT id INTO fundamentals_id FROM courses WHERE title = 'Fundamentals of Boxing';
  SELECT id INTO power_id FROM courses WHERE title = 'Power Punching Mastery';
  SELECT id INTO footwork_id FROM courses WHERE title = 'Footwork Fundamentals';
  SELECT id INTO defense_id FROM courses WHERE title = 'Defensive Techniques';

  -- Fundamentals of Boxing lessons
  INSERT INTO lessons (course_id, title, duration_seconds, order_index, is_preview) VALUES
  (fundamentals_id, 'The Boxing Stance', 630, 1, true),
  (fundamentals_id, 'The Basic Jab', 525, 2, true),
  (fundamentals_id, 'The Powerful Cross', 735, 3, false),
  (fundamentals_id, 'The Hook', 660, 4, false),
  (fundamentals_id, 'The Uppercut', 570, 5, false),
  (fundamentals_id, 'Basic Defense - The Guard', 480, 6, false),
  (fundamentals_id, 'Putting It Together', 900, 7, false);

  -- Power Punching Mastery lessons
  INSERT INTO lessons (course_id, title, duration_seconds, order_index, is_preview) VALUES
  (power_id, 'Understanding Power Generation', 720, 1, true),
  (power_id, 'Hip Rotation Mechanics', 600, 2, false),
  (power_id, 'Weight Transfer Techniques', 660, 3, false),
  (power_id, 'The Power Jab', 540, 4, false),
  (power_id, 'Cross Power Tips', 600, 5, false);

  -- Footwork Fundamentals lessons
  INSERT INTO lessons (course_id, title, duration_seconds, order_index, is_preview) VALUES
  (footwork_id, 'The Basic Shuffle', 480, 1, true),
  (footwork_id, 'Lateral Movement', 540, 2, true),
  (footwork_id, 'Advancing and Retreating', 600, 3, false),
  (footwork_id, 'Pivots and Angles', 720, 4, false);

  -- Defensive Techniques lessons
  INSERT INTO lessons (course_id, title, duration_seconds, order_index, is_preview) VALUES
  (defense_id, 'The Slip', 600, 1, true),
  (defense_id, 'The Roll', 660, 2, false),
  (defense_id, 'Blocking Punches', 540, 3, false),
  (defense_id, 'The Parry', 480, 4, false);
END $$;

-- =====================================================
-- VERIFICATION: Check the data
-- =====================================================
SELECT 'Courses created:' as status, COUNT(*) as count FROM courses;
SELECT 'Lessons created:' as status, COUNT(*) as count FROM lessons;
