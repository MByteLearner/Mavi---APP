import { useThemeStore } from '@/stores/useThemeStore';

export type ColorScheme = 'light' | 'dark';

export function useColorScheme(): ColorScheme {
  const resolved = useThemeStore((s) => s.resolved);
  return resolved;
}

export function isDark(scheme: ColorScheme): boolean {
  return scheme === 'dark';
}
