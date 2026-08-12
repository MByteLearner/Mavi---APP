import { useMutation, useQuery } from '@tanstack/react-query';

import { scanPlan, type ScanPlanInput, type ScanPlanResult } from '@/services/planParser';
import { validateMeal, type ValidateMealInput } from '@/services/aiValidator';
import { RECIPES } from '@/constants/recipes';
import type { BackendRecipe, Recipe } from '@/types/recipe';
import type { ValidationResult } from '@/types/validation';
import { apiRequest } from '@/services/api';
import { API_CONFIG } from '@/services/config';

export const queryKeys = {
  recipes: ['recipes'] as const,
  recipe: (id: string) => ['recipes', id] as const,
  plan: (planId: string | null) => ['plan', planId] as const,
  profile: ['profile'] as const,
};


export function mapBackendRecipeToRecipe(item: BackendRecipe): Recipe {
  return {
    id: item.id,
    name: item.name,
    description: `Receta adaptada (${item.base_calories ?? 350} kcal)`,
    emoji: '🥗',
    calories: item.base_calories,
    base_calories: item.base_calories,
    ingredients: (item.ingredients ?? []).map((ing, idx) => ({
      id: `${item.id}-ing-${idx}`,
      name: ing,
      targetWeight: 150,
      unit: 'g',
    })),
  };
}

export function useRecipes(): { data: Recipe[]; isLoading: boolean } {
  const result = useQuery({
    queryKey: queryKeys.recipes,
    queryFn: async () => {
      if (API_CONFIG.useMocks) return RECIPES;
      try {
        const backendRecipes = await apiRequest<BackendRecipe[]>('/recipes');
        if (Array.isArray(backendRecipes) && backendRecipes.length > 0) {
          return backendRecipes.map(mapBackendRecipeToRecipe);
        }
        return RECIPES;
      } catch {
        return RECIPES;
      }
    },
    initialData: RECIPES,
  });
  return { data: result.data ?? RECIPES, isLoading: result.isLoading };
}


export function useScanPlanMutation() {
  return useMutation<ScanPlanResult, Error, ScanPlanInput>({
    mutationFn: (input) => scanPlan(input),
  });
}

export function useValidateMealMutation() {
  return useMutation<ValidationResult, Error, ValidateMealInput>({
    mutationFn: (input) => validateMeal(input),
  });
}
