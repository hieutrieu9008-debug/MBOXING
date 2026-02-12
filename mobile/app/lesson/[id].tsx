import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation'
import { colors, typography, spacing } from '../../constants/theme'
import { supabase } from '../../lib/supabase'
import Button from '../../components/Button'

interface Lesson {
  id: string
  course_id: string
  title: string
  description: string
  video_url: string
  video_duration: number
  order_index: number
}

export default function LessonScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const videoRef = useRef<Video>(null)

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (id) {
      loadLesson()
    }

    return () => {
      // Reset orientation when leaving
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      )
    }
  }, [id])

  async function loadLesson() {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setLesson(data)
    } catch (error) {
      console.error('Error loading lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  function handlePlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying)
      setPosition(status.positionMillis / 1000)
      setDuration(status.durationMillis ? status.durationMillis / 1000 : 0)

      // Auto-mark complete when 90% watched
      if (status.durationMillis && status.positionMillis) {
        const progress =
          (status.positionMillis / status.durationMillis) * 100
        if (progress >= 90) {
          markLessonComplete()
        }
      }
    }
  }

  async function markLessonComplete() {
    // TODO: Implement progress tracking
    console.log('Lesson complete!')
  }

  async function toggleFullscreen() {
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      )
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      )
    }
    setIsFullscreen(!isFullscreen)
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading || !lesson) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    )
  }

  const { width } = Dimensions.get('window')
  const videoHeight = (width * 9) / 16 // 16:9 aspect ratio

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Video Player */}
      <View style={[styles.videoContainer, { height: videoHeight }]}>
        {lesson.video_url ? (
          <Video
            ref={videoRef}
            source={{ uri: lesson.video_url }}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />
        ) : (
          <View style={styles.placeholderVideo}>
            <Text style={styles.placeholderEmoji}>🎥</Text>
            <Text style={styles.placeholderText}>
              Video coming soon!
            </Text>
          </View>
        )}
      </View>

      {/* Lesson Info */}
      <View style={styles.content}>
        <Text style={styles.title}>{lesson.title}</Text>

        {lesson.description && (
          <Text style={styles.description}>{lesson.description}</Text>
        )}

        {/* Progress */}
        {duration > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(position / duration) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {formatTime(position)} / {formatTime(duration)}
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Mark as Complete"
            onPress={markLessonComplete}
            fullWidth
            variant="primary"
          />

          <Button
            title="Next Lesson"
            onPress={() => {
              // TODO: Navigate to next lesson
              router.back()
            }}
            fullWidth
            variant="outline"
          />
        </View>
      </View>
    </View>
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

  backButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },

  backButtonText: {
    fontSize: typography.sizes.base,
    color: colors.primary[400],
    fontWeight: '600',
  },

  videoContainer: {
    width: '100%',
    backgroundColor: colors.neutral[950],
  },

  video: {
    width: '100%',
    height: '100%',
  },

  placeholderVideo: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.tertiary,
  },

  placeholderEmoji: {
    fontSize: 64,
    marginBottom: spacing[3],
  },

  placeholderText: {
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
  },

  content: {
    flex: 1,
    padding: spacing[4],
  },

  title: {
    fontSize: typography.sizes['3xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[3],
    lineHeight: typography.lineHeights.tight * typography.sizes['3xl'],
  },

  description: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginBottom: spacing[6],
    lineHeight: typography.lineHeights.normal * typography.sizes.base,
  },

  progressContainer: {
    marginBottom: spacing[6],
  },

  progressBar: {
    height: 4,
    backgroundColor: colors.background.tertiary,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing[2],
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
  },

  progressText: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },

  actions: {
    gap: spacing[3],
  },
})
