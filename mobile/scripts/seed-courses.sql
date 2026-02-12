-- Sample Course Data for Development
-- Run this in Supabase SQL Editor to populate courses

INSERT INTO courses (title, description, category, difficulty, is_premium, order_index) VALUES
  (
    'Boxing Fundamentals',
    'Master the essential fundamentals of boxing. Learn proper stance, footwork, and basic punches.',
    'Fundamentals',
    'beginner',
    false,
    1
  ),
  (
    'Advanced Combinations',
    'Learn devastating punch combinations used by professional fighters. Build speed and power.',
    'Combos',
    'advanced',
    true,
    2
  ),
  (
    'Defensive Masterclass',
    'Defense wins fights. Master slips, rolls, blocks, and counters like a pro.',
    'Defense',
    'intermediate',
    true,
    3
  ),
  (
    'Footwork Fundamentals',
    'Movement is everything. Learn how to control the ring with proper footwork.',
    'Footwork',
    'beginner',
    false,
    4
  ),
  (
    'Power Punching',
    'Generate knockout power. Learn the mechanics of devastating punches.',
    'Technique',
    'intermediate',
    true,
    5
  ),
  (
    'Counter-Fighting Tactics',
    'Make your opponent pay. Master the art of counter-punching.',
    'Strategy',
    'advanced',
    true,
    6
  );
