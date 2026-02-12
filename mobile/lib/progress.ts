import { supabase } from './supabase'

export interface UserProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  completed_at: string | null
  watch_time: number
}

/**
 * Get user's progress for a specific lesson
 */
export async function getLessonProgress(
  lessonId: string
): Promise<UserProgress | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  } catch (error) {
    console.error('Error getting lesson progress:', error)
    return null
  }
}

/**
 * Update watch time for a lesson
 */
export async function updateWatchTime(
  lessonId: string,
  watchTime: number
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        watch_time: watchTime,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,lesson_id'
      })

    if (error) throw error
  } catch (error) {
    console.error('Error updating watch time:', error)
  }
}

/**
 * Mark a lesson as complete
 */
export async function markLessonComplete(
  lessonId: string
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,lesson_id'
      })

    if (error) throw error

    // Update daily activity
    await updateDailyActivity({
      lessons_completed: 1,
    })
  } catch (error) {
    console.error('Error marking lesson complete:', error)
  }
}

/**
 * Get course progress (percentage complete)
 */
export async function getCourseProgress(
  courseId: string
): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    // Get all lessons in course
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', courseId)

    if (lessonsError) throw lessonsError
    if (!lessons || lessons.length === 0) return 0

    // Get completed lessons
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('completed', true)
      .in('lesson_id', lessons.map(l => l.id))

    if (progressError) throw progressError

    const completedCount = progress?.length || 0
    return Math.round((completedCount / lessons.length) * 100)
  } catch (error) {
    console.error('Error getting course progress:', error)
    return 0
  }
}

/**
 * Update daily activity stats
 */
export async function updateDailyActivity(stats: {
  lessons_completed?: number
  drills_logged?: number
  total_reps?: number
  minutes_trained?: number
}): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = new Date().toISOString().split('T')[0]

    // Get current activity for today
    const { data: existing } = await supabase
      .from('daily_activity')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    const updates = {
      user_id: user.id,
      date: today,
      lessons_completed: (existing?.lessons_completed || 0) + (stats.lessons_completed || 0),
      drills_logged: (existing?.drills_logged || 0) + (stats.drills_logged || 0),
      total_reps: (existing?.total_reps || 0) + (stats.total_reps || 0),
      minutes_trained: (existing?.minutes_trained || 0) + (stats.minutes_trained || 0),
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('daily_activity')
      .upsert(updates, {
        onConflict: 'user_id,date'
      })

    if (error) throw error

    // Update streak
    await updateStreak()
  } catch (error) {
    console.error('Error updating daily activity:', error)
  }
}

/**
 * Update user's streak
 */
export async function updateStreak(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    // Get streak record
    const { data: streak } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .single()

    let currentStreak = 1
    let longestStreak = streak?.longest_streak || 1

    if (streak?.last_activity_date === yesterday) {
      // Continue streak
      currentStreak = (streak.current_streak || 0) + 1
    } else if (streak?.last_activity_date === today) {
      // Already logged today
      return
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak
    }

    await supabase
      .from('user_streaks')
      .upsert({
        user_id: user.id,
        current_streak: currentStreak,
        longest_streak: longestStreak,
        last_activity_date: today,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
  } catch (error) {
    console.error('Error updating streak:', error)
  }
}

/**
 * Get user's current streak
 */
export async function getUserStreak(): Promise<{
  current: number
  longest: number
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { current: 0, longest: 0 }

    const { data, error } = await supabase
      .from('user_streaks')
      .select('current_streak, longest_streak')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return {
      current: data?.current_streak || 0,
      longest: data?.longest_streak || 0,
    }
  } catch (error) {
    console.error('Error getting user streak:', error)
    return { current: 0, longest: 0 }
  }
}
