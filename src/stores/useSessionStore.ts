import { create } from 'zustand';

interface SessionState {
  activeRecipeId: string | null;
  currentIngredientIndex: number;
  currentWeight: number;
  isWeighingComplete: boolean;
  setActiveRecipe: (recipeId: string | null) => void;
  startWeighing: (recipeId: string) => void;
  updateWeight: (weight: number) => void;
  advanceIngredient: () => void;
  resetWeighing: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  activeRecipeId: null,
  currentIngredientIndex: 0,
  currentWeight: 0,
  isWeighingComplete: false,
  setActiveRecipe: (recipeId) =>
    set({ activeRecipeId: recipeId, isWeighingComplete: recipeId !== null && false }),
  startWeighing: (recipeId) =>
    set({
      activeRecipeId: recipeId,
      currentIngredientIndex: 0,
      currentWeight: 0,
      isWeighingComplete: false,
    }),
  updateWeight: (weight) => set({ currentWeight: weight }),
  advanceIngredient: () =>
    set((state) => ({
      currentIngredientIndex: state.currentIngredientIndex + 1,
      currentWeight: 0,
    })),
  resetWeighing: () =>
    set({
      currentIngredientIndex: 0,
      currentWeight: 0,
      isWeighingComplete: false,
      activeRecipeId: null,
    }),
}));
