import { useCallback } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

import { logger } from '@/utils/logger';
import type { CameraCapture } from '@/types/validation';

type ExpoPhoto = { uri: string; width: number; height: number };

export interface UseCameraOptions {
  facing?: 'front' | 'back';
  compress?: {
    maxWidth?: number;
    quality?: number;
  };
}

export interface UseCameraResult {
  hasPermission: boolean | null;
  isReady: boolean;
  requestPermission: () => Promise<void>;
  capture: (ref: CameraView) => Promise<CameraCapture | null>;
}

const DEFAULT_MAX_WIDTH = 1080;
const DEFAULT_QUALITY = 0.7;

export function useCamera({ facing: _facing = 'back', compress }: UseCameraOptions = {}): UseCameraResult {
  const [permission, requestPermission] = useCameraPermissions();

  const maxWidth = compress?.maxWidth ?? DEFAULT_MAX_WIDTH;
  const quality = compress?.quality ?? DEFAULT_QUALITY;

  const capture = useCallback(
    async (cameraRef: CameraView): Promise<CameraCapture | null> => {
      try {
        const photo = (await cameraRef.takePictureAsync({ quality: 1 })) as ExpoPhoto | undefined;
        if (!photo?.uri) {
          logger.warn('camera', 'takePictureAsync returned no uri');
          return null;
        }

        const manipulated = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: maxWidth } }],
          {
            compress: quality,
            format: ImageManipulator.SaveFormat.JPEG,
          },
        );

        return {
          uri: manipulated.uri,
          width: manipulated.width,
          height: manipulated.height,
          mimeType: 'image/jpeg',
        };
      } catch (err) {
        logger.error('camera', 'capture error', { error: String(err) });
        return null;
      }
    },
    [maxWidth, quality],
  );

  return {
    hasPermission: permission?.granted ?? null,
    isReady: permission?.granted ?? false,
    requestPermission: async () => {
      await requestPermission();
    },
    capture,
  };
}
