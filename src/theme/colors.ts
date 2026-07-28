export const colors = {
  primary: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },
  surface: {
    light: '#FFFFFF',
    muted: '#F9FAFB',
    dark: '#0A0A0A',
    darkMuted: '#111111',
    darkAlt: '#1F2937',
  },
  text: {
    primaryLight: '#111827',
    primaryDark: '#FFFFFF',
    secondaryLight: '#6B7280',
    secondaryDark: '#9CA3AF',
    tertiary: '#9CA3AF',
  },
  border: {
    light: '#F3F4F6',
    dark: '#1F2937',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
} as const;
