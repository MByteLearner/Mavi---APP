import { Text, View, StyleSheet, Pressable } from 'react-native';
import { palette, radius, spacing, typography } from '@/theme';
import { Chip } from './Chip';

export interface AIRecommendationCardProps {
  title: string;
  body: string;
  tag?: string;
  onPress?: () => void;
}

export function AIRecommendationCard({ title, body, tag = 'IA', onPress }: AIRecommendationCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>✦</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Chip label={tag} tone="brand" />
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: palette.primarySoft,
  },
  pressed: { transform: [{ scale: 0.98 }] },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: palette.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 18, color: palette.primary, fontWeight: '700' },
  title: { ...typography.subheading, color: palette.textPrimary, marginTop: 4 },
  body: { ...typography.bodySecondary, color: palette.textSecondary },
});
