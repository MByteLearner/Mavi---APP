import { Text, View, StyleSheet } from 'react-native';
import { typography, useThemeColors } from '@/theme';

export interface CaloriesRingProps {
  consumed: number;
  target: number;
  size?: number;
  label?: string;
}

export function CaloriesRing({ consumed, target, size = 180, label = 'kcal' }: CaloriesRingProps) {
  const colors = useThemeColors();
  const pct = Math.min(consumed / Math.max(target, 1), 1);
  const remaining = Math.max(target - consumed, 0);

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: colors.divider,
          },
        ]}
      />
      <View
        style={[
          styles.arc,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: colors.primary,
            borderTopColor: 'transparent',
            borderRightColor: pct > 0.25 ? colors.primary : 'transparent',
            borderBottomColor: pct > 0.5 ? colors.primary : 'transparent',
            borderLeftColor: pct > 0.75 ? colors.primary : 'transparent',
            transform: [{ rotate: '-45deg' }],
          },
        ]}
      />
      <View style={styles.center}>
        <Text style={[styles.value, { fontSize: size * 0.22, color: colors.textPrimary }]}>{remaining}</Text>
        <Text style={[styles.label, { fontSize: size * 0.09, color: colors.textSecondary }]}>de {target} {label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    borderWidth: 12,
  },
  arc: {
    position: 'absolute',
    borderWidth: 12,
  },
  center: { alignItems: 'center' },
  value: {
    ...typography.title,
    fontWeight: '700',
  },
  label: {
    ...typography.caption,
    marginTop: 4,
  },
});
