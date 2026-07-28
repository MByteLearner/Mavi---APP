import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const isAvailable = Platform.OS === 'ios' || Platform.OS === 'android';

function safeImpact(style: Haptics.ImpactFeedbackStyle) {
  if (!isAvailable) return;
  try {
    Haptics.impactAsync(style);
  } catch {
    // no-op
  }
}

function safeNotification(type: Haptics.NotificationFeedbackType) {
  if (!isAvailable) return;
  try {
    Haptics.notificationAsync(type);
  } catch {
    // no-op
  }
}

export interface UseHapticsResult {
  selection: () => void;
  light: () => void;
  medium: () => void;
  heavy: () => void;
  success: () => void;
  warning: () => void;
  error: () => void;
}

export function useHaptics(): UseHapticsResult {
  const selection = useCallback(() => {
    if (!isAvailable) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // no-op
    }
  }, []);

  return {
    selection,
    light: () => safeImpact(Haptics.ImpactFeedbackStyle.Light),
    medium: () => safeImpact(Haptics.ImpactFeedbackStyle.Medium),
    heavy: () => safeImpact(Haptics.ImpactFeedbackStyle.Heavy),
    success: () => safeNotification(Haptics.NotificationFeedbackType.Success),
    warning: () => safeNotification(Haptics.NotificationFeedbackType.Warning),
    error: () => safeNotification(Haptics.NotificationFeedbackType.Error),
  };
}
