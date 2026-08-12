import { RECIPES } from '@/constants/recipes';
import type { ScannedPlan } from '@/types/plan';
import type { Recipe } from '@/types/recipe';
import { logger } from '@/utils/logger';
import { apiRequest } from './api';
import { API_CONFIG } from './config';

const MOCK_LATENCY_MS = 1_500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ScanPlanInput {
  uri: string;
  mimeType: string;
  fileName?: string;
}

export interface ScanPlanResult {
  plan: ScannedPlan;
  suggestedRecipes: Recipe[];
}

function mockScan(input: ScanPlanInput): ScanPlanResult {
  return {
    plan: {
      id: `plan-${Date.now()}`,
      source: input.mimeType === 'application/pdf' ? 'pdf' : 'image',
      scannedAt: new Date().toISOString(),
      restrictions: ['Sin TACC', 'Bajo en sodio'],
      suggestedRecipeIds: RECIPES.map((r) => r.id),
    },
    suggestedRecipes: RECIPES,
  };
}

export interface BackendDietUploadResponse {
  id: string;
  userId: string;
  allowedIngredients: string[];
  restrictions: string[];
}

export async function scanPlan(input: ScanPlanInput): Promise<ScanPlanResult> {
  logger.debug('planParser', 'scanPlan called', { mimeType: input.mimeType, fileName: input.fileName });

  if (API_CONFIG.useMocks) {
    await delay(MOCK_LATENCY_MS);
    return mockScan(input);
  }

  const formData = new FormData();
  formData.append('file', {
    uri: input.uri,
    name: input.fileName ?? (input.mimeType === 'application/pdf' ? 'plan.pdf' : 'plan.jpg'),
    type: input.mimeType,
  } as unknown as Blob);

  const res = await apiRequest<BackendDietUploadResponse>('/diets/upload', {
    method: 'POST',
    body: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return {
    plan: {
      id: res.id,
      source: input.mimeType === 'application/pdf' ? 'pdf' : 'image',
      scannedAt: new Date().toISOString(),
      restrictions: res.restrictions ?? [],
      suggestedRecipeIds: RECIPES.map((r) => r.id),
      allowedIngredients: res.allowedIngredients ?? [],
    },
    suggestedRecipes: RECIPES,
  };
}

export function getRecipesForPlan(planId: string | null): Recipe[] {
  if (!planId) return RECIPES;
  return RECIPES;
}

