export const palette = {
  // Light
  primary: '#E53935',
  primaryDark: '#C62828',
  primarySoft: '#FFEDED',
  secondary: '#D4AF37',
  secondarySoft: '#FAEFD0',
  success: '#4CAF50',
  successSoft: '#E8F5E9',
  warning: '#FFB300',
  warningSoft: '#FFF8E1',
  error: '#EF5350',
  errorSoft: '#FFEBEE',
  info: '#2196F3',
  infoSoft: '#E3F2FD',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#616161',
  textDisabled: '#9E9E9E',
  textInverse: '#FFFFFF',
  border: '#EEEEEE',
  divider: '#F5F5F5',
  overlay: 'rgba(0,0,0,0.4)',
  // Dark mode (used in components, not in palette.light/dark tokens)
  darkBackground: '#0E0E0E',
  darkSurface: '#1A1A1A',
  darkSurfaceAlt: '#222222',
  darkText: '#F5F5F5',
  darkTextSecondary: '#A3A3A3',
  darkBorder: '#2A2A2A',
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
  // Display: Fraunces serif (editorial, characterful)
  display: { fontFamily: 'Fraunces_700Bold', fontSize: 40, lineHeight: 44, letterSpacing: -1 },
  displaySoft: { fontFamily: 'Fraunces_500Medium', fontSize: 40, lineHeight: 44, letterSpacing: -0.8 },
  serif: { fontFamily: 'Fraunces_400Regular', fontSize: 18, lineHeight: 28 },
  // UI: Geist sans (clean, modern)
  title: { fontFamily: 'Geist_700Bold', fontSize: 28, lineHeight: 34, letterSpacing: -0.3 },
  titleSecondary: { fontFamily: 'Geist_600SemiBold', fontSize: 22, lineHeight: 28 },
  heading: { fontFamily: 'Geist_600SemiBold', fontSize: 18, lineHeight: 24 },
  subheading: { fontFamily: 'Geist_500Medium', fontSize: 16, lineHeight: 22 },
  body: { fontFamily: 'Geist_400Regular', fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: 'Geist_500Medium', fontSize: 16, lineHeight: 24 },
  bodySecondary: { fontFamily: 'Geist_400Regular', fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: 'Geist_400Regular', fontSize: 12, lineHeight: 16 },
  label: { fontFamily: 'Geist_500Medium', fontSize: 11, lineHeight: 14, letterSpacing: 0.5 },
  button: { fontFamily: 'Geist_600SemiBold', fontSize: 15, lineHeight: 20, letterSpacing: 0.2 },
  overline: { fontFamily: 'Geist_600SemiBold', fontSize: 10, lineHeight: 14, letterSpacing: 1.5 },
} as const;

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  lg: {
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 8,
  },
} as const;

export const layout = {
  screenPadding: 24,
  minTouchTarget: 48,
  appBarHeight: 64,
  tabBarHeight: 84,
} as const;
