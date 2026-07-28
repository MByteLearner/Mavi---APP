import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  goal: 'lose' | 'maintain' | 'gain';
  restrictions: string[];
  avatarUrl?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password?: string;
  goal: 'lose' | 'maintain' | 'gain';
  restrictions: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  _hasHydrated: boolean;
  _setHydrated: (v: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginAsDemo: () => Promise<void>;
  register: (input: RegisterInput) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const DEFAULT_DEMO_USER: AuthUser = {
  id: 'user-demo-1',
  name: 'María García',
  email: 'maria.garcia@mavi.app',
  goal: 'maintain',
  restrictions: ['Sin TACC', 'Bajo en sodio'],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: true, // Default to true for smooth demo experience, can toggle via logout
      user: DEFAULT_DEMO_USER,
      _hasHydrated: false,
      _setHydrated: (v) => set({ _hasHydrated: v }),

      login: async (email, password) => {
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 800));

        if (!email.trim() || !password.trim()) {
          return { success: false, message: 'Por favor completá todos los campos' };
        }

        if (password.length < 4) {
          return { success: false, message: 'La contraseña debe tener al menos 4 caracteres' };
        }

        // Hardcoded auth validation
        const nameFromEmail = email.split('@')[0] ?? 'Usuario';
        const formattedName =
          nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1).replace('.', ' ');

        const loggedUser: AuthUser = {
          id: `user-${Date.now()}`,
          name: email.toLowerCase() === 'maria.garcia@mavi.app' ? 'María García' : formattedName,
          email: email.trim().toLowerCase(),
          goal: 'maintain',
          restrictions: ['Sin TACC'],
        };

        set({ isAuthenticated: true, user: loggedUser });
        return { success: true };
      },

      loginAsDemo: async () => {
        await new Promise((r) => setTimeout(r, 600));
        set({ isAuthenticated: true, user: DEFAULT_DEMO_USER });
      },

      register: async (input) => {
        await new Promise((r) => setTimeout(r, 900));

        if (!input.name.trim() || !input.email.trim()) {
          return { success: false, message: 'Por favor completá los campos obligatorios' };
        }

        const newUser: AuthUser = {
          id: `user-${Date.now()}`,
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          goal: input.goal,
          restrictions: input.restrictions,
        };

        set({ isAuthenticated: true, user: newUser });
        return { success: true };
      },

      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: 'mavi.auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated(true);
      },
    },
  ),
);
