import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { colors, typography, spacing, radius, shadows } from '../constants/theme'
import Button from './Button'

interface PremiumLockProps {
  title?: string
  description?: string
  onUpgrade?: () => void
}

export default function PremiumLock({
  title = 'Premium Content',
  description = 'Upgrade to Premium to unlock this content and access all advanced features.',
  onUpgrade,
}: PremiumLockProps) {
  const router = useRouter()

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    } else {
      router.push('/subscription')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.lockIcon}>
        <Text style={styles.lockEmoji}>🔒</Text>
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <Button
        title="Upgrade to Premium"
        onPress={handleUpgrade}
        variant="primary"
        fullWidth
      />

      <View style={styles.features}>
        <View style={styles.featureRow}>
          <Text style={styles.featureCheck}>✓</Text>
          <Text style={styles.featureText}>All premium courses</Text>
        </View>
        <View style={styles.featureRow}>
          <Text style={styles.featureCheck}>✓</Text>
          <Text style={styles.featureText}>Advanced techniques</Text>
        </View>
        <View style={styles.featureRow}>
          <Text style={styles.featureCheck}>✓</Text>
          <Text style={styles.featureText}>Spaced repetition</Text>
        </View>
        <View style={styles.featureRow}>
          <Text style={styles.featureCheck}>✓</Text>
          <Text style={styles.featureText}>Priority support</Text>
        </View>
      </View>

      <Text style={styles.priceText}>Starting at $9.99/month</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
    backgroundColor: colors.background.primary,
  },

  lockIcon: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
    ...shadows.lg,
  },

  lockEmoji: {
    fontSize: 48,
  },

  title: {
    fontSize: typography.sizes['3xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[3],
    textAlign: 'center',
  },

  description: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[6],
    lineHeight: typography.lineHeights.normal * typography.sizes.base,
    paddingHorizontal: spacing[4],
  },

  features: {
    width: '100%',
    marginTop: spacing[6],
    marginBottom: spacing[4],
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },

  featureCheck: {
    fontSize: typography.sizes.lg,
    color: colors.primary[500],
    marginRight: spacing[3],
    width: 24,
  },

  featureText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },

  priceText: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
})
