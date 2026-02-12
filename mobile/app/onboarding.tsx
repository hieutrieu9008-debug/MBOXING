import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import { colors, typography, spacing, layout, radius } from '../constants/theme'
import Button from '../components/Button'

const { width } = Dimensions.get('window')

interface OnboardingSlide {
  emoji: string
  title: string
  description: string
}

const slides: OnboardingSlide[] = [
  {
    emoji: '🥊',
    title: 'Welcome to MBOXING',
    description: 'Learn boxing from Coach Mustafa with structured courses and personalized training.',
  },
  {
    emoji: '📺',
    title: 'Watch & Learn',
    description: 'Access premium video courses covering fundamentals to advanced techniques.',
  },
  {
    emoji: '📊',
    title: 'Track Progress',
    description: 'Monitor your journey with activity heatmaps, streaks, and detailed stats.',
  },
  {
    emoji: '🎯',
    title: 'Practice Drills',
    description: 'Log reps and let our spaced repetition system optimize your training schedule.',
  },
  {
    emoji: '🏆',
    title: 'Level Up',
    description: 'Stay consistent, build streaks, and become the fighter you want to be.',
  },
]

export default function OnboardingScreen() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentSlide = slides[currentIndex]
  const isLastSlide = currentIndex === slides.length - 1

  function handleNext() {
    if (isLastSlide) {
      // Mark onboarding as complete and navigate to main app
      // TODO: Save to AsyncStorage or Supabase
      router.replace('/(tabs)')
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  function handleSkip() {
    router.replace('/(tabs)')
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{currentSlide.emoji}</Text>
        </View>

        <Text style={styles.title}>{currentSlide.title}</Text>
        <Text style={styles.description}>{currentSlide.description}</Text>
      </View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={isLastSlide ? "Let's Go! 🥊" : 'Next'}
          onPress={handleNext}
          fullWidth
          size="lg"
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  skipButton: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    padding: spacing[2],
    zIndex: 10,
  },

  skipText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    fontWeight: '600',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
  },

  emojiContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[8],
  },

  emoji: {
    fontSize: 80,
  },

  title: {
    fontSize: typography.sizes['4xl'],
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[4],
    lineHeight: typography.lineHeights.tight * typography.sizes['4xl'],
  },

  description: {
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.sizes.lg,
    paddingHorizontal: spacing[4],
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
    marginBottom: spacing[8],
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background.tertiary,
  },

  dotActive: {
    backgroundColor: colors.primary[500],
    width: 24,
  },

  buttonContainer: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing[6],
  },
})
