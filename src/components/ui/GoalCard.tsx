import { Text, View, StyleSheet } from 'react-native';
import { palette, radius, spacing, typography } from '@/theme';

export interface GoalCardProps {
  title: string;
  current: number;
  target: number;
  unit?: string;
  caption?: string;
}

export function GoalCard({ title, current, target, unit = '%', caption }: GoalCardProps) {
  const pct = Math.min(current / Math.max(target, 1), 1);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>
          {Math.round(pct * 100)}
          <Text style={styles.unit}>{unit}</Text>
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%` }]} />
      </View>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: { ...typography.bodyMedium, color: palette.textPrimary },
  value: {
    ...typography.titleSecondary,
    color: palette.primary,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 18,
    color: palette.textSecondary,
    fontWeight: '500',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.divider,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: palette.primary,
    borderRadius: 3,
  },
  caption: { ...typography.caption, color: palette.textSecondary },
});
