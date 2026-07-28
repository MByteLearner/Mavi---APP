import { Text, View, StyleSheet } from 'react-native';
import { radius, spacing, typography, useThemeColors } from '@/theme';

export interface FoodCardProps {
  title: string;
  subtitle?: string;
  calories: number;
  time?: string;
  emoji?: string;
  onPress?: () => void;
}

export function FoodCard({ title, subtitle, calories, time, emoji, onPress }: FoodCardProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.left}>
        <View style={[styles.emojiBox, { backgroundColor: colors.primarySoft }]}>
          <Text style={styles.emoji}>{emoji ?? '🍽'}</Text>
        </View>
        <View style={styles.text}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.calories, { color: colors.primary }]}>{calories}</Text>
        <Text style={[styles.calUnit, { color: colors.textSecondary }]}>kcal</Text>
        {time ? <Text style={[styles.time, { color: colors.textDisabled }]}>{time}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.card,
    padding: spacing.md,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  emojiBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 24 },
  text: { flex: 1 },
  title: { ...typography.bodyMedium },
  subtitle: { ...typography.caption, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  calories: {
    ...typography.subheading,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  calUnit: { ...typography.caption, marginTop: -2 },
  time: { ...typography.label, marginTop: 4 },
});
