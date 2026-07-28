import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import { useUserStore } from '@/stores/useUserStore';
import { useScanPlanMutation } from '@/services/queries';
import { LoadingOverlay, AnimatedEntry } from '@/components/ui';
import { Camera, FileText, ScanLine, CloseIcon, ChevronRight } from '@/components/ui/icons';
import { radius, spacing, typography, useThemeColors } from '@/theme';
import { logger } from '@/utils/logger';
import { STRINGS } from '@/constants/strings';

type Source = 'pdf' | 'gallery' | 'camera';

function inferMimeType(
  asset: { mimeType?: string | null; fileName?: string | null } | undefined,
  source: Source,
): string {
  if (asset?.mimeType) return asset.mimeType;
  if (source === 'pdf') return 'application/pdf';
  return 'image/jpeg';
}

function inferName(
  asset: { fileName?: string | null; name?: string | null } | undefined,
  source: Source,
): string {
  const a = asset as { fileName?: string | null; name?: string | null } | undefined;
  return a?.fileName ?? a?.name ?? (source === 'pdf' ? 'plan.pdf' : `plan-${Date.now()}.jpg`);
}

export default function ScanScreen() {
  const colors = useThemeColors();
  const setPlanScanned = useUserStore((state) => state.setPlanScanned);
  const mutation = useScanPlanMutation();
  const [error, setError] = useState<string | null>(null);

  const handleResult = (planId: string) => {
    setPlanScanned(planId);
    router.replace('/(tabs)/nutrition');
  };

  const run = async (
    source: Source,
    picker: () => Promise<
      { canceled: true } | { canceled: false; assets: { uri: string; mimeType?: string | null; fileName?: string | null; name?: string | null }[] }
    >,
  ) => {
    setError(null);
    try {
      const result = await picker();
      if (result.canceled) return;
      const asset = result.assets[0];
      const res = await mutation.mutateAsync({
        uri: asset.uri,
        mimeType: inferMimeType(asset, source),
        fileName: inferName(asset, source),
      });
      handleResult(res.plan.id);
    } catch (err) {
      logger.error('scan', `${source} error`, { error: String(err) });
      setError('No se pudo procesar el archivo');
    }
  };

  const pickPDF = () =>
    run('pdf', () => DocumentPicker.getDocumentAsync({ type: 'application/pdf' }));

  const pickImage = () =>
    run('gallery', () => ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] }));

  const takePhoto = async () => {
    setError(null);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') return;
      await run('camera', () => ImagePicker.launchCameraAsync({ mediaTypes: ['images'] }));
    } catch (err) {
      logger.error('scan', 'takePhoto error', { error: String(err) });
    }
  };

  const loading = mutation.isPending;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>Escanear</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{STRINGS.scan.title}</Text>
        </View>
        <Pressable onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} accessibilityLabel="Cerrar">
          <CloseIcon size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{STRINGS.scan.subtitle}</Text>

      <View style={styles.options}>
        {[
          {
            icon: <FileText size={22} color={colors.textInverse} />,
            iconBg: colors.primary,
            title: STRINGS.scan.pickPdf,
            subtitle: STRINGS.scan.pickPdfSubtitle,
            onPress: pickPDF,
          },
          {
            icon: <Camera size={22} color={colors.textInverse} />,
            iconBg: colors.primaryDark,
            title: STRINGS.scan.pickImage,
            subtitle: STRINGS.scan.pickImageSubtitle,
            onPress: pickImage,
          },
          {
            icon: <ScanLine size={22} color={colors.textInverse} />,
            iconBg: colors.primaryDark,
            title: STRINGS.scan.takePhoto,
            subtitle: STRINGS.scan.takePhotoSubtitle,
            onPress: takePhoto,
          },
        ].map((opt, i) => (
          <AnimatedEntry key={i} delay={i * 80}>
            <Pressable
              onPress={opt.onPress}
              style={({ pressed }) => [styles.option, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && { transform: [{ scale: 0.98 }] }]}
            >
              <View style={[styles.optionIcon, { backgroundColor: opt.iconBg }]}>{opt.icon}</View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>{opt.title}</Text>
                <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>{opt.subtitle}</Text>
              </View>
              <ChevronRight size={20} color={colors.textDisabled} />
            </Pressable>
          </AnimatedEntry>
        ))}
      </View>

      {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}

      <LoadingOverlay
        visible={loading}
        title={STRINGS.scan.analyzing}
        hint={STRINGS.scan.analyzingHint}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  header: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: spacing.md, gap: spacing.md },
  eyebrow: { ...typography.overline, marginBottom: 4 },
  title: { ...typography.title, fontFamily: 'Fraunces_500Medium' },
  subtitle: { ...typography.bodySecondary, marginBottom: spacing.lg },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  options: { gap: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.card,
    gap: spacing.md,
    borderWidth: 1,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: { ...typography.bodyMedium },
  optionSubtitle: { ...typography.caption, marginTop: 2 },
  error: { ...typography.bodySecondary, textAlign: 'center', marginTop: spacing.lg },
});
