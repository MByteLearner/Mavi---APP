export interface CameraCapture {
  uri: string;
  width: number;
  height: number;
  mimeType: string;
}

export interface MealLog {
  id: string;
  userId: string;
  recipeId: string;
  photoUrl: string;
  isValid: boolean;
  createdAt: string;
}

export interface ValidationResult {
  success: boolean;
  is_valid?: boolean;
  confidence?: number;
  message: string;
  detectedIngredients?: string[];
  meal_log?: MealLog;
  streak?: number;
}

