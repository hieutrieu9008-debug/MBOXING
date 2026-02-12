import React, { Component, ReactNode } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, typography, spacing, radius } from '../constants/theme'
import Button from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // TODO: Log to error tracking service (Sentry, etc.)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>😔</Text>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.description}>
              We're sorry for the inconvenience. Please try again.
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}

            <Button
              title="Try Again"
              onPress={this.handleReset}
              fullWidth
              variant="primary"
            />
          </View>
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },

  content: {
    alignItems: 'center',
    width: '100%',
  },

  emoji: {
    fontSize: 64,
    marginBottom: spacing[6],
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
  },

  errorBox: {
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    padding: spacing[4],
    marginBottom: spacing[6],
    width: '100%',
  },

  errorText: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    fontFamily: 'monospace',
  },
})
