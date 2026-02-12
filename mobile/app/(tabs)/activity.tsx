import { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native'
import { colors, typography, spacing, layout, radius, shadows } from '../../constants/theme'
import { supabase } from '../../lib/supabase'
import { getUserStreak } from '../../lib/progress'
import Heatmap from '../../components/Heatmap'

interface DailyActivity {
  date: string
  lessons_completed: number
  drills_logged: number
  total_reps: number
  minutes_trained: number
}

export default function ActivityScreen() {
  const [activity, setActivity] = useState<DailyActivity[]>([])
  const [streak, setStreak] = useState({ current: 0, longest: 0 })
  const [stats, setStats] = useState({
    totalLessons: 0,
    totalDrills: 0,
    totalReps: 0,
    totalMinutes: 0,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadActivity()
    loadStreak()
  }, [])

  async function handleRefresh() {
    setRefreshing(true)
    await Promise.all([loadActivity(), loadStreak()])
    setRefreshing(false)
  }

  async function loadActivity() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get last 90 days of activity
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

      const { data, error } = await supabase
        .from('daily_activity')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', ninetyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true })

      if (error) throw error

      setActivity(data || [])

      // Calculate totals
      const totals = (data || []).reduce(
        (acc, day) => ({
          totalLessons: acc.totalLessons + (day.lessons_completed || 0),
          totalDrills: acc.totalDrills + (day.drills_logged || 0),
          totalReps: acc.totalReps + (day.total_reps || 0),
          totalMinutes: acc.totalMinutes + (day.minutes_trained || 0),
        }),
        { totalLessons: 0, totalDrills: 0, totalReps: 0, totalMinutes: 0 }
      )

      setStats(totals)
    } catch (error) {
      console.error('Error loading activity:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadStreak() {
    const streakData = await getUserStreak()
    setStreak(streakData)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    )
  }

  const heatmapData = activity.map((day) => ({
    date: day.date,
    count: day.lessons_completed + day.drills_logged,
  }))

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary[500]}
            colors={[colors.primary[500]]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Activity</Text>
          <Text style={styles.headerSubtitle}>
            Track your training journey
          </Text>
        </View>

        {/* Streak Cards */}
        <View style={styles.streakContainer}>
          <View style={styles.streakCard}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakValue}>{streak.current}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>

          <View style={styles.streakCard}>
            <Text style={styles.streakEmoji}>🏆</Text>
            <Text style={styles.streakValue}>{streak.longest}</Text>
            <Text style={styles.streakLabel}>Best Streak</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalLessons}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalDrills}</Text>
              <Text style={styles.statLabel}>Drills</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalReps}</Text>
              <Text style={styles.statLabel}>Total Reps</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalMinutes}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
          </View>
        </View>

        {/* Heatmap */}
        <View style={styles.heatmapSection}>
          <Text style={styles.sectionTitle}>Activity Heatmap</Text>
          <Text style={styles.sectionSubtitle}>Last 90 days</Text>
          <Heatmap data={heatmapData} maxCount={10} />
        </View>

        {/* Empty State */}
        {activity.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🥊</Text>
            <Text style={styles.emptyTitle}>Start Training!</Text>
            <Text style={styles.emptySubtitle}>
              Complete lessons and log drills to see your progress here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: spacing[8],
  },

  header: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
  },

  headerTitle: {
    fontSize: typography.sizes['4xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },

  headerSubtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },

  streakContainer: {
    flexDirection: 'row',
    paddingHorizontal: layout.screenPadding,
    gap: spacing[3],
    marginBottom: spacing[6],
  },

  streakCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing[4],
    alignItems: 'center',
    ...shadows.base,
  },

  streakEmoji: {
    fontSize: 32,
    marginBottom: spacing[2],
  },

  streakValue: {
    fontSize: typography.sizes['4xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },

  streakLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },

  statsContainer: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing[3],
    marginBottom: spacing[6],
  },

  statRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: radius.md,
    padding: spacing[4],
    alignItems: 'center',
    ...shadows.base,
  },

  statValue: {
    fontSize: typography.sizes['3xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },

  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },

  heatmapSection: {
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing[6],
  },

  sectionTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },

  sectionSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
    paddingHorizontal: layout.screenPadding,
  },

  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing[4],
  },

  emptyTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },

  emptySubtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
  },
})
