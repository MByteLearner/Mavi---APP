import { Text, View, StyleSheet } from 'react-native';
import { palette, spacing, typography } from '@/theme';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  body?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Algo salió mal',
  body = 'No pudimos completar la acción. Inténtalo de nuevo.',
  onRetry,
  retryLabel = 'Reintentar',
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>!</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {onRetry ? (
        <View style={styles.action}>
          <Button label={retryLabel} variant="outlined" size="md" onPress={onRetry} fullWidth={false} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    ...typography.display,
    color: palette.error,
    fontWeight: '700',
  },
  title: {
    ...typography.heading,
    color: palette.textPrimary,
    textAlign: 'center',
  },
  body: {
    ...typography.bodySecondary,
    color: palette.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 320,
  },
  action: { marginTop: spacing.xl },
});
