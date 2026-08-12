import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const StorageKeys = {
  User: 'mavi.user',
  Session: 'mavi.session',
  LastDevice: 'mavi.lastDevice',
  AuthToken: 'mavi.authToken',
} as const;

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // best-effort
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // best-effort
    }
  },
};

export const secureStorage = {
  async get(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') return await AsyncStorage.getItem(key);
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  async set(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem(key, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch {
      // best-effort
    }
  },

  async remove(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(key);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch {
      // best-effort
    }
  },
};

export async function saveAuthToken(token: string): Promise<void> {
  await secureStorage.set(StorageKeys.AuthToken, token);
}

export async function getAuthToken(): Promise<string | null> {
  return secureStorage.get(StorageKeys.AuthToken);
}

export async function removeAuthToken(): Promise<void> {
  await secureStorage.remove(StorageKeys.AuthToken);
}

