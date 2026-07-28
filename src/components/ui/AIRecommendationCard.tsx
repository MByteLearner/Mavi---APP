import { Text, View, StyleSheet, Pressable } from 'react-native';
import { radius, spacing, typography, useThemeColors } from '@/theme';
import { Chip } from './Chip';

export interface AIRecommendationCardProps {
  title: string;
  body: string;
  tag?: string;
  onPress?: () => void;
}

export function AIRecommendationCard({ title, body, tag = 'IA', onPress }: AIRecommendationCardProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.iconText, { color: colors.primary }]}>✦</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Chip label={tag} tone="brand" />
        </View>
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>{body}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
  },
  pressed: { transform: [{ scale: 0.98 }] },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 18, fontWeight: '700' },
  title: { ...typography.subheading, marginTop: 4 },
  body: { ...typography.bodySecondary },
});
