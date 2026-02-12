import { Alert, Platform } from 'react-native'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  title: string
  message?: string
  type?: ToastType
}

/**
 * Show a toast message
 * On mobile: Uses native Alert
 * Can be enhanced with a library like react-native-toast-message
 */
export function showToast({ title, message, type = 'info' }: ToastOptions) {
  // Add emoji based on type
  let emoji = ''
  switch (type) {
    case 'success':
      emoji = '✅ '
      break
    case 'error':
      emoji = '❌ '
      break
    case 'warning':
      emoji = '⚠️ '
      break
    case 'info':
      emoji = 'ℹ️ '
      break
  }

  if (Platform.OS === 'web') {
    // For web, we could use a custom toast component
    // For now, use browser alert
    alert(`${emoji}${title}${message ? '\n' + message : ''}`)
  } else {
    // For mobile, use native Alert
    Alert.alert(`${emoji}${title}`, message)
  }
}

/**
 * Show success toast
 */
export function showSuccess(title: string, message?: string) {
  showToast({ title, message, type: 'success' })
}

/**
 * Show error toast
 */
export function showError(title: string, message?: string) {
  showToast({ title, message, type: 'error' })
}

/**
 * Show info toast
 */
export function showInfo(title: string, message?: string) {
  showToast({ title, message, type: 'info' })
}

/**
 * Show warning toast
 */
export function showWarning(title: string, message?: string) {
  showToast({ title, message, type: 'warning' })
}
