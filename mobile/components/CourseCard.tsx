import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { colors, typography, spacing, radius, shadows } from '../constants/theme'

interface CourseCardProps {
  id: string
  title: string
  description?: string
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  thumbnail_url?: string
  is_premium: boolean
  progress?: number // 0-100
  lesson_count?: number
}

export default function CourseCard({
  id,
  title,
  description,
  category,
  difficulty,
  thumbnail_url,
  is_premium,
  progress = 0,
  lesson_count,
}: CourseCardProps) {
  const router = useRouter()

  const difficultyColors = {
    beginner: colors.success,
    intermediate: colors.accent[500],
    advanced: colors.error,
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/course/${id}`)}
      activeOpacity={0.8}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        {thumbnail_url ? (
          <Image source={{ uri: thumbnail_url }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
            <Text style={styles.placeholderEmoji}>🥊</Text>
          </View>
        )}
        
        {/* Premium badge */}
        {is_premium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PREMIUM</Text>
          </View>
        )}

        {/* Difficulty badge */}
        {difficulty && (
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: difficultyColors[difficulty] },
            ]}
          >
            <Text style={styles.difficultyText}>
              {difficulty.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Category */}
        {category && (
          <Text style={styles.category}>{category.toUpperCase()}</Text>
        )}

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {/* Description */}
        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}

        {/* Meta info */}
        <View style={styles.meta}>
          {lesson_count !== undefined && (
            <Text style={styles.metaText}>
              {lesson_count} {lesson_count === 1 ? 'lesson' : 'lessons'}
            </Text>
          )}
        </View>

        {/* Progress bar */}
        {progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing[4],
    ...shadows.md,
  },

  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
  },

  thumbnail: {
    width: '100%',
    height: '100%',
  },

  placeholderThumbnail: {
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderEmoji: {
    fontSize: 48,
  },

  premiumBadge: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    backgroundColor: colors.accent[500],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
  },

  premiumText: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    color: colors.neutral[900],
  },

  difficultyBadge: {
    position: 'absolute',
    top: spacing[2],
    left: spacing[2],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
  },

  difficultyText: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    color: colors.neutral[0],
  },

  content: {
    padding: spacing[4],
  },

  category: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    color: colors.primary[400],
    marginBottom: spacing[1],
  },

  title: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[2],
    lineHeight: typography.lineHeights.tight * typography.sizes.lg,
  },

  description: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing[3],
    lineHeight: typography.lineHeights.normal * typography.sizes.sm,
  },

  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },

  metaText: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },

  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.full,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
  },

  progressText: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    color: colors.text.tertiary,
    minWidth: 36,
    textAlign: 'right',
  },
})
