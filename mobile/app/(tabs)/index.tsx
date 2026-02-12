import { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { colors, typography, spacing, layout, radius, shadows } from '../../constants/theme'
import { getDrills, getDrillTotalReps, Drill } from '../../lib/drills'
import { getDueDrills } from '../../lib/spaced-repetition'
import DrillCard from '../../components/DrillCard'

const CATEGORIES = ['All', 'Jab', 'Cross', 'Hook', 'Uppercut', 'Footwork', 'Defense']

export default function DrillsScreen() {
  const [drills, setDrills] = useState<Drill[]>([])
  const [dueDrills, setDueDrills] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [drillReps, setDrillReps] = useState<Record<string, number>>({})

  useEffect(() => {
    loadDrills()
    loadDueDrills()
  }, [])

  async function loadDueDrills() {
    const due = await getDueDrills()
    setDueDrills(due)
  }

  async function loadDrills() {
    try {
      const data = await getDrills()
      setDrills(data)

      // Load total reps for each drill
      const repsMap: Record<string, number> = {}
      await Promise.all(
        data.map(async (drill) => {
          repsMap[drill.id] = await getDrillTotalReps(drill.id)
        })
      )
      setDrillReps(repsMap)
    } catch (error) {
      console.error('Error loading drills:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDrills =
    selectedCategory === 'All'
      ? drills
      : drills.filter((drill) => drill.category === selectedCategory)

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Loading drills...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Training Drills</Text>
        <Text style={styles.headerSubtitle}>
          Practice and track your technique
        </Text>
      </View>

      {/* Practice Today Banner */}
      {dueDrills.length > 0 && (
        <View style={styles.dueBanner}>
          <View style={styles.dueBannerContent}>
            <Text style={styles.dueBannerEmoji}>🔔</Text>
            <View style={styles.dueBannerText}>
              <Text style={styles.dueBannerTitle}>Practice Due Today</Text>
              <Text style={styles.dueBannerSubtitle}>
                {dueDrills.length} {dueDrills.length === 1 ? 'drill' : 'drills'} ready for review
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Drills List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredDrills.length > 0 ? (
          filteredDrills.map((drill) => (
            <DrillCard
              key={drill.id}
              id={drill.id}
              name={drill.name}
              description={drill.description}
              category={drill.category}
              default_reps={drill.default_reps}
              totalReps={drillReps[drill.id] || 0}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🥊</Text>
            <Text style={styles.emptyTitle}>No drills yet</Text>
            <Text style={styles.emptySubtitle}>
              Check back soon for training drills!
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

  loadingText: {
    marginTop: spacing[4],
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },

  header: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
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

  dueBanner: {
    marginHorizontal: layout.screenPadding,
    marginBottom: spacing[4],
    backgroundColor: colors.primary[500],
    borderRadius: radius.lg,
    padding: spacing[4],
    ...shadows.base,
  },

  dueBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dueBannerEmoji: {
    fontSize: 32,
    marginRight: spacing[3],
  },

  dueBannerText: {
    flex: 1,
  },

  dueBannerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.neutral[900],
    marginBottom: spacing[1],
  },

  dueBannerSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.neutral[800],
  },

  categoryScroll: {
    marginBottom: spacing[4],
  },

  categoryContent: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing[2],
  },

  categoryChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
  },

  categoryChipActive: {
    backgroundColor: colors.primary[500],
  },

  categoryText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.text.secondary,
  },

  categoryTextActive: {
    color: colors.neutral[900],
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing[8],
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[20],
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
