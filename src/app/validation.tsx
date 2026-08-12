import { useEffect, useState, useCallback } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CheckCircle, Sparkles } from '@/components/ui/icons';
import { CameraView } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
} from 'react-native-reanimated';

import { useUserStore } from '@/stores/useUserStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { CameraPhase } from '@/components/CameraPhase';
import { useValidateMealMutation } from '@/services/queries';
import { useHaptics } from '@/hooks/useHaptics';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { logger } from '@/utils/logger';
import { STRINGS } from '@/constants/strings';
import { useThemeColors, type PaletteColors, spacing, typography } from '@/theme';
import type { CameraCapture } from '@/types/validation';

type Phase = 'camera' | 'processing' | 'success';

async function compressPhoto(uri: string): Promise<CameraCapture | null> {
  try {
    const manipulated = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1080 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
    );
    return {
      uri: manipulated.uri,
      width: manipulated.width,
      height: manipulated.height,
      mimeType: 'image/jpeg',
    };
  } catch (err) {
    logger.error('validation', 'compress error', { error: String(err) });
    return null;
  }
}

export default function ValidationScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const [phase, setPhase] = useState<Phase>('camera');
  const [error, setError] = useState<string | null>(null);
  const registerCompletion = useUserStore((s) => s.registerCompletion);
  const resetWeighing = useSessionStore((s) => s.resetWeighing);
  const activeRecipeId = useSessionStore((s) => s.activeRecipeId);
  const validate = useValidateMealMutation();
  const haptics = useHaptics();
  const checkScale = useSharedValue(0);

  const animatedCheck = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handleSuccessSideEffects = useCallback(() => {
    haptics.success();
    registerCompletion();
    resetWeighing();
    const timer = setTimeout(() => {
      router.replace('/(tabs)/history');
    }, 3000);
    return () => clearTimeout(timer);
  }, [registerCompletion, resetWeighing, haptics]);

  useEffect(() => {
    if (phase === 'success') {
      // eslint-disable-next-line react-hooks/immutability -- reanimated requires direct .value mutation
      checkScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }),
      );
      const cleanup = handleSuccessSideEffects();
      return cleanup;
    }
  }, [phase, checkScale, handleSuccessSideEffects]);

  const handleCapture = useCallback(
    async (cameraRef: CameraView) => {
      try {
        setError(null);
        haptics.medium();
        const photo = await cameraRef.takePictureAsync({ quality: 1 });
        if (!photo?.uri) {
          logger.warn('validation', 'takePictureAsync returned no uri');
          return;
        }
        setPhase('processing');
        const capture = await compressPhoto(photo.uri);
        if (!capture) {
          setError('No se pudo procesar la foto');
          haptics.error();
          setPhase('camera');
          return;
        }
        const result = await validate.mutateAsync({ capture, recipeId: activeRecipeId });
        if (result.success) {
          setPhase('success');
        } else {
          setError(result.message);
          haptics.warning();
          toast.error(result.message);
          setPhase('camera');
        }
      } catch (err) {
        logger.error('validation', 'capture error', { error: String(err) });
        setError('No se pudo validar el plato');
        haptics.error();
        toast.error('No se pudo validar el plato');
        setPhase('camera');
      }
    },
    [validate, activeRecipeId, haptics],
  );

  if (phase === 'processing') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.processingWrapper}>
          <View style={styles.processingIcon}>
            <Sparkles size={32} color={colors.primary} />
          </View>
          <Text style={styles.processingTitle}>{STRINGS.validation.processing}</Text>
          <Text style={styles.processingBody}>{STRINGS.validation.processingSubtitle}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'success') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successWrapper}>
          <Animated.View style={animatedCheck}>
            <View style={styles.successIcon}>
              <CheckCircle size={48} color={colors.textInverse} />
            </View>
          </Animated.View>
          <Animated.View entering={FadeIn.delay(300)} style={styles.successText}>
            <Text style={styles.successTitle}>{STRINGS.validation.success}</Text>
            <Text style={styles.successBody}>{STRINGS.validation.successSubtitle}</Text>
          </Animated.View>
          <Animated.View entering={FadeIn.delay(700)}>
            <Button
              label={STRINGS.validation.seeProgress}
              variant="outlined"
              size="md"
              onPress={() => router.replace('/(tabs)/history')}
              fullWidth={false}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      ) : null}
      <CameraPhase onCapture={handleCapture} onBack={() => router.back()} />
    </View>
  );
}

function createStyles(colors: PaletteColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    processingWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, gap: spacing.md },
    processingIcon: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    processingTitle: { ...typography.titleSecondary, color: colors.textPrimary, fontWeight: '600' },
    processingBody: { ...typography.bodySecondary, color: colors.textSecondary, textAlign: 'center', maxWidth: 320 },
    successWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, gap: spacing.lg },
    successIcon: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: colors.success,
      alignItems: 'center',
      justifyContent: 'center',
    },
    successText: { alignItems: 'center' },
    successTitle: { ...typography.title, color: colors.textPrimary, fontWeight: '700', textAlign: 'center' },
    successBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
    errorBanner: { position: 'absolute', top: 80, left: spacing.lg, right: spacing.lg, zIndex: 10 },
    errorBannerText: { ...typography.bodyMedium, color: colors.textPrimary, textAlign: 'center' },
  });
}

