import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { colors, typography, spacing, radius, shadows } from '../../constants/theme'
import { supabase } from '../../lib/supabase'
import Button from '../../components/Button'

interface Course {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  is_premium: boolean
}

interface Lesson {
  id: string
  title: string
  description: string
  video_duration: number
  order_index: number
  is_premium: boolean
}

export default function CourseDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadCourse()
      loadLessons()
    }
  }, [id])

  async function loadCourse() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setCourse(data)
    } catch (error) {
      console.error('Error loading course:', error)
    }
  }

  async function loadLessons() {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true })

      if (error) throw error
      setLessons(data || [])
    } catch (error) {
      console.error('Error loading lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading || !course) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    )
  }

  const totalDuration = lessons.reduce((sum, l) => sum + (l.video_duration || 0), 0)
  const totalMinutes = Math.floor(totalDuration / 60)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Course Info */}
        <View style={styles.header}>
          <View style={styles.badges}>
            {course.is_premium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.badgeText}>PREMIUM</Text>
              </View>
            )}
            <View style={styles.difficultyBadge}>
              <Text style={styles.badgeText}>
                {course.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.category}>{course.category.toUpperCase()}</Text>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.description}>{course.description}</Text>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{lessons.length}</Text>
              <Text style={styles.metaLabel}>Lessons</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{totalMinutes}</Text>
              <Text style={styles.metaLabel}>Minutes</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>0%</Text>
              <Text style={styles.metaLabel}>Complete</Text>
            </View>
          </View>

          <Button
            title="Start Course"
            onPress={() => {
              if (lessons.length > 0) {
                router.push(`/lesson/${lessons[0].id}`)
              }
            }}
            fullWidth
            size="lg"
            disabled={lessons.length === 0}
          />
        </View>

        {/* Lessons List */}
        <View style={styles.lessonsSection}>
          <Text style={styles.sectionTitle}>Course Content</Text>

          {lessons.length > 0 ? (
            lessons.map((lesson, index) => (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonCard}
                onPress={() => router.push(`/lesson/${lesson.id}`)}
              >
                <View style={styles.lessonNumber}>
                  <Text style={styles.lessonNumberText}>{index + 1}</Text>
                </View>

                <View style={styles.lessonContent}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  {lesson.description && (
                    <Text style={styles.lessonDescription} numberOfLines={2}>
                      {lesson.description}
                    </Text>
                  )}
                  {lesson.video_duration && (
                    <Text style={styles.lessonDuration}>
                      {formatDuration(lesson.video_duration)}
                    </Text>
                  )}
                </View>

                {lesson.is_premium && (
                  <View style={styles.lessonPremiumBadge}>
                    <Text style={styles.lessonPremiumText}>🔒</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📹</Text>
              <Text style={styles.emptyTitle}>No lessons yet</Text>
              <Text style={styles.emptySubtitle}>
                Content coming soon!
              </Text>
            </View>
          )}
        </View>
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

  backButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },

  backButtonText: {
    fontSize: typography.sizes.base,
    color: colors.primary[400],
    fontWeight: '600',
  },

  header: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },

  badges: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[3],
  },

  premiumBadge: {
    backgroundColor: colors.accent[500],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
  },

  difficultyBadge: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
  },

  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    color: colors.neutral[900],
  },

  category: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.primary[400],
    marginBottom: spacing[2],
  },

  title: {
    fontSize: typography.sizes['4xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[3],
    lineHeight: typography.lineHeights.tight * typography.sizes['4xl'],
  },

  description: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginBottom: spacing[6],
    lineHeight: typography.lineHeights.normal * typography.sizes.base,
  },

  meta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing[4],
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    marginBottom: spacing[6],
  },

  metaItem: {
    alignItems: 'center',
  },

  metaValue: {
    fontSize: typography.sizes['3xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },

  metaLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },

  lessonsSection: {
    paddingHorizontal: spacing[4],
  },

  sectionTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[4],
  },

  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.md,
    padding: spacing[4],
    marginBottom: spacing[3],
    ...shadows.base,
  },

  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },

  lessonNumberText: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.neutral[0],
  },

  lessonContent: {
    flex: 1,
  },

  lessonTitle: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },

  lessonDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing[1],
  },

  lessonDuration: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },

  lessonPremiumBadge: {
    marginLeft: spacing[2],
  },

  lessonPremiumText: {
    fontSize: 20,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[12],
  },

  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing[3],
  },

  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },

  emptySubtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },
})
