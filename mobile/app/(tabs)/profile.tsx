import { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { colors, typography, spacing, layout, radius, shadows } from '../../constants/theme'
import { supabase } from '../../lib/supabase'
import { getUserStreak } from '../../lib/progress'
import { getUserSubscription, getSubscriptionBadge } from '../../lib/payments'
import Button from '../../components/Button'

interface UserStats {
  totalLessons: number
  totalDrills: number
  totalReps: number
  totalMinutes: number
}

export default function ProfileScreen() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<UserStats>({
    totalLessons: 0,
    totalDrills: 0,
    totalReps: 0,
    totalMinutes: 0,
  })
  const [streak, setStreak] = useState({ current: 0, longest: 0 })
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const { data: { user: userData } } = await supabase.auth.getUser()
      if (!userData) {
        router.replace('/auth/login')
        return
      }

      setUser(userData)

      // Load stats
      const { data: activityData } = await supabase
        .from('daily_activity')
        .select('*')
        .eq('user_id', userData.id)

      if (activityData) {
        const totals = activityData.reduce(
          (acc, day) => ({
            totalLessons: acc.totalLessons + (day.lessons_completed || 0),
            totalDrills: acc.totalDrills + (day.drills_logged || 0),
            totalReps: acc.totalReps + (day.total_reps || 0),
            totalMinutes: acc.totalMinutes + (day.minutes_trained || 0),
          }),
          { totalLessons: 0, totalDrills: 0, totalReps: 0, totalMinutes: 0 }
        )
        setStats(totals)
      }

      // Load streak
      const streakData = await getUserStreak()
      setStreak(streakData)

      // Load subscription
      const subscriptionData = await getUserSubscription()
      setSubscription(subscriptionData)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut()
            router.replace('/auth/login')
          },
        },
      ]
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.email}>{user?.email}</Text>
          
          {/* Subscription Badge */}
          {subscription && (
            <View
              style={[
                styles.subscriptionBadge,
                { backgroundColor: getSubscriptionBadge(subscription).color },
              ]}
            >
              <Text style={styles.subscriptionBadgeText}>
                {getSubscriptionBadge(subscription).label}
              </Text>
            </View>
          )}
          
          <Text style={styles.memberSince}>
            Member since {new Date(user?.created_at).toLocaleDateString('en-US', { 
              month: 'short', 
              year: 'numeric' 
            })}
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
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalLessons}</Text>
              <Text style={styles.statLabel}>Lessons Completed</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalDrills}</Text>
              <Text style={styles.statLabel}>Drills Logged</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {stats.totalReps.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Total Reps</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalMinutes}</Text>
              <Text style={styles.statLabel}>Minutes Trained</Text>
            </View>
          </View>
        </View>

        {/* Settings/Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push('/notifications-settings')}
          >
            <Text style={styles.optionText}>Notifications</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push('/subscription')}
          >
            <View style={styles.optionWithBadge}>
              <Text style={styles.optionText}>Subscription</Text>
              {subscription && subscription.tier !== 'free' && (
                <View
                  style={[
                    styles.miniSubscriptionBadge,
                    { backgroundColor: getSubscriptionBadge(subscription).color },
                  ]}
                >
                  <Text style={styles.miniSubscriptionText}>
                    {getSubscriptionBadge(subscription).label}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <Text style={styles.optionText}>Help & Support</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <Text style={styles.optionText}>About</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="secondary"
            fullWidth
          />
        </View>

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
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
    alignItems: 'center',
    paddingTop: spacing[6],
    paddingBottom: spacing[6],
    paddingHorizontal: layout.screenPadding,
  },

  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
    ...shadows.lg,
  },

  avatarText: {
    fontSize: typography.sizes['5xl'],
    fontWeight: '700',
    color: colors.neutral[900],
  },

  email: {
    fontSize: typography.sizes.xl,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },

  subscriptionBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
    marginBottom: spacing[2],
  },

  subscriptionBadgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    color: colors.neutral[900],
  },

  memberSince: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
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
    textAlign: 'center',
  },

  statsSection: {
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing[6],
  },

  sectionTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[4],
  },

  statsGrid: {
    gap: spacing[3],
  },

  statCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.md,
    padding: spacing[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.base,
  },

  statValue: {
    fontSize: typography.sizes['3xl'],
    fontWeight: '700',
    color: colors.primary[500],
  },

  statLabel: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },

  optionsSection: {
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing[6],
  },

  optionRow: {
    backgroundColor: colors.background.card,
    borderRadius: radius.md,
    padding: spacing[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
    ...shadows.base,
  },

  optionWithBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },

  optionText: {
    fontSize: typography.sizes.base,
    color: colors.text.primary,
    fontWeight: '500',
  },

  miniSubscriptionBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
  },

  miniSubscriptionText: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    color: colors.neutral[900],
  },

  optionArrow: {
    fontSize: typography.sizes['2xl'],
    color: colors.text.tertiary,
  },

  signOutSection: {
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing[4],
  },

  version: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
})
