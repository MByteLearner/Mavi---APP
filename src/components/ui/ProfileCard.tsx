import { Text, View, StyleSheet } from 'react-native';
import { radius, spacing, typography, useThemeColors } from '@/theme';
import { Card } from './Card';

export interface ProfileCardProps {
  name: string;
  level?: string;
  streak?: number;
  weight?: string;
  height?: string;
  age?: number;
  goal?: string;
}

export function ProfileCard({
  name,
  level = 'Nivel Nutricional',
  streak = 0,
  weight = '--',
  height = '--',
  age = 0,
  goal = 'Mantener',
}: ProfileCardProps) {
  const colors = useThemeColors();

  return (
    <Card variant="elevated" padding="lg">
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.textInverse }]}>
            {name
              .split(' ')
              .map((p) => p[0])
              .filter(Boolean)
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{name}</Text>
          <Text style={[styles.level, { color: colors.textSecondary }]}>{level}</Text>
        </View>
        {streak > 0 ? (
          <View style={[styles.streakBadge, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.streakValue, { color: colors.primary }]}>{streak}</Text>
            <Text style={[styles.streakLabel, { color: colors.primary }]}>días</Text>
          </View>
        ) : null}
      </View>
      <View style={[styles.statsRow, { borderTopColor: colors.divider }]}>
        <Stat label="Peso" value={`${weight} kg`} colors={colors} />
        <Stat label="Altura" value={`${height} cm`} colors={colors} />
        <Stat label="Edad" value={`${age} años`} colors={colors} />
        <Stat label="Objetivo" value={goal} colors={colors} />
      </View>
    </Card>
  );
}

function Stat({ label, value, colors }: { label: string; value: string; colors: ReturnType<typeof useThemeColors> }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: colors.textPrimary }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.titleSecondary,
    fontWeight: '700',
  },
  info: { flex: 1 },
  name: { ...typography.titleSecondary, fontWeight: '700' },
  level: { ...typography.caption, marginTop: 2 },
  streakBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  streakValue: { ...typography.bodyMedium, fontWeight: '700' },
  streakLabel: { ...typography.label, marginTop: -2 },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.lg,
    columnGap: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
  },
  stat: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '22%',
    minWidth: 64,
    alignItems: 'flex-start',
    paddingRight: spacing.sm,
  },
  statValue: {
    ...typography.bodyMedium,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    ...typography.label,
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
