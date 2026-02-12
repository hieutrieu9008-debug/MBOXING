import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { colors, typography, spacing, layout } from '@/constants/theme'

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      Alert.alert('Error', error.message)
    } else {
      // Success - router will handle navigation
      router.replace('/(tabs)')
    }

    setLoading(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>🥊</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your training
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={signInWithEmail}
              loading={loading}
              fullWidth
              size="lg"
              style={styles.signInButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* OR divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social login placeholders (for future) */}
          <View style={styles.socialButtons}>
            <Button
              title="Continue with Apple"
              onPress={() => Alert.alert('Coming Soon', 'Apple sign-in will be available at launch')}
              variant="outline"
              fullWidth
              style={styles.socialButton}
            />
            <Button
              title="Continue with Google"
              onPress={() => Alert.alert('Coming Soon', 'Google sign-in will be available at launch')}
              variant="outline"
              fullWidth
            />
          </View>

          {/* Coach branding */}
          <View style={styles.branding}>
            <Text style={styles.brandingText}>
              Training with Coach Mustafa
            </Text>
            <Text style={styles.brandingSubtext}>
              @mustafasboxing • 470K+ fighters
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    padding: layout.screenPadding,
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },

  emoji: {
    fontSize: 64,
    marginBottom: spacing[4],
  },

  title: {
    fontSize: typography.sizes['4xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },

  subtitle: {
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  form: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing[4],
  },

  forgotPasswordText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[400],
    fontWeight: '600',
  },

  signInButton: {
    marginTop: spacing[2],
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing[6],
    marginBottom: spacing[8],
  },

  footerText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },

  footerLink: {
    fontSize: typography.sizes.base,
    color: colors.primary[400],
    fontWeight: '600',
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing[6],
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.subtle,
  },

  dividerText: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    marginHorizontal: spacing[4],
    fontWeight: '600',
  },

  socialButtons: {
    gap: spacing[3],
    marginBottom: spacing[8],
  },

  socialButton: {
    marginBottom: spacing[3],
  },

  branding: {
    alignItems: 'center',
    marginTop: spacing[6],
  },

  brandingText: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    fontWeight: '600',
  },

  brandingSubtext: {
    fontSize: typography.sizes.xs,
    color: colors.text.tertiary,
    marginTop: spacing[1],
  },
})
