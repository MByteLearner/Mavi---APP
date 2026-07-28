import { Text, View, StyleSheet } from 'react-native';
import { palette, spacing, typography } from '@/theme';

export interface WaterTrackerProps {
  glasses: number;
  target: number;
}

export function WaterTracker({ glasses, target }: WaterTrackerProps) {
  const slots = Array.from({ length: target }, (_, i) => i < glasses);
  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={styles.drop} />
          <Text style={styles.title}>Agua</Text>
        </View>
        <Text style={styles.value}>
          {glasses}
          <Text style={styles.valueMuted}> / {target} vasos</Text>
        </Text>
      </View>
      <View style={styles.slots}>
        {slots.map((filled, idx) => (
          <View
            key={idx}
            style={[
              styles.slot,
              { backgroundColor: filled ? palette.info : palette.divider },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.md },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  drop: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: palette.info,
  },
  title: { ...typography.bodyMedium, color: palette.textPrimary },
  value: {
    ...typography.bodyMedium,
    color: palette.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  valueMuted: { color: palette.textSecondary, fontWeight: '400' },
  slots: { flexDirection: 'row', gap: 6 },
  slot: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
});
