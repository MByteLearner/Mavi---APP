export type PlanSource = 'pdf' | 'image' | 'camera';

export interface ScannedPlan {
  id: string;
  source: PlanSource;
  scannedAt: string;
  restrictions: string[];
  suggestedRecipeIds: string[];
}
