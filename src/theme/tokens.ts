export const palette = {
  primary: '#E53935',
  primaryDark: '#C62828',
  secondary: '#D4AF37',
  success: '#4CAF50',
  warning: '#FFB300',
  error: '#EF5350',
  info: '#2196F3',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#616161',
  textDisabled: '#9E9E9E',
  textInverse: '#FFFFFF',
  border: '#EEEEEE',
  divider: '#F5F5F5',
  overlay: 'rgba(0,0,0,0.4)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 56,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  button: 18,
  card: 20,
  bottomSheet: 28,
  modal: 26,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 34, fontWeight: '700' as const, lineHeight: 41, letterSpacing: -0.5 },
  title: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34, letterSpacing: -0.3 },
  titleSecondary: { fontSize: 24, fontWeight: '600' as const, lineHeight: 30 },
  heading: { fontSize: 20, fontWeight: '600' as const, lineHeight: 26 },
  subheading: { fontSize: 18, fontWeight: '500' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  bodySecondary: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  label: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16, letterSpacing: 0.3 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
} as const;

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;

export const layout = {
  screenPadding: 24,
  minTouchTarget: 48,
  appBarHeight: 64,
  tabBarHeight: 84,
} as const;
