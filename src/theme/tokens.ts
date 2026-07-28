import { useThemeStore } from '@/stores/useThemeStore';

export interface PaletteColors {
  primary: string;
  primaryDark: string;
  primarySoft: string;
  primaryMint: string;
  secondary: string;
  secondarySoft: string;
  secondaryDark: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  info: string;
  infoSoft: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textInverse: string;
  border: string;
  divider: string;
  overlay: string;
  darkBackground: string;
  darkSurface: string;
  darkSurfaceAlt: string;
  darkText: string;
  darkTextSecondary: string;
  darkBorder: string;
}

export const lightPalette: PaletteColors = {
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primarySoft: '#E8F5E9',
  primaryMint: '#A5D6A7',

  secondary: '#FF9800',
  secondarySoft: '#FFF3E0',
  secondaryDark: '#E65100',

  success: '#10B981',
  successSoft: '#D1FAE5',
  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  error: '#EF4444',
  errorSoft: '#FEE2E2',
  info: '#3B82F6',
  infoSoft: '#EFF6FF',

  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F5F5',

  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  textInverse: '#FFFFFF',

  border: '#E5E7EB',
  divider: '#F3F4F6',
  overlay: 'rgba(0,0,0,0.4)',

  darkBackground: '#0E0E0E',
  darkSurface: '#1A1A1A',
  darkSurfaceAlt: '#222222',
  darkText: '#F5F5F5',
  darkTextSecondary: '#A3A3A3',
  darkBorder: '#2A2A2A',
};

export const darkPalette: PaletteColors = {
  ...lightPalette,
  primary: '#4CAF50',
  primaryDark: '#2E7D32',
  primarySoft: '#1B381E',
  primaryMint: '#81C784',

  secondary: '#FFB74D',
  secondarySoft: '#3E2723',
  secondaryDark: '#F57C00',

  background: '#0E0E0E',
  surface: '#1A1A1A',
  surfaceAlt: '#242424',

  textPrimary: '#F5F5F5',
  textSecondary: '#A3A3A3',
  textDisabled: '#616161',
  textInverse: '#1A1A1A',

  border: '#2A2A2A',
  divider: '#222222',
  overlay: 'rgba(0,0,0,0.7)',
};

/**
 * Proxy object for backwards compatibility.
 * Evaluates palette tokens dynamically based on current useThemeStore state.
 */
export const palette: PaletteColors = new Proxy({} as PaletteColors, {
  get(_target, prop: keyof PaletteColors) {
    const resolved = useThemeStore.getState().resolved;
    const current = resolved === 'dark' ? darkPalette : lightPalette;
    return current[prop];
  },
});

export function useThemeColors(): PaletteColors {
  const resolved = useThemeStore((s) => s.resolved);
  return resolved === 'dark' ? darkPalette : lightPalette;
}

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
  xl: 20,
  button: 18,
  card: 20,
  bottomSheet: 28,
  modal: 26,
  pill: 999,
} as const;

export const typography = {
  display: { fontFamily: 'Fraunces_700Bold', fontSize: 40, lineHeight: 44, letterSpacing: -1 },
  displaySoft: { fontFamily: 'Fraunces_500Medium', fontSize: 40, lineHeight: 44, letterSpacing: -0.8 },
  serif: { fontFamily: 'Fraunces_400Regular', fontSize: 18, lineHeight: 28 },
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
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 8,
  },
  orange: {
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const layout = {
  screenPadding: 24,
  minTouchTarget: 48,
  appBarHeight: 64,
  tabBarHeight: 84,
} as const;
