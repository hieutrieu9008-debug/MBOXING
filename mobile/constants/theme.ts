/**
 * DESIGN SYSTEM - Mustafa's Boxing App
 * Premium, professional, intensity-focused
 */

// COLOR PALETTE
export const colors = {
  // Primary: Boxing Red (intensity, power)
  primary: {
    50: '#FFF1F0',
    100: '#FFE1DE',
    200: '#FFC7C2',
    300: '#FFA199',
    400: '#FF6B5E',
    500: '#FF4433', // Main brand color
    600: '#ED2615',
    700: '#C8190B',
    800: '#A5180D',
    900: '#881A12',
  },

  // Accent: Gold (championship, achievement)
  accent: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Main accent
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Neutrals: Dark mode friendly
  neutral: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937', // Dark backgrounds
    900: '#111827',
    950: '#030712', // Darkest
  },

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // App-specific
  background: {
    primary: '#030712', // Almost black
    secondary: '#111827', // Dark gray
    tertiary: '#1F2937', // Lighter gray
    card: '#1F2937',
  },

  text: {
    primary: '#F9FAFB', // Almost white
    secondary: '#D1D5DB', // Light gray
    tertiary: '#9CA3AF', // Medium gray
    disabled: '#6B7280',
  },

  border: {
    subtle: '#374151',
    default: '#4B5563',
    strong: '#6B7280',
  },
}

// TYPOGRAPHY
export const typography = {
  fonts: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },

  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
}

// SPACING (4px grid system)
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
}

// BORDER RADIUS
export const radius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
}

// SHADOWS (for cards, buttons)
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
}

// LAYOUT
export const layout = {
  screenPadding: spacing[4], // 16px
  cardPadding: spacing[4], // 16px
  sectionSpacing: spacing[6], // 24px
  maxContentWidth: 640,
}

// ANIMATION DURATIONS
export const animation = {
  fast: 150,
  base: 250,
  slow: 350,
}

// Export as default theme object
export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  layout,
  animation,
}

export default theme

// Backwards compatibility exports for old code
export const COLORS = {
  background: colors.background.primary,
  text: colors.text.primary,
  textMuted: colors.text.secondary,
  primary: colors.primary[500],
  card: colors.background.card,
  border: colors.border.default,
}

export const SIZES = typography.sizes
