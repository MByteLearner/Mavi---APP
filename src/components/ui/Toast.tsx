import { create } from 'zustand';
import { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { palette, radius, shadow, spacing, typography } from '@/theme';

export type ToastTone = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
  durationMs: number;
}

interface ToastState {
  toasts: ToastItem[];
  show: (message: string, tone?: ToastTone, durationMs?: number) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (message, tone = 'info', durationMs = 2800) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((state) => {
      // If last toast has identical message, don't duplicate
      if (state.toasts.length > 0 && state.toasts[state.toasts.length - 1].message === message) {
        return state;
      }
      // Max 2 toasts stacked at a time to prevent clogging the screen
      const trimmed = state.toasts.length >= 2 ? state.toasts.slice(1) : state.toasts;
      return { toasts: [...trimmed, { id, message, tone, durationMs }] };
    });
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

const toneColor: Record<ToastTone, string> = {
  success: palette.success,
  error: palette.error,
  info: palette.textPrimary,
};

function ToastView({ toast, onDone }: { toast: ToastItem; onDone: () => void }) {
  const translateY = useSharedValue(-80);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.cubic) });
    opacity.value = withTiming(1, { duration: 200 });
    const t = setTimeout(() => {
      translateY.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(-80, { duration: 250, easing: Easing.in(Easing.cubic) }),
      );
      opacity.value = withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(0, { duration: 250 }),
      );
      setTimeout(onDone, 260);
    }, toast.durationMs);
    return () => clearTimeout(t);
  }, [opacity, toast.durationMs, translateY, onDone]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.wrapper, animatedStyle]}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <View style={[styles.toast, { backgroundColor: toneColor[toast.tone] }]}>
        <Text style={styles.text}>{toast.message}</Text>
      </View>
    </Animated.View>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  if (toasts.length === 0) return null;
  return (
    <View pointerEvents="box-none" style={styles.container}>
      {toasts.map((t) => (
        <ToastView key={t.id} toast={t} onDone={() => dismiss(t.id)} />
      ))}
    </View>
  );
}

export const toast = {
  success: (message: string) => useToastStore.getState().show(message, 'success'),
  error: (message: string) => useToastStore.getState().show(message, 'error'),
  info: (message: string) => useToastStore.getState().show(message, 'info'),
};

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 48, left: 0, right: 0, zIndex: 999 },
  wrapper: { marginHorizontal: spacing.lg, marginBottom: spacing.sm },
  toast: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.md,
  },
  text: { ...typography.bodyMedium, color: palette.textInverse, fontWeight: '600' },
});
