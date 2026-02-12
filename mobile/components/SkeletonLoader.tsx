import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { colors, spacing, radius } from '../constants/theme'

interface SkeletonLoaderProps {
  width?: number | string
  height?: number
  borderRadius?: number
  marginBottom?: number
}

export default function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = radius.md,
  marginBottom = spacing[2],
}: SkeletonLoaderProps) {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    )

    animation.start()

    return () => animation.stop()
  }, [opacity])

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          marginBottom,
          opacity,
        },
      ]}
    />
  )
}

export function CourseCardSkeleton() {
  return (
    <View style={styles.courseCard}>
      <SkeletonLoader height={180} marginBottom={spacing[3]} />
      <SkeletonLoader width="60%" height={16} marginBottom={spacing[2]} />
      <SkeletonLoader width="100%" height={14} marginBottom={spacing[2]} />
      <SkeletonLoader width="80%" height={14} marginBottom={spacing[3]} />
      <View style={styles.row}>
        <SkeletonLoader width={60} height={24} marginBottom={0} />
        <SkeletonLoader width={80} height={24} marginBottom={0} />
      </View>
    </View>
  )
}

export function DrillCardSkeleton() {
  return (
    <View style={styles.drillCard}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <SkeletonLoader width="70%" height={18} marginBottom={spacing[2]} />
          <SkeletonLoader width="40%" height={12} marginBottom={0} />
        </View>
        <SkeletonLoader width={60} height={60} marginBottom={0} borderRadius={radius.md} />
      </View>
      <SkeletonLoader width="100%" height={14} marginBottom={spacing[2]} />
      <SkeletonLoader width="50%" height={12} marginBottom={0} />
    </View>
  )
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.background.tertiary,
  },

  courseCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },

  drillCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing[4],
    marginBottom: spacing[3],
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
