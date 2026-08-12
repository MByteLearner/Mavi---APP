export type PlanSource = 'pdf' | 'image' | 'camera';

export interface Guideline {
  id: string;
  userId: string;
  allowedIngredients: string[];
  restrictions: string[];
}

export interface ScannedPlan {
  id: string;
  source: PlanSource;
  scannedAt: string;
  restrictions: string[];
  suggestedRecipeIds: string[];
  allowedIngredients?: string[];
}

