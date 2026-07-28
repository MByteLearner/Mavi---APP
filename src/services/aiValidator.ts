import type { CameraCapture, ValidationResult } from '@/types/validation';
import { apiRequest } from './api';
import { API_CONFIG } from './config';
import { logger } from '@/utils/logger';

const MOCK_LATENCY_MS = 2_000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mockValidate(capture: CameraCapture): ValidationResult {
  void capture;
  const confidence = 0.78 + Math.random() * 0.2;
  return {
    success: confidence > 0.7,
    confidence: Math.round(confidence * 100) / 100,
    message: 'Plato validado correctamente',
    detectedIngredients: ['Proteína', 'Vegetales', 'Carbohidratos'],
  };
}

export interface ValidateMealInput {
  capture: CameraCapture;
  recipeId: string | null;
  actualWeights?: number[];
}

export async function validateMeal(input: ValidateMealInput): Promise<ValidationResult> {
  logger.debug('aiValidator', 'validateMeal called', {
    recipeId: input.recipeId,
    uri: input.capture.uri,
  });

  if (API_CONFIG.useMocks) {
    await delay(MOCK_LATENCY_MS);
    return mockValidate(input.capture);
  }

  return apiRequest<ValidationResult>('/meals/validate', {
    method: 'POST',
    body: {
      recipeId: input.recipeId,
      imageUri: input.capture.uri,
      width: input.capture.width,
      height: input.capture.height,
      actualWeights: input.actualWeights,
    },
  });
}
