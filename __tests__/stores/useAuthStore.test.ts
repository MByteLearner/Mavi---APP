import { useAuthStore } from '@/stores/useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
    });
  });

  test('initial state when reset', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  test('loginAsDemo sets demo user and authenticates', async () => {
    await useAuthStore.getState().loginAsDemo();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.name).toBe('María García');
    expect(state.user?.email).toBe('maria.garcia@mavi.app');
  });

  test('login validates input and succeeds with credentials', async () => {
    const res = await useAuthStore.getState().login('carlos.perez@mavi.app', 'pass123');
    expect(res.success).toBe(true);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.name).toBe('Carlos perez');
  });

  test('login fails when fields are empty', async () => {
    const res = await useAuthStore.getState().login('', '');
    expect(res.success).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  test('register creates new user account', async () => {
    const res = await useAuthStore.getState().register({
      name: 'Lucía Fernández',
      email: 'lucia@mavi.app',
      password: 'password123',
      goal: 'lose',
      restrictions: ['Sin TACC', 'Vegetariano'],
    });

    expect(res.success).toBe(true);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.name).toBe('Lucía Fernández');
    expect(state.user?.goal).toBe('lose');
    expect(state.user?.restrictions).toEqual(['Sin TACC', 'Vegetariano']);
  });

  test('logout clears user state', async () => {
    await useAuthStore.getState().loginAsDemo();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
