import { Text, View, StyleSheet } from 'react-native';
import { palette, radius, spacing, typography } from '@/theme';

export interface FoodCardProps {
  title: string;
  subtitle?: string;
  calories: number;
  time?: string;
  emoji?: string;
  onPress?: () => void;
}

export function FoodCard({ title, subtitle, calories, time, emoji, onPress }: FoodCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.emojiBox}>
          <Text style={styles.emoji}>{emoji ?? '🍽'}</Text>
        </View>
        <View style={styles.text}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.calories}>{calories}</Text>
        <Text style={styles.calUnit}>kcal</Text>
        {time ? <Text style={styles.time}>{time}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.md,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  emojiBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFEDED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 24 },
  text: { flex: 1 },
  title: { ...typography.bodyMedium, color: palette.textPrimary },
  subtitle: { ...typography.caption, color: palette.textSecondary, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  calories: {
    ...typography.subheading,
    color: palette.primary,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  calUnit: { ...typography.caption, color: palette.textSecondary, marginTop: -2 },
  time: { ...typography.label, color: palette.textDisabled, marginTop: 4 },
});
