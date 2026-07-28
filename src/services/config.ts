import Constants from 'expo-constants';

export const API_CONFIG = {
  baseUrl:
    (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ??
    'http://localhost:3000/api',
  useMocks: ((Constants.expoConfig?.extra as { useMocks?: boolean } | undefined)?.useMocks ??
    true) as boolean,
  timeoutMs: 15_000,
} as const;
