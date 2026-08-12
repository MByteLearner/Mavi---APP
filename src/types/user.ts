import type { Guideline } from './plan';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  goal?: 'lose' | 'maintain' | 'gain';
  goals?: string[];
  allergies?: string[];
  dailyCalories?: number;
  streak?: number;
  createdAt?: string;
  guideline?: Guideline | null;
}

export interface UserPersistedState {
  streak: number;
  lastCompletedAt: string | null;
  hasScannedPlan: boolean;
  planId: string | null;
  profile: UserProfile | null;
}

