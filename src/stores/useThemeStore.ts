import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeState {
  /** User preference: 'system' follows device, 'light'/'dark' forces a mode */
  mode: ThemeMode;
  /** Resolved scheme that components should actually use */
  resolved: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  _hasHydrated: boolean;
  _setHydrated: (v: boolean) => void;
}

function resolve(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  }
  return mode;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system' as ThemeMode,
      resolved: resolve('system'),
      _hasHydrated: false,
      _setHydrated: (v) => set({ _hasHydrated: v }),

      setMode: (mode) => {
        set({ mode, resolved: resolve(mode) });
      },
    }),
    {
      name: 'mavi.theme',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ mode: state.mode }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._setHydrated(true);
          // re-resolve on rehydrate
          state.resolved = resolve(state.mode);
        }
      },
    },
  ),
);
