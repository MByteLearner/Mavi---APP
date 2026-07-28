export interface UserProfile {
  id: string;
  name: string;
  goal: 'lose' | 'maintain' | 'gain';
  dailyCalories: number;
}

export interface UserPersistedState {
  streak: number;
  lastCompletedAt: string | null;
  hasScannedPlan: boolean;
  planId: string | null;
  profile: UserProfile | null;
}
