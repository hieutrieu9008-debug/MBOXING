import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { colors, typography, spacing, radius, shadows } from '@/constants/theme'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  style?: ViewStyle
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const buttonStyle: ViewStyle[] = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ]

  const textStyle: TextStyle[] = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
  ]

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.neutral[0] : colors.primary[500]}
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // Variants
  primary: {
    backgroundColor: colors.primary[500],
    ...shadows.base,
  },

  secondary: {
    backgroundColor: colors.accent[500],
    ...shadows.base,
  },

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary[500],
  },

  ghost: {
    backgroundColor: 'transparent',
  },

  // Sizes
  size_sm: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    minHeight: 36,
  },

  size_md: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    minHeight: 48,
  },

  size_lg: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    minHeight: 56,
  },

  // States
  disabled: {
    opacity: 0.5,
  },

  fullWidth: {
    width: '100%',
  },

  // Text styles
  text: {
    fontWeight: '600',
  },

  text_primary: {
    color: colors.neutral[0],
  },

  text_secondary: {
    color: colors.neutral[0],
  },

  text_outline: {
    color: colors.primary[500],
  },

  text_ghost: {
    color: colors.text.primary,
  },

  text_sm: {
    fontSize: typography.sizes.sm,
  },

  text_md: {
    fontSize: typography.sizes.base,
  },

  text_lg: {
    fontSize: typography.sizes.lg,
  },

  textDisabled: {
    opacity: 0.7,
  },
})
