import { Flame } from '@/components/ui/icons';
import { Text, View, StyleSheet } from 'react-native';

export interface StreakBadgeProps {
  streak: number;
  className?: string;
  style?: object;
}

export function StreakBadge({ streak, className, style }: StreakBadgeProps) {
  return (
    <View
      accessibilityLabel={`Racha de ${streak} días`}
      style={[styles.badge, style]}
      className={className}
    >
      <Flame size={14} color="#EA580C" />
      <Text style={styles.text}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    gap: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C2410C',
    fontVariant: ['tabular-nums'],
  },
});
