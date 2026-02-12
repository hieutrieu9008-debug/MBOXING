import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, typography, spacing } from '../constants/theme'
import Button from './Button'

interface EmptyStateProps {
  emoji: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  emoji,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[20],
    paddingHorizontal: spacing[8],
  },

  emoji: {
    fontSize: 64,
    marginBottom: spacing[4],
  },

  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[2],
    textAlign: 'center',
  },

  description: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[6],
    lineHeight: typography.lineHeights.normal * typography.sizes.base,
  },
})
