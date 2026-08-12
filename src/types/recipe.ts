export type WeightUnit = 'g' | 'ml';

export interface Ingredient {
  id: string;
  name: string;
  targetWeight: number;
  unit: WeightUnit;
}

export interface BackendRecipe {
  id: string;
  name: string;
  ingredients: string[];
  base_calories: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  emoji: string;
  calories?: number;
  base_calories?: number;
  ingredients: Ingredient[];
}

