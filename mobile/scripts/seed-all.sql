-- Complete Database Seeding Script
-- Run this AFTER creating all tables to populate with sample data

-- ============================================
-- COURSES (6 Sample Courses)
-- ============================================

INSERT INTO courses (title, description, category, difficulty, is_premium, order_index) VALUES
  (
    'Boxing Fundamentals',
    'Master the essential fundamentals of boxing. Learn proper stance, footwork, and basic punches. Perfect for beginners starting their boxing journey.',
    'Fundamentals',
    'beginner',
    false,
    1
  ),
  (
    'Advanced Combinations',
    'Learn devastating punch combinations used by professional fighters. Build speed, power, and rhythm with complex multi-punch sequences.',
    'Combos',
    'advanced',
    true,
    2
  ),
  (
    'Defensive Masterclass',
    'Defense wins fights. Master slips, rolls, blocks, parries, and counters like a pro. Learn to make opponents miss and make them pay.',
    'Defense',
    'intermediate',
    true,
    3
  ),
  (
    'Footwork Fundamentals',
    'Movement is everything in boxing. Learn how to control the ring, create angles, and stay balanced with proper footwork techniques.',
    'Footwork',
    'beginner',
    false,
    4
  ),
  (
    'Power Punching Mechanics',
    'Generate knockout power from every punch. Learn the biomechanics of devastating strikes and how to transfer energy efficiently.',
    'Technique',
    'intermediate',
    true,
    5
  ),
  (
    'Counter-Fighting Tactics',
    'Make your opponent pay for every mistake. Master the art of counter-punching and defensive offense.',
    'Strategy',
    'advanced',
    true,
    6
  );

-- ============================================
-- LESSONS (Sample lessons for each course)
-- ============================================

-- Boxing Fundamentals (Course 1)
INSERT INTO lessons (course_id, title, description, video_duration, order_index, is_premium) 
SELECT id, 'Proper Boxing Stance', 'Learn the foundational stance that all boxing technique builds from. Balance, weight distribution, and guard position.', 480, 1, false
FROM courses WHERE title = 'Boxing Fundamentals';

INSERT INTO lessons (course_id, title, description, video_duration, order_index, is_premium)
SELECT id, 'Basic Jab Technique', 'The most important punch in boxing. Master the jab with proper form, speed, and accuracy.', 540, 2, false
FROM courses WHERE title = 'Boxing Fundamentals';

INSERT INTO lessons (course_id, title, description, video_duration, order_index, is_premium)
SELECT id, 'The Cross (Straight Right)', 'Your power punch. Learn to throw a devastating cross with full body rotation.', 600, 3, false
FROM courses WHERE title = 'Boxing Fundamentals';

INSERT INTO lessons (course_id, title, description, video_duration, order_index, is_premium)
SELECT id, 'Basic Footwork Patterns', 'Moving forward, backward, and side-to-side while maintaining balance and guard.', 720, 4, false
FROM courses WHERE title = 'Boxing Fundamentals';

-- Advanced Combinations (Course 2)
INSERT INTO lessons (course_id, title, description, video_duration, order_index, is_premium)
SELECT id, '1-2-3 Combination', 'The classic jab-cross-hook combination. Speed, rhythm, and power.', 600, 1, true
FROM courses WHERE title = 'Advanced Combinations';

INSERT INTO lessons (course_id, title, description, video_duration, order_index, is_premium)
SELECT id, 'Body-Head Combinations', 'Attack the body to bring the guard down, then capitalize with head shots.', 720, 2, true
FROM courses WHERE title = 'Advanced Combinations';

INSERT INTO lessons (course_id, title, description, video_duration, order_index, is_premium)
SELECT id, '5-Punch Combos', 'Complex combinations that keep opponents guessing and overwhelmed.', 900, 3, true
FROM courses WHERE title = 'Advanced Combinations';

-- Defensive Masterclass (Course 3)
INSERT INTO lessons (course_id, title, description, video_duration, order_index, is_premium)
SELECT id, 'Slip Technique', 'Make punches miss by inches. Head movement fundamentals and timing.', 600, 1, true
FROM courses WHERE title = 'Defensive Masterclass';

INSERT INTO lessons (course_id, title, description, video_duration, order_index, is_premium)
SELECT id, 'Roll and Counter', 'Roll under hooks and come back with devastating counters.', 720, 2, true
FROM courses WHERE title = 'Defensive Masterclass';

INSERT INTO lessons (course_id, title, description, video_duration, order_index, is_premium)
SELECT id, 'Parry and Redirect', 'Deflect jabs and crosses with minimal movement, stay in position to counter.', 540, 3, true
FROM courses WHERE title = 'Defensive Masterclass';

-- ============================================
-- DRILLS (18 Training Drills)
-- ============================================

INSERT INTO drills (name, description, category, default_reps) VALUES
  ('Basic Jab', 'The foundation of all boxing. Practice your jab with proper form and speed.', 'Jab', 50),
  ('Double Jab', 'Throw two quick jabs in succession. Focus on speed and accuracy.', 'Jab', 30),
  ('Jab-Cross Combo', 'The most fundamental combination. Jab to set up, cross to finish.', 'Combos', 40),
  ('Cross Power Punch', 'Generate maximum power from your rear hand. Rotate hips and shoulders.', 'Cross', 30),
  ('Lead Hook', 'Hook with your lead hand. Keep elbow at 90 degrees, pivot on front foot.', 'Hook', 30),
  ('Rear Hook', 'Powerful hook from your rear hand. Full hip rotation for maximum power.', 'Hook', 30),
  ('Lead Uppercut', 'Uppercut with your lead hand. Dip slightly and drive up through the target.', 'Uppercut', 25),
  ('Rear Uppercut', 'Rear uppercut for body or head. Bend knees and explode upward.', 'Uppercut', 25),
  ('Shadow Boxing', 'Practice combinations and movement without equipment. Focus on form.', 'Fundamentals', 300),
  ('Footwork Ladder', 'In-out, side-to-side movement. Light on your toes, always balanced.', 'Footwork', 50),
  ('Pivot Drill', 'Practice pivoting off both feet. Create angles and escape pressure.', 'Footwork', 40),
  ('Slip Left', 'Slip punches by moving head to the left. Keep hands up, eyes on opponent.', 'Defense', 30),
  ('Slip Right', 'Slip punches by moving head to the right. Stay balanced, ready to counter.', 'Defense', 30),
  ('Roll Under', 'Roll under hooks and wide punches. Bend at knees, not waist.', 'Defense', 25),
  ('Parry Drill', 'Deflect jabs with your lead hand. Small, quick movements.', 'Defense', 40),
  ('1-2-3 Combo', 'Jab, Cross, Lead Hook. The classic three-punch combination.', 'Combos', 30),
  ('1-2-1-2', 'Double jab-cross combination. Keep opponent guessing with rhythm changes.', 'Combos', 25),
  ('Body-Head Combo', 'Attack body then head. Make opponent drop guard then capitalize.', 'Combos', 20);

-- ============================================
-- NOTES
-- ============================================
-- This seeds:
-- - 6 courses (3 free, 3 premium)
-- - 10 sample lessons across courses
-- - 18 training drills across all categories
--
-- User-specific data (progress, logs, streaks) will be created
-- automatically as users interact with the app.
