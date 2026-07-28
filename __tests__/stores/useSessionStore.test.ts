import { useSessionStore } from '@/stores/useSessionStore';

describe('useSessionStore', () => {
  beforeEach(() => {
    useSessionStore.setState({
      activeRecipeId: null,
      currentIngredientIndex: 0,
      currentWeight: 0,
      isWeighingComplete: false,
    });
  });

  it('startWeighing sets up the active session', () => {
    useSessionStore.getState().startWeighing('1');
    const s = useSessionStore.getState();
    expect(s.activeRecipeId).toBe('1');
    expect(s.currentIngredientIndex).toBe(0);
    expect(s.currentWeight).toBe(0);
  });

  it('updateWeight updates the current weight', () => {
    useSessionStore.getState().startWeighing('1');
    useSessionStore.getState().updateWeight(42);
    expect(useSessionStore.getState().currentWeight).toBe(42);
  });

  it('advanceIngredient moves to the next ingredient and resets weight', () => {
    useSessionStore.getState().startWeighing('1');
    useSessionStore.getState().updateWeight(80);
    useSessionStore.getState().advanceIngredient();
    const s = useSessionStore.getState();
    expect(s.currentIngredientIndex).toBe(1);
    expect(s.currentWeight).toBe(0);
  });

  it('resetWeighing clears the session', () => {
    useSessionStore.getState().startWeighing('1');
    useSessionStore.getState().updateWeight(50);
    useSessionStore.getState().advanceIngredient();
    useSessionStore.getState().resetWeighing();
    const s = useSessionStore.getState();
    expect(s.activeRecipeId).toBeNull();
    expect(s.currentIngredientIndex).toBe(0);
    expect(s.currentWeight).toBe(0);
  });

  it('setActiveRecipe(null) clears the active recipe', () => {
    useSessionStore.getState().startWeighing('1');
    useSessionStore.getState().setActiveRecipe(null);
    expect(useSessionStore.getState().activeRecipeId).toBeNull();
  });
});
