/**
 * Mustafa's Boxing - Design System Theme
 * Based on mockup designs with Championship Gold accent
 */

export const COLORS = {
  // Core colors
  background: '#000000',
  primary: '#D4AF37',      // Championship Gold
  accent: '#DC143C',       // Crimson Red

  // Text colors
  text: '#FFFFFF',
  textMuted: '#888888',
  textSecondary: '#AAAAAA',

  // UI colors
  card: '#1A1A1A',
  cardHover: '#222222',
  surface: '#1A1A1A',       // Same as card, for surface elements
  border: '#333333',
  primaryLight: '#FFD700',  // Lighter gold for active states

  // Status colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',

  // Difficulty colors
  beginner: '#22C55E',
  intermediate: '#F59E0B',
  advanced: '#EF4444',
};

export const FONTS = {
  // Will use system fonts for now, can add custom fonts later
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Border radius
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,

  // Font sizes
  fontXs: 12,
  fontSm: 14,
  fontMd: 16,
  fontLg: 18,
  fontXl: 24,
  fontXxl: 32,
  fontHero: 48,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Difficulty badge colors
export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return COLORS.beginner;
    case 'intermediate':
      return COLORS.intermediate;
    case 'advanced':
      return COLORS.advanced;
    default:
      return COLORS.primary;
  }
};

// Category icons (for Ionicons)
export const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'boxing':
      return 'fitness';
    case 'footwork':
      return 'footsteps';
    case 'defense':
      return 'shield';
    default:
      return 'flash';
  }
};
