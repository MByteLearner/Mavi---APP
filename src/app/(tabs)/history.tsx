import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUserStore } from '@/stores/useUserStore';
import {
  ScreenHeader,
  Chip,
  FoodCard,
  GoalCard,
  NutritionCard,
  EmptyState,
  AnimatedEntry,
} from '@/components/ui';
import { Flame, Scale } from '@/components/ui/icons';
import { palette, spacing, typography } from '@/theme';

interface HistoryDay {
  date: string;
  label: string;
  total: number;
  items: { title: string; subtitle: string; calories: number; time: string; emoji: string }[];
}

const historyData: HistoryDay[] = [
  {
    date: '2026-07-28',
    label: 'Hoy',
    total: 1450,
    items: [
      { title: 'Avena con manzana', subtitle: 'Desayuno · 08:00', calories: 320, time: 'Hoy', emoji: '🥣' },
      { title: 'Pollo a la plancha', subtitle: 'Almuerzo · 13:30', calories: 450, time: 'Hoy', emoji: '🍗' },
      { title: 'Yogurt griego', subtitle: 'Snack · 17:00', calories: 120, time: 'Hoy', emoji: '🥛' },
    ],
  },
  {
    date: '2026-07-27',
    label: 'Ayer',
    total: 1980,
    items: [
      { title: 'Tostadas integrales', subtitle: 'Desayuno · 08:30', calories: 280, time: 'Ayer', emoji: '🍞' },
      { title: 'Salmón con espárragos', subtitle: 'Cena · 20:00', calories: 410, time: 'Ayer', emoji: '🐟' },
    ],
  },
];

import { useThemeColors } from '@/theme';

export default function HistoryScreen() {
  const colors = useThemeColors();
  const streak = useUserStore((state) => state.streak);

  if (historyData.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.container}>
          <ScreenHeader eyebrow="Historial" title="Tu actividad" subtitle="Comidas registradas y progreso reciente" />
          <EmptyState
            illustration="history"
            title="Aún no hay historial"
            body="Empezá a registrar tus comidas para ver tu progreso en el tiempo."
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedEntry>
          <ScreenHeader
            eyebrow="Historial"
            title="Tu actividad"
            subtitle="Comidas registradas y progreso reciente"
          />
        </AnimatedEntry>

        <AnimatedEntry delay={80}>
          <View style={styles.metricsRow}>
            <View style={styles.metricWrapper}>
              <NutritionCard
                title="Racha"
                value={streak.toString()}
                unit="días"
                caption="Mejor racha: 14"
                icon={<Flame size={18} color={palette.primary} />}
                tone="brand"
              />
            </View>
            <View style={styles.metricWrapper}>
              <NutritionCard
                title="Peso"
                value="68.4"
                unit="kg"
                caption="-0.6 kg esta semana"
                trend="down"
                trendLabel="-0.6 vs semana"
                icon={<Scale size={18} color={palette.success} />}
                tone="success"
              />
            </View>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={160}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Metas semanales</Text>
            <View style={{ gap: spacing.md, marginTop: spacing.md }}>
              <GoalCard title="Comidas registradas" current={4} target={5} caption="3/5 días" />
              <GoalCard title="Agua diaria" current={6} target={8} unit="v" caption="Promedio: 6.2 vasos" />
              <GoalCard title="Pasos diarios" current={7800} target={10000} caption="Promedio: 7.2k" />
            </View>
          </View>
        </AnimatedEntry>

        {historyData.map((day, dayIdx) => (
          <AnimatedEntry key={day.date} delay={240 + dayIdx * 80}>
            <View style={styles.day}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayLabel}>{day.label}</Text>
                <Chip tone="brand" label={`${day.total} kcal`} />
              </View>
              <View style={{ gap: spacing.sm }}>
                {day.items.map((item, idx) => (
                  <FoodCard
                    key={idx}
                    title={item.title}
                    subtitle={item.subtitle}
                    calories={item.calories}
                    time={item.time}
                    emoji={item.emoji}
                  />
                ))}
              </View>
            </View>
          </AnimatedEntry>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 110 },
  metricsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  metricWrapper: { flex: 1 },
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    ...typography.titleSecondary,
    color: palette.textPrimary,
    fontFamily: 'Fraunces_500Medium',
  },
  day: { marginBottom: spacing.lg },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  dayLabel: { ...typography.subheading, color: palette.textPrimary, fontWeight: '700' },
});
