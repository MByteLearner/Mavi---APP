import type { CameraCapture, ValidationResult, MealLog } from '@/types/validation';
import { apiRequest, ApiError } from './api';
import { API_CONFIG } from './config';
import { useUserStore } from '@/stores/useUserStore';
import { logger } from '@/utils/logger';

const MOCK_LATENCY_MS = 2_000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mockValidate(capture: CameraCapture): ValidationResult {
  void capture;
  const confidence = 0.78 + Math.random() * 0.2;
  const isSuccess = confidence > 0.7;
  return {
    success: isSuccess,
    is_valid: isSuccess,
    confidence: Math.round(confidence * 100) / 100,
    message: isSuccess ? 'Plato validado correctamente' : 'El plato no corresponde a la receta. Intenta de nuevo.',
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

  const formData = new FormData();
  formData.append('file', {
    uri: input.capture.uri,
    name: 'meal.jpg',
    type: input.capture.mimeType || 'image/jpeg',
  } as unknown as Blob);
  if (input.recipeId) {
    formData.append('recipeId', input.recipeId);
  }

  try {
    const res = await apiRequest<{
      is_valid: boolean;
      meal_log?: MealLog;
      streak?: number;
      message?: string;
    }>('/meals/validate', {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const isSuccess = Boolean(res.is_valid);
    if (isSuccess && typeof res.streak === 'number') {
      useUserStore.getState().setStreak(res.streak);
    }

    return {
      success: isSuccess,
      is_valid: isSuccess,
      confidence: isSuccess ? 0.95 : 0.4,
      message: res.message ?? (isSuccess ? 'Plato validado correctamente' : 'El plato no corresponde a la receta. Intenta de nuevo.'),
      meal_log: res.meal_log,
      streak: res.streak,
    };
  } catch (err) {
    const message = err instanceof ApiError ? err.message : 'Error al validar el plato';
    return {
      success: false,
      is_valid: false,
      confidence: 0,
      message,
    };
  }
}

