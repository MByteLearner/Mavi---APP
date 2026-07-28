import { Text, View, StyleSheet } from 'react-native';
import { palette, radius, spacing, typography } from '@/theme';

export interface NutritionCardProps {
  title: string;
  value: string;
  unit?: string;
  caption?: string;
  trend?: 'up' | 'down' | 'flat';
  trendLabel?: string;
  icon?: React.ReactNode;
  tone?: 'brand' | 'success' | 'warning' | 'info';
}

const toneAccent: Record<NonNullable<NutritionCardProps['tone']>, string> = {
  brand: palette.primary,
  success: palette.success,
  warning: palette.warning,
  info: palette.info,
};

export function NutritionCard({
  title,
  value,
  unit,
  caption,
  trend,
  trendLabel,
  icon,
  tone = 'brand',
}: NutritionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {icon ? <View style={[styles.iconWrap, { backgroundColor: toneAccent[tone] + '22' }]}>{icon}</View> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      <View style={styles.footerRow}>
        {trend ? <Text style={[styles.trend, { color: toneAccent[tone] }]}>{trendArrow(trend)}</Text> : null}
        {trendLabel ? <Text style={styles.caption}>{trendLabel}</Text> : null}
        {!trendLabel && caption ? <Text style={styles.caption}>{caption}</Text> : null}
      </View>
    </View>
  );
}

function trendArrow(t: 'up' | 'down' | 'flat') {
  return t === 'up' ? '↑' : t === 'down' ? '↓' : '→';
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.bodyMedium,
    color: palette.textSecondary,
    flex: 1,
  },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  value: {
    ...typography.display,
    color: palette.textPrimary,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  unit: {
    ...typography.body,
    color: palette.textSecondary,
  },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trend: { ...typography.bodyMedium, fontWeight: '700' },
  caption: { ...typography.caption, color: palette.textSecondary },
});
