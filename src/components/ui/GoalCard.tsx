import { Text, View, StyleSheet } from 'react-native';
import { radius, spacing, typography, useThemeColors } from '@/theme';

export interface GoalCardProps {
  title: string;
  current: number;
  target: number;
  unit?: string;
  caption?: string;
}

export function GoalCard({ title, current, target, unit = '%', caption }: GoalCardProps) {
  const colors = useThemeColors();
  const pct = Math.min(current / Math.max(target, 1), 1);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.value, { color: colors.primary }]}>
          {Math.round(pct * 100)}
          <Text style={[styles.unit, { color: colors.textSecondary }]}>{unit}</Text>
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.divider }]}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: colors.primary }]} />
      </View>
      {caption ? <Text style={[styles.caption, { color: colors.textSecondary }]}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: { ...typography.bodyMedium },
  value: {
    ...typography.titleSecondary,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 18,
    fontWeight: '500',
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  caption: { ...typography.caption },
});
