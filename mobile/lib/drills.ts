import { supabase } from './supabase'
import { updateDailyActivity } from './progress'

export interface Drill {
  id: string
  name: string
  description: string
  category: string
  thumbnail_url?: string
  video_url?: string
  default_reps: number
  created_at: string
}

export interface DrillLog {
  id: string
  user_id: string
  drill_id: string
  reps: number
  notes?: string
  logged_at: string
  created_at: string
}

/**
 * Get all drills
 */
export async function getDrills(): Promise<Drill[]> {
  try {
    const { data, error } = await supabase
      .from('drills')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting drills:', error)
    return []
  }
}

/**
 * Get drills by category
 */
export async function getDrillsByCategory(
  category: string
): Promise<Drill[]> {
  try {
    const { data, error } = await supabase
      .from('drills')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting drills by category:', error)
    return []
  }
}

/**
 * Get drill by ID
 */
export async function getDrill(drillId: string): Promise<Drill | null> {
  try {
    const { data, error } = await supabase
      .from('drills')
      .select('*')
      .eq('id', drillId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting drill:', error)
    return null
  }
}

/**
 * Log reps for a drill
 */
export async function logDrillReps(
  drillId: string,
  reps: number,
  notes?: string
): Promise<DrillLog | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('drill_logs')
      .insert({
        user_id: user.id,
        drill_id: drillId,
        reps,
        notes,
        logged_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // Update daily activity
    await updateDailyActivity({
      drills_logged: 1,
      total_reps: reps,
    })

    return data
  } catch (error) {
    console.error('Error logging drill reps:', error)
    return null
  }
}

/**
 * Get drill logs for a specific drill
 */
export async function getDrillLogs(
  drillId: string,
  limit = 50
): Promise<DrillLog[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('drill_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('drill_id', drillId)
      .order('logged_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting drill logs:', error)
    return []
  }
}

/**
 * Get all drill logs for user
 */
export async function getAllDrillLogs(limit = 100): Promise<DrillLog[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('drill_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('logged_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting all drill logs:', error)
    return []
  }
}

/**
 * Get total reps for a drill
 */
export async function getDrillTotalReps(drillId: string): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    const { data, error } = await supabase
      .from('drill_logs')
      .select('reps')
      .eq('user_id', user.id)
      .eq('drill_id', drillId)

    if (error) throw error

    return (data || []).reduce((sum, log) => sum + log.reps, 0)
  } catch (error) {
    console.error('Error getting drill total reps:', error)
    return 0
  }
}

/**
 * Get today's drill logs
 */
export async function getTodayDrillLogs(): Promise<DrillLog[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('drill_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_at', today)
      .order('logged_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting today drill logs:', error)
    return []
  }
}
