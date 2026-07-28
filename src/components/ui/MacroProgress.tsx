import { Text, View, StyleSheet } from 'react-native';
import { spacing, typography, useThemeColors } from '@/theme';

export interface MacroProgressProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
}

export function MacroProgress({ label, current, target, color, unit = 'g' }: MacroProgressProps) {
  const colors = useThemeColors();
  const pct = Math.min(current / Math.max(target, 1), 1);

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {current}
          <Text style={[styles.valueMuted, { color: colors.textSecondary }]}> / {target}{unit}</Text>
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.divider }]}>
        <View
          style={[
            styles.fill,
            { width: `${pct * 100}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...typography.bodyMedium,
  },
  value: {
    ...typography.bodyMedium,
    fontVariant: ['tabular-nums'],
  },
  valueMuted: {
    fontWeight: '400',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
