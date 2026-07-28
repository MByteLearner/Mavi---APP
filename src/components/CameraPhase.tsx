import { useEffect, useRef } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from '@/components/ui/icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { Button } from '@/components/ui';
import { STRINGS } from '@/constants/strings';
import { palette, spacing, typography } from '@/theme';

export interface CameraPhaseProps {
  onCapture: (ref: CameraView) => void;
  onBack: () => void;
}

export function CameraPhase({ onCapture, onBack }: CameraPhaseProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted) requestPermission();
  }, [permission, requestPermission]);

  if (!permission) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.muted}>{STRINGS.validation.loading}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.permission}>
          <Text style={styles.permissionTitle}>{STRINGS.validation.permissionTitle}</Text>
          <Text style={styles.permissionBody}>{STRINGS.validation.permissionBody}</Text>
          <Button label={STRINGS.validation.grantPermission} onPress={requestPermission} fullWidth={false} />
          <Pressable onPress={onBack} style={styles.backLink}>
            <Text style={styles.backLinkText}>{STRINGS.validation.back}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleCapture = () => {
    if (!cameraRef.current) return;
    onCapture(cameraRef.current);
  };

  return (
    <View style={styles.cameraContainer}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <SafeAreaView style={styles.overlay}>
          <View style={styles.header}>
            <Pressable onPress={onBack} style={styles.backBtn} accessibilityLabel="Volver">
              <ArrowLeft size={20} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.title}>{STRINGS.validation.title.toUpperCase()}</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={{ flex: 1 }} />
          <View style={styles.captureWrapper}>
            <Pressable
              onPress={handleCapture}
              style={({ pressed }) => [styles.capture, pressed && { transform: [{ scale: 0.95 }] }]}
              accessibilityLabel={STRINGS.validation.captureAria}
            >
              <View style={styles.captureInner} />
            </Pressable>
            <Text style={styles.captureHint}>{STRINGS.validation.captureHint.toUpperCase()}</Text>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { ...typography.bodySecondary, color: palette.textSecondary },
  permission: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, gap: spacing.md },
  permissionTitle: { ...typography.titleSecondary, color: palette.textPrimary, fontWeight: '600', textAlign: 'center' },
  permissionBody: { ...typography.bodySecondary, color: palette.textSecondary, textAlign: 'center' },
  backLink: { padding: spacing.md },
  backLinkText: { ...typography.body, color: palette.textSecondary },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.label, color: 'rgba(255,255,255,0.9)', fontWeight: '600', letterSpacing: 2 },
  captureWrapper: { alignItems: 'center', paddingBottom: spacing['2xl'] },
  capture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFFFFF' },
  captureHint: {
    ...typography.label,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.md,
    letterSpacing: 2,
  },
});
