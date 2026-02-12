/**
 * Input Validation Library
 * Uses simple validation rules to prevent injection attacks and data corruption
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password requirements
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 100

// Text input limits
const TEXT_MAX_LENGTH = 1000
const NOTES_MAX_LENGTH = 500
const TITLE_MAX_LENGTH = 100

// Number limits
const REPS_MIN = 1
const REPS_MAX = 10000
const DURATION_MIN = 0
const DURATION_MAX = 86400 // 24 hours in seconds

/**
 * Validate email address
 */
export function validateEmail(email: string): {
  valid: boolean
  error?: string
} {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' }
  }

  const trimmed = email.trim()

  if (trimmed.length === 0) {
    return { valid: false, error: 'Email is required' }
  }

  if (trimmed.length > 255) {
    return { valid: false, error: 'Email is too long' }
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' }
  }

  return { valid: true }
}

/**
 * Validate password
 */
export function validatePassword(password: string): {
  valid: boolean
  error?: string
} {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' }
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    }
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return { valid: false, error: 'Password is too long' }
  }

  // Check for at least one number or special character (recommended)
  if (!/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      error: 'Password should contain at least one number or special character',
    }
  }

  return { valid: true }
}

/**
 * Sanitize text input (prevent XSS)
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  return text
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate text input
 */
export function validateText(
  text: string,
  options?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    fieldName?: string
  }
): {
  valid: boolean
  error?: string
  sanitized: string
} {
  const fieldName = options?.fieldName || 'Text'
  const required = options?.required ?? true
  const minLength = options?.minLength ?? 1
  const maxLength = options?.maxLength ?? TEXT_MAX_LENGTH

  if (!text || typeof text !== 'string') {
    if (required) {
      return { valid: false, error: `${fieldName} is required`, sanitized: '' }
    }
    return { valid: true, sanitized: '' }
  }

  const trimmed = text.trim()

  if (required && trimmed.length === 0) {
    return { valid: false, error: `${fieldName} is required`, sanitized: '' }
  }

  if (trimmed.length < minLength) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
      sanitized: trimmed,
    }
  }

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} must be less than ${maxLength} characters`,
      sanitized: trimmed,
    }
  }

  const sanitized = sanitizeText(trimmed)

  return { valid: true, sanitized }
}

/**
 * Validate number input
 */
export function validateNumber(
  value: any,
  options?: {
    required?: boolean
    min?: number
    max?: number
    integer?: boolean
    fieldName?: string
  }
): {
  valid: boolean
  error?: string
  value: number | null
} {
  const fieldName = options?.fieldName || 'Number'
  const required = options?.required ?? true
  const min = options?.min ?? -Infinity
  const max = options?.max ?? Infinity
  const integer = options?.integer ?? false

  if (value === null || value === undefined || value === '') {
    if (required) {
      return { valid: false, error: `${fieldName} is required`, value: null }
    }
    return { valid: true, value: null }
  }

  const num = Number(value)

  if (isNaN(num)) {
    return { valid: false, error: `${fieldName} must be a valid number`, value: null }
  }

  if (integer && !Number.isInteger(num)) {
    return { valid: false, error: `${fieldName} must be a whole number`, value: null }
  }

  if (num < min) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${min}`,
      value: num,
    }
  }

  if (num > max) {
    return {
      valid: false,
      error: `${fieldName} must be no more than ${max}`,
      value: num,
    }
  }

  return { valid: true, value: num }
}

/**
 * Validate drill reps input
 */
export function validateReps(reps: any): {
  valid: boolean
  error?: string
  value: number | null
} {
  return validateNumber(reps, {
    required: true,
    min: REPS_MIN,
    max: REPS_MAX,
    integer: true,
    fieldName: 'Reps',
  })
}

/**
 * Validate notes input
 */
export function validateNotes(notes: string): {
  valid: boolean
  error?: string
  sanitized: string
} {
  return validateText(notes, {
    required: false,
    maxLength: NOTES_MAX_LENGTH,
    fieldName: 'Notes',
  })
}

/**
 * Validate title input
 */
export function validateTitle(title: string): {
  valid: boolean
  error?: string
  sanitized: string
} {
  return validateText(title, {
    required: true,
    minLength: 3,
    maxLength: TITLE_MAX_LENGTH,
    fieldName: 'Title',
  })
}

/**
 * Validate video duration
 */
export function validateDuration(duration: any): {
  valid: boolean
  error?: string
  value: number | null
} {
  return validateNumber(duration, {
    required: true,
    min: DURATION_MIN,
    max: DURATION_MAX,
    integer: true,
    fieldName: 'Duration',
  })
}

/**
 * Validate quality rating (for spaced repetition)
 */
export function validateQualityRating(rating: any): {
  valid: boolean
  error?: string
  value: number | null
} {
  return validateNumber(rating, {
    required: true,
    min: 0,
    max: 5,
    integer: true,
    fieldName: 'Quality rating',
  })
}

/**
 * Validate URL (for video URLs, etc.)
 */
export function validateURL(url: string): {
  valid: boolean
  error?: string
} {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' }
  }

  const trimmed = url.trim()

  try {
    new URL(trimmed)
    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}

/**
 * Prevent SQL injection by checking for suspicious patterns
 * Note: Supabase client uses parameterized queries, but this adds extra safety
 */
export function detectSQLInjection(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false
  }

  const suspiciousPatterns = [
    /(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\s/gi,
    /--/g, // SQL comments
    /;/g, // Multiple statements
    /\/\*/g, // Block comments
    /\bOR\b.*=.*=/gi, // OR 1=1
    /\bAND\b.*=.*=/gi, // AND 1=1
  ]

  return suspiciousPatterns.some((pattern) => pattern.test(input))
}

/**
 * Comprehensive input sanitization
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Trim whitespace
  let sanitized = input.trim()

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '')

  // Escape HTML entities
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')

  return sanitized
}

/**
 * Validate signup form
 */
export function validateSignupForm(data: {
  email: string
  password: string
  confirmPassword: string
}): {
  valid: boolean
  errors: {
    email?: string
    password?: string
    confirmPassword?: string
  }
} {
  const errors: any = {}

  // Validate email
  const emailResult = validateEmail(data.email)
  if (!emailResult.valid) {
    errors.email = emailResult.error
  }

  // Validate password
  const passwordResult = validatePassword(data.password)
  if (!passwordResult.valid) {
    errors.password = passwordResult.error
  }

  // Validate confirm password
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate login form
 */
export function validateLoginForm(data: {
  email: string
  password: string
}): {
  valid: boolean
  errors: {
    email?: string
    password?: string
  }
} {
  const errors: any = {}

  // Validate email
  const emailResult = validateEmail(data.email)
  if (!emailResult.valid) {
    errors.email = emailResult.error
  }

  // Check password is not empty (don't validate strength on login)
  if (!data.password || data.password.trim().length === 0) {
    errors.password = 'Password is required'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
