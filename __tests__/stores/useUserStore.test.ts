import { useUserStore, isStreakStillValid } from '@/stores/useUserStore';

const initialState = () => useUserStore.getState();

describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.setState({
      streak: 0,
      lastCompletedAt: null,
      hasScannedPlan: false,
      planId: null,
      profile: null,
    });
  });

  it('setPlanScanned flags the plan and stores the id', () => {
    initialState().setPlanScanned('plan-123');
    const s = useUserStore.getState();
    expect(s.hasScannedPlan).toBe(true);
    expect(s.planId).toBe('plan-123');
  });

  it('registerCompletion increments streak from zero', () => {
    initialState().registerCompletion();
    const s = useUserStore.getState();
    expect(s.streak).toBe(1);
    expect(s.lastCompletedAt).not.toBeNull();
  });

  it('registerCompletion does not double-count within the same day', () => {
    initialState().registerCompletion();
    initialState().registerCompletion();
    initialState().registerCompletion();
    expect(useUserStore.getState().streak).toBe(1);
  });

  it('registerCompletion resets streak if last completion was more than 2 days ago', () => {
    const twoDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    useUserStore.setState({ streak: 5, lastCompletedAt: twoDaysAgo });
    initialState().registerCompletion();
    const s = useUserStore.getState();
    expect(s.streak).toBe(1);
  });

  it('registerCompletion continues streak if within two days', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    useUserStore.setState({ streak: 5, lastCompletedAt: yesterday });
    initialState().registerCompletion();
    expect(useUserStore.getState().streak).toBe(6);
  });

  it('resetStreak zeroes streak and lastCompletedAt', () => {
    useUserStore.setState({ streak: 7, lastCompletedAt: new Date().toISOString() });
    initialState().resetStreak();
    const s = useUserStore.getState();
    expect(s.streak).toBe(0);
    expect(s.lastCompletedAt).toBeNull();
  });

  it('setProfile stores user profile', () => {
    initialState().setProfile({
      id: 'u1',
      name: 'Test',
      goal: 'maintain',
      dailyCalories: 2000,
    });
    expect(useUserStore.getState().profile).toEqual({
      id: 'u1',
      name: 'Test',
      goal: 'maintain',
      dailyCalories: 2000,
    });
  });
});

describe('isStreakStillValid', () => {
  it('returns false when lastCompletedAt is null', () => {
    expect(isStreakStillValid(null, 5)).toBe(false);
  });

  it('returns false when streak is zero', () => {
    const now = new Date().toISOString();
    expect(isStreakStillValid(now, 0)).toBe(false);
  });

  it('returns true when last completion is within 2 days', () => {
    const recent = new Date(Date.now() - 60_000).toISOString();
    expect(isStreakStillValid(recent, 5)).toBe(true);
  });

  it('returns false when last completion is older than 2 days', () => {
    const old = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(isStreakStillValid(old, 5)).toBe(false);
  });
});
