-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Run this in Supabase SQL Editor BEFORE LAUNCH
-- ============================================

-- This file implements Row Level Security to ensure users
-- can only access their own data.

-- ============================================
-- 1. USER PROGRESS
-- ============================================

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view own progress" 
ON user_progress FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress" 
ON user_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress" 
ON user_progress FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 2. DRILL LOGS
-- ============================================

ALTER TABLE drill_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own drill logs
CREATE POLICY "Users can view own drill logs" 
ON drill_logs FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own drill logs
CREATE POLICY "Users can insert own drill logs" 
ON drill_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own drill logs
CREATE POLICY "Users can update own drill logs" 
ON drill_logs FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own drill logs
CREATE POLICY "Users can delete own drill logs" 
ON drill_logs FOR DELETE 
USING (auth.uid() = user_id);

-- ============================================
-- 3. DRILL PRACTICE (Spaced Repetition)
-- ============================================

ALTER TABLE drill_practice ENABLE ROW LEVEL SECURITY;

-- Users can view their own practice data
CREATE POLICY "Users can view own practice" 
ON drill_practice FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own practice data
CREATE POLICY "Users can insert own practice" 
ON drill_practice FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own practice data
CREATE POLICY "Users can update own practice" 
ON drill_practice FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. DAILY ACTIVITY
-- ============================================

ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;

-- Users can view their own activity
CREATE POLICY "Users can view own activity" 
ON daily_activity FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own activity
CREATE POLICY "Users can insert own activity" 
ON daily_activity FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own activity
CREATE POLICY "Users can update own activity" 
ON daily_activity FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 5. USER STREAKS
-- ============================================

ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- Users can view their own streaks
CREATE POLICY "Users can view own streaks" 
ON user_streaks FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own streaks
CREATE POLICY "Users can insert own streaks" 
ON user_streaks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own streaks
CREATE POLICY "Users can update own streaks" 
ON user_streaks FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 6. USER SUBSCRIPTIONS
-- ============================================

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription" 
ON user_subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own subscription (first time)
CREATE POLICY "Users can insert own subscription" 
ON user_subscriptions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscription (via Stripe webhook)
CREATE POLICY "Users can update own subscription" 
ON user_subscriptions FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 7. USER PUSH TOKENS
-- ============================================

ALTER TABLE user_push_tokens ENABLE ROW LEVEL SECURITY;

-- Users can manage their own push tokens
CREATE POLICY "Users can manage own tokens" 
ON user_push_tokens FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 8. PUBLIC READ TABLES (Courses, Lessons, Drills)
-- ============================================

-- Anyone can view courses (public content)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view courses" 
ON courses FOR SELECT 
USING (true);

-- Anyone can view lessons (premium check done in app)
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view lessons" 
ON lessons FOR SELECT 
USING (true);

-- Anyone can view drills (public library)
ALTER TABLE drills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view drills" 
ON drills FOR SELECT 
USING (true);

-- ============================================
-- 9. ADMIN POLICIES (Optional - for future)
-- ============================================

-- Uncomment and customize if you add admin users

-- CREATE POLICY "Admins can manage courses" 
-- ON courses FOR ALL 
-- USING (
--   auth.uid() IN (
--     SELECT id FROM auth.users WHERE email IN ('admin@mboxing.com')
--   )
-- );

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify RLS is working:

-- 1. Check that RLS is enabled on all tables:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
-- All should show 't' (true) for rowsecurity

-- 2. List all RLS policies:
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Test as authenticated user (replace USER_ID with actual UUID):
-- SELECT * FROM user_progress WHERE user_id = 'YOUR_USER_ID';
-- Should only return that user's data

-- 4. Test cross-user access (should return nothing):
-- SELECT * FROM user_progress WHERE user_id != auth.uid();
-- Should return no rows (blocked by RLS)

-- ============================================
-- NOTES
-- ============================================

-- 1. RLS is CRITICAL for data security
-- 2. Test thoroughly before going to production
-- 3. Always use auth.uid() for user identification
-- 4. Never disable RLS in production
-- 5. Monitor for policy violations in logs
-- 6. Update policies as schema evolves

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If queries return no results after enabling RLS:
-- 1. Check that user is authenticated (auth.uid() returns value)
-- 2. Verify policies are created correctly
-- 3. Check that user_id columns match auth.uid()
-- 4. Test policies with specific user IDs

-- To temporarily disable RLS for debugging (NEVER IN PRODUCTION):
-- ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;

-- To re-enable:
-- ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

-- If this runs without errors, your database is now secure! ✅
-- Users can only access their own data.
-- Test thoroughly before launch.
