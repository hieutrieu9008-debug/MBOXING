import React, { useState } from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native'
import { colors, typography, spacing, radius } from '@/constants/theme'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerStyle?: object
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  secureTextEntry,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const showPassword = secureTextEntry && !isPasswordVisible
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible)

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={styles.input}
          placeholderTextColor={colors.text.tertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={showPassword}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.rightIcon}
          >
            <Text style={styles.passwordToggle}>
              {isPasswordVisible ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },

  label: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border.subtle,
    paddingHorizontal: spacing[3],
  },

  inputContainerFocused: {
    borderColor: colors.primary[500],
  },

  inputContainerError: {
    borderColor: colors.error,
  },

  input: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.text.primary,
    paddingVertical: spacing[3],
    minHeight: 48,
  },

  leftIcon: {
    marginRight: spacing[2],
  },

  rightIcon: {
    marginLeft: spacing[2],
  },

  passwordToggle: {
    fontSize: 20,
    padding: spacing[1],
  },

  errorText: {
    fontSize: typography.sizes.sm,
    color: colors.error,
    marginTop: spacing[1],
  },

  helperText: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    marginTop: spacing[1],
  },
})
