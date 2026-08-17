import Constants from 'expo-constants';

function getLocalBackendUrl(): string {
  // 1. Prioridad: Variable de entorno explícita (EXPO_PUBLIC_API_URL en .env)
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) return envUrl.trim();

  // Configuración manual en app.json (extra.apiUrl)
  const configuredUrl = (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl;
  if (configuredUrl) return configuredUrl;

  // 2. Extraer automáticamente la IP local de tu PC desde Expo Go en desarrollo
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:3000/api`;
    }
  }

  return 'http://localhost:3000/api';
}

const envUseMocks = process.env.EXPO_PUBLIC_USE_MOCKS;
const envTimeout = process.env.EXPO_PUBLIC_API_TIMEOUT_MS;

export const API_CONFIG = {
  baseUrl: getLocalBackendUrl(),
  useMocks: envUseMocks !== undefined ? envUseMocks === 'true' : false,
  timeoutMs: envTimeout ? parseInt(envTimeout, 10) : 15_000,
  appName: process.env.EXPO_PUBLIC_APP_NAME ?? 'MAVI',
  appVersion: process.env.EXPO_PUBLIC_APP_VERSION ?? '1.0.0',
} as const;
