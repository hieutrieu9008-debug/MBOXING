import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { colors, typography, spacing, radius, shadows } from '../constants/theme'

interface DrillCardProps {
  id: string
  name: string
  description: string
  category: string
  default_reps: number
  totalReps?: number
}

export default function DrillCard({
  id,
  name,
  description,
  category,
  default_reps,
  totalReps = 0,
}: DrillCardProps) {
  const router = useRouter()

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/drill/${id}`)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.category}>{category.toUpperCase()}</Text>
        </View>
        <View style={styles.repsBadge}>
          <Text style={styles.repsText}>{default_reps}</Text>
          <Text style={styles.repsLabel}>reps</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.totalReps}>
          {totalReps.toLocaleString()} total reps
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing[4],
    marginBottom: spacing[3],
    ...shadows.base,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },

  titleContainer: {
    flex: 1,
    marginRight: spacing[3],
  },

  name: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },

  category: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    color: colors.primary[400],
  },

  repsBadge: {
    backgroundColor: colors.primary[500],
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    alignItems: 'center',
    minWidth: 60,
  },

  repsText: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.neutral[900],
  },

  repsLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    color: colors.neutral[900],
    marginTop: -2,
  },

  description: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeights.normal * typography.sizes.sm,
    marginBottom: spacing[3],
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalReps: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },
})
