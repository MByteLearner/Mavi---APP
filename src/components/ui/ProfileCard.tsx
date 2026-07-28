import { Text, View, StyleSheet } from 'react-native';
import { palette, radius, spacing, typography } from '@/theme';
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
  return (
    <Card variant="elevated" padding="lg">
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
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
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.level}>{level}</Text>
        </View>
        {streak > 0 ? (
          <View style={styles.streakBadge}>
            <Text style={styles.streakValue}>{streak}</Text>
            <Text style={styles.streakLabel}>días</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.statsRow}>
        <Stat label="Peso" value={`${weight} kg`} />
        <Stat label="Altura" value={`${height} cm`} />
        <Stat label="Edad" value={`${age} años`} />
        <Stat label="Objetivo" value={goal} />
      </View>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.titleSecondary,
    color: palette.textInverse,
    fontWeight: '700',
  },
  info: { flex: 1 },
  name: { ...typography.titleSecondary, color: palette.textPrimary, fontWeight: '700' },
  level: { ...typography.caption, color: palette.textSecondary, marginTop: 2 },
  streakBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFEDED',
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  streakValue: { ...typography.bodyMedium, color: palette.primary, fontWeight: '700' },
  streakLabel: { ...typography.label, color: palette.primary, marginTop: -2 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.divider,
  },
  stat: { alignItems: 'center' },
  statValue: {
    ...typography.bodyMedium,
    color: palette.textPrimary,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  statLabel: { ...typography.label, color: palette.textSecondary, marginTop: 2 },
});
