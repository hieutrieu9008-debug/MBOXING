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
import { colors, typography, spacing, layout } from '../../constants/theme'
import CourseCard from '../../components/CourseCard'
import { supabase } from '../../lib/supabase'
import { getCourseProgress } from '../../lib/progress'

interface Course {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  thumbnail_url: string
  is_premium: boolean
  lesson_count?: number
  progress?: number
}

export default function BrowseScreen() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadCourses()
  }, [])

  async function handleRefresh() {
    setRefreshing(true)
    await loadCourses()
    setRefreshing(false)
  }

  async function loadCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error

      // Load progress for each course
      const coursesWithProgress = await Promise.all(
        (data || []).map(async (course) => ({
          ...course,
          progress: await getCourseProgress(course.id),
        }))
      )

      setCourses(coursesWithProgress)
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Courses</Text>
        <Text style={styles.headerSubtitle}>
          Master the sweet science with Coach Mustafa
        </Text>
      </View>

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
        {/* Courses */}
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              category={course.category}
              difficulty={course.difficulty}
              thumbnail_url={course.thumbnail_url}
              is_premium={course.is_premium}
              lesson_count={course.lesson_count}
              progress={course.progress}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🥊</Text>
            <Text style={styles.emptyTitle}>No courses yet</Text>
            <Text style={styles.emptySubtitle}>
              Coach Mustafa is preparing amazing content for you!
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
    paddingHorizontal: spacing[8],
  },
})
