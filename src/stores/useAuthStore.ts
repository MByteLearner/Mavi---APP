import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest, ApiError } from '@/services/api';
import { API_CONFIG } from '@/services/config';
import { saveAuthToken, removeAuthToken } from '@/services/storage';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  goal?: 'lose' | 'maintain' | 'gain';
  goals?: string[];
  allergies?: string[];
  restrictions?: string[];
  streak?: number;
  createdAt?: string;
  avatarUrl?: string;
  guideline?: {
    id: string;
    userId: string;
    allowedIngredients: string[];
    restrictions: string[];
  } | null;
}

export interface RegisterInput {
  name: string;
  email: string;
  password?: string;
  goal?: 'lose' | 'maintain' | 'gain';
  goals?: string[];
  allergies?: string[];
  restrictions?: string[];
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  _hasHydrated: boolean;
  _setHydrated: (v: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginAsDemo: () => Promise<void>;
  register: (input: RegisterInput) => Promise<{ success: boolean; message?: string }>;
  fetchMe: () => Promise<void>;
  logout: () => void;
}

const DEFAULT_DEMO_USER: AuthUser = {
  id: 'user-demo-1',
  name: 'María García',
  email: 'maria.garcia@mavi.app',
  goal: 'maintain',
  goals: ['Mantener peso saludable'],
  allergies: [],
  restrictions: ['Sin TACC', 'Bajo en sodio'],
  streak: 5,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      _hasHydrated: false,
      _setHydrated: (v) => set({ _hasHydrated: v }),

      login: async (email, password) => {
        if (!email.trim() || !password.trim()) {
          return { success: false, message: 'Por favor completá todos los campos' };
        }

        if (password.length < 4) {
          return { success: false, message: 'La contraseña debe tener al menos 4 caracteres' };
        }

        if (API_CONFIG.useMocks) {
          await new Promise((r) => setTimeout(r, 800));

          const nameFromEmail = email.split('@')[0] ?? 'Usuario';
          const formattedName =
            nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1).replace('.', ' ');

          const loggedUser: AuthUser = {
            id: `user-${Date.now()}`,
            name: email.toLowerCase() === 'maria.garcia@mavi.app' ? 'María García' : formattedName,
            email: email.trim().toLowerCase(),
            goal: 'maintain',
            goals: ['Mantener peso saludable'],
            restrictions: ['Sin TACC'],
            streak: 5,
          };

          await saveAuthToken('mock-jwt-token');
          set({ isAuthenticated: true, user: loggedUser });
          return { success: true };
        }

        try {
          const data = await apiRequest<AuthResponse>('/auth/login', {
            method: 'POST',
            body: { email: email.trim(), password },
          });

          await saveAuthToken(data.token);
          set({ isAuthenticated: true, user: data.user });
          return { success: true };
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : 'Error al iniciar sesión';
          return { success: false, message: msg };
        }
      },

      loginAsDemo: async () => {
        await new Promise((r) => setTimeout(r, 600));
        await saveAuthToken('mock-demo-jwt-token');
        set({ isAuthenticated: true, user: DEFAULT_DEMO_USER });
      },

      register: async (input) => {
        if (!input.name.trim() || !input.email.trim()) {
          return { success: false, message: 'Por favor completá los campos obligatorios' };
        }

        if (API_CONFIG.useMocks) {
          await new Promise((r) => setTimeout(r, 900));

          const newUser: AuthUser = {
            id: `user-${Date.now()}`,
            name: input.name.trim(),
            email: input.email.trim().toLowerCase(),
            goal: input.goal ?? 'maintain',
            goals: input.goals ?? [],
            allergies: input.allergies ?? [],
            restrictions: input.restrictions ?? [],
            streak: 0,
          };

          await saveAuthToken('mock-jwt-token');
          set({ isAuthenticated: true, user: newUser });
          return { success: true };
        }

        try {
          const data = await apiRequest<AuthResponse>('/auth/register', {
            method: 'POST',
            body: {
              email: input.email.trim(),
              password: input.password ?? '123456',
              name: input.name.trim(),
              goals: input.goals ?? (input.goal ? [input.goal] : []),
              allergies: input.allergies ?? [],
            },
          });

          await saveAuthToken(data.token);
          set({ isAuthenticated: true, user: data.user });
          return { success: true };
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : 'Error al registrarse';
          return { success: false, message: msg };
        }
      },

      fetchMe: async () => {
        if (API_CONFIG.useMocks) return;
        try {
          const res = await apiRequest<{ user: AuthUser }>('/auth/me');
          if (res?.user) {
            set({ user: res.user, isAuthenticated: true });
          }
        } catch {
          // Keep current state on error
        }
      },

      logout: () => {
        void removeAuthToken();
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

