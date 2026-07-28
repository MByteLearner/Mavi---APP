import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { palette, radius, spacing, typography } from '@/theme';

export interface LoadingOverlayProps {
  visible: boolean;
  title?: string;
  hint?: string;
}

export function LoadingOverlay({ visible, title = 'Cargando...', hint }: LoadingOverlayProps) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={styles.title}>{title}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: palette.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing['2xl'],
    alignItems: 'center',
    gap: spacing.md,
    minWidth: 200,
  },
  title: { ...typography.bodyMedium, color: palette.textPrimary },
  hint: { ...typography.caption, color: palette.textSecondary, textAlign: 'center' },
});
