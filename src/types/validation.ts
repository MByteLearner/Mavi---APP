export interface CameraCapture {
  uri: string;
  width: number;
  height: number;
  mimeType: string;
}

export interface ValidationResult {
  success: boolean;
  confidence: number;
  message: string;
  detectedIngredients?: string[];
}
