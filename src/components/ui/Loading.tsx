import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { palette, spacing, typography } from '@/theme';

export interface LoadingProps {
  label?: string;
  inline?: boolean;
}

export function Loading({ label = 'Cargando...', inline = false }: LoadingProps) {
  if (inline) {
    return (
      <View style={styles.inline}>
        <ActivityIndicator size="small" color={palette.primary} />
        {label ? <Text style={styles.label}>{label}</Text> : null}
      </View>
    );
  }
  return (
    <View style={styles.full}>
      <ActivityIndicator size="large" color={palette.primary} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  inline: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: {
    ...typography.bodySecondary,
    color: palette.textSecondary,
  },
});
