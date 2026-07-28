import { useMutation, useQuery } from '@tanstack/react-query';

import { scanPlan, type ScanPlanInput, type ScanPlanResult } from '@/services/planParser';
import { validateMeal, type ValidateMealInput } from '@/services/aiValidator';
import { RECIPES } from '@/constants/recipes';
import type { Recipe } from '@/types/recipe';
import type { ValidationResult } from '@/types/validation';

export const queryKeys = {
  recipes: ['recipes'] as const,
  recipe: (id: string) => ['recipes', id] as const,
  plan: (planId: string | null) => ['plan', planId] as const,
  profile: ['profile'] as const,
};

export function useRecipes(): { data: Recipe[]; isLoading: boolean } {
  const result = useQuery({
    queryKey: queryKeys.recipes,
    queryFn: async () => RECIPES,
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
