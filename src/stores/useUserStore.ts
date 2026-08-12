import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { UserProfile } from '@/types/user';

import { apiRequest } from '@/services/api';
import { API_CONFIG } from '@/services/config';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

interface UserState {
  streak: number;
  lastCompletedAt: string | null;
  hasScannedPlan: boolean;
  planId: string | null;
  profile: UserProfile | null;
  setPlanScanned: (planId: string) => void;
  setProfile: (profile: UserProfile) => void;
  setStreak: (streak: number) => void;
  updateProfile: (updates: {
    name?: string;
    goal?: 'lose' | 'maintain' | 'gain';
    goals?: string[];
    allergies?: string[];
  }) => Promise<void>;
  registerCompletion: () => void;
  resetStreak: () => void;
  _hasHydrated: boolean;
  _setHydrated: (v: boolean) => void;
}

function isStreakStillValid(lastCompletedAt: string | null, currentStreak: number): boolean {
  if (!lastCompletedAt || currentStreak === 0) return false;
  const last = new Date(lastCompletedAt).getTime();
  const now = Date.now();
  return now - last <= ONE_DAY_MS * 2;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      streak: 0,
      lastCompletedAt: null,
      hasScannedPlan: false,
      planId: null,
      profile: null,
      _hasHydrated: false,
      _setHydrated: (v) => set({ _hasHydrated: v }),
      setPlanScanned: (planId) => set({ hasScannedPlan: true, planId }),
      setProfile: (profile) => set({ profile }),
      setStreak: (streak) => set({ streak }),
      updateProfile: async (updates) => {
        const current = get().profile;
        const updated = { ...current, ...updates } as UserProfile;

        // Import useAuthStore dynamically to avoid circular import dependency
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { useAuthStore } = require('./useAuthStore');

        if (API_CONFIG.useMocks) {
          set({ profile: updated });
          useAuthStore.setState((s: any) => ({
            user: s.user ? { ...s.user, ...updates } : null,
          }));
          return;
        }

        try {
          const res = await apiRequest<{ user: UserProfile }>('/users/profile', {
            method: 'PUT',
            body: updates,
          });
          const finalProfile = res?.user ?? updated;
          set({ profile: finalProfile, streak: finalProfile.streak ?? get().streak });
          useAuthStore.setState((s: any) => ({
            user: s.user ? { ...s.user, ...updates } : null,
          }));
        } catch {
          set({ profile: updated });
          useAuthStore.setState((s: any) => ({
            user: s.user ? { ...s.user, ...updates } : null,
          }));
        }
      },
      registerCompletion: () => {
        const { lastCompletedAt, streak } = get();
        const now = new Date().toISOString();
        if (lastCompletedAt) {
          const last = new Date(lastCompletedAt).getTime();
          const diff = Date.now() - last;
          if (diff < ONE_DAY_MS) {
            set({ lastCompletedAt: now });
            return;
          }
          if (diff > ONE_DAY_MS * 2) {
            set({ streak: 1, lastCompletedAt: now });
            return;
          }
        }
        set({ streak: streak + 1, lastCompletedAt: now });
      },
      resetStreak: () => set({ streak: 0, lastCompletedAt: null }),
    }),

    {
      name: 'mavi.user',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        streak: state.streak,
        lastCompletedAt: state.lastCompletedAt,
        hasScannedPlan: state.hasScannedPlan,
        planId: state.planId,
        profile: state.profile,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!isStreakStillValid(state.lastCompletedAt, state.streak)) {
          state.streak = 0;
          state.lastCompletedAt = null;
        }
        state._setHydrated(true);
      },
    },
  ),
);

export { isStreakStillValid };
