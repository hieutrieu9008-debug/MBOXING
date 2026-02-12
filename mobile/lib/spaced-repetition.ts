import { supabase } from './supabase'

export interface DrillPractice {
  id: string
  user_id: string
  drill_id: string
  ease_factor: number
  interval_days: number
  repetitions: number
  next_practice_date: string
  last_practiced_at: string
  created_at: string
  updated_at: string
}

/**
 * SM-2 Algorithm for Spaced Repetition
 * Based on SuperMemo 2 algorithm
 */

const INITIAL_EASE_FACTOR = 2.5
const MINIMUM_EASE_FACTOR = 1.3

/**
 * Calculate next review interval based on quality of recall
 * @param quality - 0 (complete blackout) to 5 (perfect recall)
 * @param easeFactor - Current ease factor (default 2.5)
 * @param interval - Current interval in days
 * @param repetitions - Number of successful repetitions
 */
function calculateNextInterval(
  quality: number,
  easeFactor: number,
  interval: number,
  repetitions: number
): { newInterval: number; newEaseFactor: number; newRepetitions: number } {
  // Quality below 3 resets the learning process
  if (quality < 3) {
    return {
      newInterval: 1,
      newEaseFactor: Math.max(easeFactor - 0.2, MINIMUM_EASE_FACTOR),
      newRepetitions: 0,
    }
  }

  // Update ease factor
  const newEaseFactor = Math.max(
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
    MINIMUM_EASE_FACTOR
  )

  // Calculate new interval
  let newInterval: number
  if (repetitions === 0) {
    newInterval = 1
  } else if (repetitions === 1) {
    newInterval = 6
  } else {
    newInterval = Math.round(interval * newEaseFactor)
  }

  return {
    newInterval,
    newEaseFactor,
    newRepetitions: repetitions + 1,
  }
}

/**
 * Get or create drill practice record
 */
export async function getDrillPractice(
  drillId: string
): Promise<DrillPractice | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('drill_practice')
      .select('*')
      .eq('user_id', user.id)
      .eq('drill_id', drillId)
      .single()

    if (error && error.code === 'PGRST116') {
      // Record doesn't exist, create it
      return await createDrillPractice(drillId)
    }

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting drill practice:', error)
    return null
  }
}

/**
 * Create initial drill practice record
 */
async function createDrillPractice(
  drillId: string
): Promise<DrillPractice | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { data, error } = await supabase
      .from('drill_practice')
      .insert({
        user_id: user.id,
        drill_id: drillId,
        ease_factor: INITIAL_EASE_FACTOR,
        interval_days: 1,
        repetitions: 0,
        next_practice_date: tomorrow.toISOString().split('T')[0],
        last_practiced_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating drill practice:', error)
    return null
  }
}

/**
 * Update drill practice after completion
 * @param drillId - The drill ID
 * @param quality - Quality rating 0-5 (0 = forgot, 5 = perfect)
 */
export async function updateDrillPractice(
  drillId: string,
  quality: number
): Promise<DrillPractice | null> {
  try {
    const practice = await getDrillPractice(drillId)
    if (!practice) return null

    const { newInterval, newEaseFactor, newRepetitions } = calculateNextInterval(
      quality,
      practice.ease_factor,
      practice.interval_days,
      practice.repetitions
    )

    const nextPracticeDate = new Date()
    nextPracticeDate.setDate(nextPracticeDate.getDate() + newInterval)

    const { data, error } = await supabase
      .from('drill_practice')
      .update({
        ease_factor: newEaseFactor,
        interval_days: newInterval,
        repetitions: newRepetitions,
        next_practice_date: nextPracticeDate.toISOString().split('T')[0],
        last_practiced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', practice.id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating drill practice:', error)
    return null
  }
}

/**
 * Get drills due for practice today
 */
export async function getDueDrills(): Promise<any[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('drill_practice')
      .select(`
        *,
        drills (
          id,
          name,
          description,
          category,
          default_reps
        )
      `)
      .eq('user_id', user.id)
      .lte('next_practice_date', today)
      .order('next_practice_date', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting due drills:', error)
    return []
  }
}

/**
 * Get count of drills due today
 */
export async function getDueDrillCount(): Promise<number> {
  const drills = await getDueDrills()
  return drills.length
}

/**
 * Get upcoming practice schedule (next 7 days)
 */
export async function getUpcomingPractice(): Promise<Record<string, number>> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return {}

    const today = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7)

    const { data, error } = await supabase
      .from('drill_practice')
      .select('next_practice_date')
      .eq('user_id', user.id)
      .gte('next_practice_date', today.toISOString().split('T')[0])
      .lte('next_practice_date', nextWeek.toISOString().split('T')[0])

    if (error) throw error

    // Group by date
    const schedule: Record<string, number> = {}
    ;(data || []).forEach((practice) => {
      const date = practice.next_practice_date
      schedule[date] = (schedule[date] || 0) + 1
    })

    return schedule
  } catch (error) {
    console.error('Error getting upcoming practice:', error)
    return {}
  }
}

/**
 * Reset drill practice (start over)
 */
export async function resetDrillPractice(drillId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { error } = await supabase
      .from('drill_practice')
      .update({
        ease_factor: INITIAL_EASE_FACTOR,
        interval_days: 1,
        repetitions: 0,
        next_practice_date: tomorrow.toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('drill_id', drillId)

    return !error
  } catch (error) {
    console.error('Error resetting drill practice:', error)
    return false
  }
}
