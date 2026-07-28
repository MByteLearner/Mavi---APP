import { useEffect, useRef, useCallback, useMemo } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bluetooth, Check, ArrowLeft } from '@/components/ui/icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { router } from 'expo-router';

import { useSessionStore } from '@/stores/useSessionStore';
import { useWeightSource } from '@/hooks/useWeightSource';
import { useHaptics } from '@/hooks/useHaptics';
import { ProgressBar } from '@/components/ProgressBar';
import { Pill } from '@/components/ui';
import { getRecipeById } from '@/constants/recipes';
import { STRINGS } from '@/constants/strings';
import { palette, radius, spacing, typography } from '@/theme';

const TOLERANCE_PERCENT = 0.05;
const HOLD_DURATION_MS = 2000;

export default function PreparationScreen() {
  const activeRecipeId = useSessionStore((s) => s.activeRecipeId);
  const currentIngredientIndex = useSessionStore((s) => s.currentIngredientIndex);
  const currentWeight = useSessionStore((s) => s.currentWeight);
  const updateWeight = useSessionStore((s) => s.updateWeight);
  const advanceIngredient = useSessionStore((s) => s.advanceIngredient);

  const recipe = getRecipeById(activeRecipeId ?? '');
  const ingredient = recipe?.ingredients[currentIngredientIndex];
  const totalIngredients = recipe?.ingredients.length ?? 0;

  const handleWeightUpdate = useCallback(
    (reading: { grams: number }) => updateWeight(reading.grams),
    [updateWeight],
  );

  const { isConnected, isScanning, stopSimulation } = useWeightSource({
    targetWeight: ingredient?.targetWeight ?? 0,
    onReading: handleWeightUpdate,
    enabled: Boolean(activeRecipeId && ingredient),
  });

  const haptics = useHaptics();
  const wasInToleranceRef = useRef(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scale = useSharedValue(0.98);

  const isInTolerance = useMemo(
    () =>
      ingredient
        ? Math.abs(currentWeight - ingredient.targetWeight) <=
          ingredient.targetWeight * TOLERANCE_PERCENT
        : false,
    [currentWeight, ingredient],
  );

  const progress = useMemo(
    () => (ingredient ? Math.min(currentWeight / ingredient.targetWeight, 1) : 0),
    [currentWeight, ingredient],
  );

  const weightDisplay = useMemo(() => currentWeight.toFixed(1), [currentWeight]);

  useEffect(() => {
    if (!activeRecipeId) router.replace('/(tabs)/nutrition');
  }, [activeRecipeId]);

  useEffect(() => {
    return () => stopSimulation();
  }, [stopSimulation]);

  useEffect(() => {
    if (!ingredient) return;
    if (isInTolerance) {
      if (!wasInToleranceRef.current) {
        haptics.selection();
        wasInToleranceRef.current = true;
      }
      if (!holdTimer.current) {
        holdTimer.current = setTimeout(() => {
          if (currentIngredientIndex < totalIngredients - 1) {
            haptics.success();
            scale.value = withTiming(
              0.95,
              { duration: 200, easing: Easing.out(Easing.cubic) },
              () => {
                advanceIngredient();
                scale.value = withTiming(0.98, { duration: 300 });
                wasInToleranceRef.current = false;
              },
            );
          } else {
            haptics.success();
            router.replace('/validation');
          }
          holdTimer.current = null;
        }, HOLD_DURATION_MS);
      }
    } else {
      wasInToleranceRef.current = false;
      if (holdTimer.current) {
        clearTimeout(holdTimer.current);
        holdTimer.current = null;
      }
    }
    return () => {
      if (holdTimer.current) {
        clearTimeout(holdTimer.current);
        holdTimer.current = null;
      }
    };
  }, [isInTolerance, currentIngredientIndex, totalIngredients, advanceIngredient, ingredient, haptics, scale]);

  const animatedNumber = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!recipe || !ingredient) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{STRINGS.preparation.noRecipe}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Volver">
          <ArrowLeft size={20} color={palette.textPrimary} />
        </Pressable>
        <View style={styles.statusPill}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isConnected ? palette.success : palette.textDisabled },
            ]}
          />
          <Bluetooth size={14} color={palette.textSecondary} />
          <Text style={styles.statusText}>
            {isConnected
              ? STRINGS.preparation.connected
              : isScanning
                ? STRINGS.preparation.scanning
                : STRINGS.preparation.disconnected}
          </Text>
        </View>
        <Pill tone="brand">
          {currentIngredientIndex + 1}/{totalIngredients}
        </Pill>
      </View>

      <View style={styles.body}>
        <View style={styles.ingredientHeader}>
          <Text style={styles.stepLabel}>
            {STRINGS.preparation.step} {currentIngredientIndex + 1}
          </Text>
          <Text style={styles.ingredientName}>{ingredient.name}</Text>
        </View>

        <View style={styles.weightCard}>
          <Animated.View style={animatedNumber} accessibilityLiveRegion="polite">
            <Text style={styles.weightNumber}>{weightDisplay}</Text>
            <Text style={styles.weightUnit}>{ingredient.unit}</Text>
          </Animated.View>
        </View>

        {isInTolerance && (
          <Animated.View entering={FadeIn} style={styles.toleranceRow}>
            <View style={styles.toleranceCheck}>
              <Check size={12} color={palette.textInverse} />
            </View>
            <Text style={styles.toleranceText}>{STRINGS.preparation.inTolerance}</Text>
          </Animated.View>
        )}

        <View style={styles.progressWrapper}>
          <ProgressBar progress={progress} isComplete={isInTolerance} />
        </View>

        <View style={styles.rangeRow}>
          <Text style={styles.rangeText}>
            {STRINGS.preparation.objective} {ingredient.targetWeight}
            {ingredient.unit}
          </Text>
          <Text style={styles.rangeText}>
            ±{(ingredient.targetWeight * TOLERANCE_PERCENT).toFixed(1)}
            {ingredient.unit}
          </Text>
        </View>

        <Text style={styles.footer}>{STRINGS.preparation.footer}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { ...typography.body, color: palette.textSecondary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { ...typography.caption, color: palette.textSecondary },
  body: { flex: 1, paddingHorizontal: spacing.lg },
  ingredientHeader: { alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.lg },
  stepLabel: {
    ...typography.label,
    color: palette.primary,
    fontWeight: '700',
    letterSpacing: 2,
  },
  ingredientName: {
    ...typography.titleSecondary,
    color: palette.textPrimary,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  weightCard: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    paddingVertical: spacing['3xl'],
    marginBottom: spacing.lg,
  },
  weightNumber: {
    fontSize: 110,
    fontWeight: '700',
    color: palette.textPrimary,
    letterSpacing: -3,
    fontVariant: ['tabular-nums'],
  },
  weightUnit: {
    ...typography.body,
    color: palette.textSecondary,
    marginTop: 4,
  },
  toleranceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  toleranceCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toleranceText: { ...typography.bodyMedium, color: palette.success, fontWeight: '600' },
  progressWrapper: { marginBottom: spacing.sm },
  rangeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  rangeText: { ...typography.caption, color: palette.textSecondary },
  footer: { ...typography.caption, color: palette.textDisabled, textAlign: 'center' },
});
