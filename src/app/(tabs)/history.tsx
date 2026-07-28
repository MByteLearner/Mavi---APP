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
} from '@/components/ui';
import { History, Flame, Scale, Target } from '@/components/ui/icons';
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
      { title: 'Avena con manzana', subtitle: '320 kcal · Desayuno', calories: 320, time: '08:00', emoji: '🥣' },
      { title: 'Pollo a la plancha', subtitle: '450 kcal · Almuerzo', calories: 450, time: '13:30', emoji: '🍗' },
      { title: 'Yogurt griego', subtitle: '120 kcal · Snack', calories: 120, time: '17:00', emoji: '🥛' },
    ],
  },
  {
    date: '2026-07-27',
    label: 'Ayer',
    total: 1980,
    items: [
      { title: 'Tostadas integrales', subtitle: '280 kcal · Desayuno', calories: 280, time: '08:30', emoji: '🍞' },
      { title: 'Salmón con espárragos', subtitle: '410 kcal · Cena', calories: 410, time: '20:00', emoji: '🐟' },
    ],
  },
];

export default function HistoryScreen() {
  const streak = useUserStore((state) => state.streak);

  if (historyData.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.container}>
          <ScreenHeader title="Historial" subtitle="Tus comidas y progreso" />
          <EmptyState
            icon={<History size={40} color={palette.primary} />}
            title="Sin historial aún"
            body="Empezá a registrar tus comidas para ver tu progreso."
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Historial"
          subtitle="Tus comidas y progreso reciente"
        />

        <View style={styles.metricsRow}>
          <NutritionCard
            title="Racha"
            value={streak.toString()}
            unit="días"
            caption="Mejor racha: 14"
            icon={<Flame size={18} color={palette.primary} />}
            tone="brand"
          />
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Metas semanales</Text>
          </View>
          <View style={{ gap: spacing.md }}>
            <GoalCard title="Comidas registradas" current={4} target={5} caption="3/5 días" />
            <GoalCard title="Agua diaria" current={6} target={8} unit="v" caption="Promedio: 6.2 vasos" />
            <GoalCard title="Pasos diarios" current={7800} target={10000} caption="Promedio: 7.2k" />
          </View>
        </View>

        {historyData.map((day) => (
          <View key={day.date} style={styles.day}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayLabel}>{day.label}</Text>
              <Chip
                tone="brand"
                icon={<Target size={14} color={palette.primary} />}
                label={`${day.total} kcal`}
              />
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
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing['2xl'] },
  metricsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionHeader: { marginBottom: spacing.md },
  sectionTitle: { ...typography.heading, color: palette.textPrimary, fontWeight: '700' },
  day: { marginBottom: spacing.lg },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  dayLabel: { ...typography.subheading, color: palette.textPrimary, fontWeight: '700' },
});
