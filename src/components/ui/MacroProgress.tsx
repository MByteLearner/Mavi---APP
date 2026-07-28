import { Text, View, StyleSheet } from 'react-native';
import { palette, spacing, typography } from '@/theme';

export interface MacroProgressProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
}

export function MacroProgress({ label, current, target, color, unit = 'g' }: MacroProgressProps) {
  const pct = Math.min(current / Math.max(target, 1), 1);
  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {current}
          <Text style={styles.valueMuted}> / {target}{unit}</Text>
        </Text>
      </View>
      <View style={styles.track}>
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
    color: palette.textPrimary,
  },
  value: {
    ...typography.bodyMedium,
    color: palette.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  valueMuted: {
    color: palette.textSecondary,
    fontWeight: '400',
  },
  track: {
    height: 8,
    backgroundColor: palette.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
