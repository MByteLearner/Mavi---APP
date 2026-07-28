import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import { useUserStore } from '@/stores/useUserStore';
import { useScanPlanMutation } from '@/services/queries';
import { LoadingOverlay } from '@/components/ui';
import { Camera, FileText, ScanLine, CloseIcon, ChevronRight } from '@/components/ui/icons';
import { palette, radius, spacing, typography } from '@/theme';
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
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.brand}>MAVI</Text>
          <Text style={styles.title}>{STRINGS.scan.title}</Text>
        </View>
        <Pressable onPress={() => router.back()} style={styles.closeBtn} accessibilityLabel="Cerrar">
          <CloseIcon size={20} color={palette.textPrimary} />
        </Pressable>
      </View>

      <Text style={styles.subtitle}>{STRINGS.scan.subtitle}</Text>

      <View style={styles.options}>
        <ScanOption
          icon={<FileText size={22} color={palette.textInverse} />}
          iconBg={palette.primary}
          title={STRINGS.scan.pickPdf}
          subtitle={STRINGS.scan.pickPdfSubtitle}
          onPress={pickPDF}
        />
        <ScanOption
          icon={<Camera size={22} color={palette.textInverse} />}
          iconBg={palette.textPrimary}
          title={STRINGS.scan.pickImage}
          subtitle={STRINGS.scan.pickImageSubtitle}
          onPress={pickImage}
        />
        <ScanOption
          icon={<ScanLine size={22} color={palette.textInverse} />}
          iconBg={palette.textPrimary}
          title={STRINGS.scan.takePhoto}
          subtitle={STRINGS.scan.takePhotoSubtitle}
          onPress={takePhoto}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <LoadingOverlay
        visible={loading}
        title={STRINGS.scan.analyzing}
        hint={STRINGS.scan.analyzingHint}
      />
    </SafeAreaView>
  );
}

function ScanOption({
  icon,
  iconBg,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.option, pressed && { transform: [{ scale: 0.98 }] }]}
    >
      <View style={[styles.optionIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={20} color={palette.textDisabled} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  header: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: spacing.md, gap: spacing.md },
  brand: { ...typography.label, color: palette.primary, fontWeight: '700' },
  title: { ...typography.title, color: palette.textPrimary, fontWeight: '700', marginTop: 4 },
  subtitle: { ...typography.bodySecondary, color: palette.textSecondary, marginBottom: spacing.lg },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  options: { gap: spacing.md, marginTop: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.md,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: { ...typography.bodyMedium, color: palette.textPrimary, fontWeight: '600' },
  optionSubtitle: { ...typography.caption, color: palette.textSecondary, marginTop: 2 },
  error: { ...typography.bodyMedium, color: palette.error, textAlign: 'center', marginTop: spacing.lg },
});
