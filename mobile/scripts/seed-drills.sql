-- Sample Drill Data for Development
-- Run this in Supabase SQL Editor to populate drills

INSERT INTO drills (name, description, category, default_reps) VALUES
  (
    'Basic Jab',
    'The foundation of all boxing. Practice your jab with proper form and speed.',
    'Jab',
    50
  ),
  (
    'Double Jab',
    'Throw two quick jabs in succession. Focus on speed and accuracy.',
    'Jab',
    30
  ),
  (
    'Jab-Cross Combo',
    'The most fundamental combination. Jab to set up, cross to finish.',
    'Combos',
    40
  ),
  (
    'Cross Power Punch',
    'Generate maximum power from your rear hand. Rotate hips and shoulders.',
    'Cross',
    30
  ),
  (
    'Lead Hook',
    'Hook with your lead hand. Keep elbow at 90 degrees, pivot on front foot.',
    'Hook',
    30
  ),
  (
    'Rear Hook',
    'Powerful hook from your rear hand. Full hip rotation for maximum power.',
    'Hook',
    30
  ),
  (
    'Lead Uppercut',
    'Uppercut with your lead hand. Dip slightly and drive up through the target.',
    'Uppercut',
    25
  ),
  (
    'Rear Uppercut',
    'Rear uppercut for body or head. Bend knees and explode upward.',
    'Uppercut',
    25
  ),
  (
    'Shadow Boxing',
    'Practice combinations and movement without equipment. Focus on form.',
    'Fundamentals',
    300
  ),
  (
    'Footwork Ladder',
    'In-out, side-to-side movement. Light on your toes, always balanced.',
    'Footwork',
    50
  ),
  (
    'Pivot Drill',
    'Practice pivoting off both feet. Create angles and escape pressure.',
    'Footwork',
    40
  ),
  (
    'Slip Left',
    'Slip punches by moving head to the left. Keep hands up, eyes on opponent.',
    'Defense',
    30
  ),
  (
    'Slip Right',
    'Slip punches by moving head to the right. Stay balanced, ready to counter.',
    'Defense',
    30
  ),
  (
    'Roll Under',
    'Roll under hooks and wide punches. Bend at knees, not waist.',
    'Defense',
    25
  ),
  (
    'Parry Drill',
    'Deflect jabs with your lead hand. Small, quick movements.',
    'Defense',
    40
  ),
  (
    '1-2-3 Combo',
    'Jab, Cross, Lead Hook. The classic three-punch combination.',
    'Combos',
    30
  ),
  (
    '1-2-1-2',
    'Double jab-cross combination. Keep opponent guessing with rhythm changes.',
    'Combos',
    25
  ),
  (
    'Body-Head Combo',
    'Attack body then head. Make opponent drop guard then capitalize.',
    'Combos',
    20
  );
