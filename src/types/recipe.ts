export type WeightUnit = 'g' | 'ml';

export interface Ingredient {
  id: string;
  name: string;
  targetWeight: number;
  unit: WeightUnit;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  emoji: string;
  calories?: number;
  ingredients: Ingredient[];
}
