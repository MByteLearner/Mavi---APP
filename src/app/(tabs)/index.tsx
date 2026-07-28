import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useUserStore } from '@/stores/useUserStore';
import { useSessionStore } from '@/stores/useSessionStore';
import {
  CaloriesRing,
  MacroProgress,
  AIRecommendationCard,
  FoodCard,
  Avatar,
  Chip,
} from '@/components/ui';
import {
  ScanLine,
  Flame,
  Heart,
  Plus,
  ChevronRight,
  Water,
  Target,
  Scale,
} from '@/components/ui/icons';
import { palette, spacing, typography } from '@/theme';

export default function HomeScreen() {
  const streak = useUserStore((state) => state.streak);
  const hasActiveRecipe = useSessionStore((state) => state.activeRecipeId !== null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.appBar}>
          <View style={styles.appBarLeft}>
            <Avatar name="María García" size="md" />
            <View>
              <Text style={styles.greeting}>Hola, María 👋</Text>
              <Text style={styles.greetingSub}>Sigamos con tu plan</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notificaciones"
            style={styles.bell}
          >
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        <View style={styles.streakRow}>
          <Chip
            tone="brand"
            icon={<Flame size={14} color={palette.primary} />}
            label={`${streak} días de racha`}
          />
          <Chip
            tone="success"
            icon={<Heart size={14} color={palette.success} />}
            label="Plan activo"
          />
        </View>

        <View style={styles.ringCard}>
          <View style={styles.ringHeader}>
            <View>
              <Text style={styles.ringTitle}>Calorías de hoy</Text>
              <Text style={styles.ringSub}>Objetivo: 2.200 kcal</Text>
            </View>
          </View>
          <View style={styles.ringBody}>
            <CaloriesRing consumed={1450} target={2200} size={180} />
          </View>
          <View style={styles.macrosRow}>
            <MacroProgress label="Proteínas" current={85} target={140} color={palette.primary} unit="g" />
            <MacroProgress label="Carbos" current={160} target={240} color={palette.secondary} unit="g" />
            <MacroProgress label="Grasas" current={45} target={70} color={palette.info} unit="g" />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
              <Water size={20} color={palette.info} />
            </View>
            <Text style={styles.statValue}>5/8</Text>
            <Text style={styles.statLabel}>Agua</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FFEDED' }]}>
              <Scale size={20} color={palette.primary} />
            </View>
            <Text style={styles.statValue}>68.4</Text>
            <Text style={styles.statLabel}>Peso kg</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF8E1' }]}>
              <Target size={20} color={palette.warning} />
            </View>
            <Text style={styles.statValue}>3/5</Text>
            <Text style={styles.statLabel}>Metas</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recomendaciones IA</Text>
            <Pressable hitSlop={8}>
              <Text style={styles.sectionAction}>Ver todas</Text>
            </Pressable>
          </View>
          <View style={{ gap: spacing.md }}>
            <AIRecommendationCard
              title="Sumá 20g de proteína"
              body="Hoy te faltaron 20g de proteína. Probá un yogurt griego como snack."
              tag="Hoy"
            />
            <AIRecommendationCard
              title="Aumentá tu hidratación"
              body="Vas 3 vasos por detrás. Un vaso de agua antes de cenar puede ayudar."
              tag="Recordatorio"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimas comidas</Text>
            <Pressable hitSlop={8}>
              <Text style={styles.sectionAction}>Ver historial</Text>
            </Pressable>
          </View>
          <View style={{ gap: spacing.sm }}>
            <FoodCard
              title="Avena con manzana"
              subtitle="320 kcal · 14:00"
              calories={320}
              time="Hoy"
              emoji="🥣"
            />
            <FoodCard
              title="Pollo a la plancha"
              subtitle="450 kcal · 20:30"
              calories={450}
              time="Ayer"
              emoji="🍗"
            />
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.actionBtn, styles.actionPrimary]}
            onPress={() => router.push('/scan')}
          >
            <View style={styles.actionIcon}>
              <ScanLine size={20} color={palette.textInverse} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Escanear plan</Text>
              <Text style={styles.actionSubtitle}>Subí tu dieta médica</Text>
            </View>
            <ChevronRight size={20} color={palette.textInverse} />
          </Pressable>

          <Pressable
            style={styles.actionBtn}
            onPress={() => router.push('/(tabs)/nutrition')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFEDED' }]}>
              <Plus size={20} color={palette.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.actionTitle, { color: palette.textPrimary }]}>
                {hasActiveRecipe ? 'Continuar receta' : 'Nueva receta'}
              </Text>
              <Text style={[styles.actionSubtitle, { color: palette.textSecondary }]}>
                {hasActiveRecipe ? 'Volvé a tu preparación' : 'Elegí una receta'}
              </Text>
            </View>
            <ChevronRight size={20} color={palette.textSecondary} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing['2xl'] },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  appBarLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  greeting: { ...typography.bodyMedium, color: palette.textPrimary, fontWeight: '600' },
  greetingSub: { ...typography.caption, color: palette.textSecondary, marginTop: 2 },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.primary,
    borderWidth: 2,
    borderColor: palette.surface,
  },
  streakRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  ringCard: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  ringHeader: { marginBottom: spacing.md },
  ringTitle: { ...typography.heading, color: palette.textPrimary },
  ringSub: { ...typography.caption, color: palette.textSecondary, marginTop: 2 },
  ringBody: { alignItems: 'center', marginBottom: spacing.lg },
  macrosRow: { gap: spacing.md },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    ...typography.bodyMedium,
    color: palette.textPrimary,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  statLabel: { ...typography.caption, color: palette.textSecondary },
  section: { marginTop: spacing.lg, marginBottom: spacing.md },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.heading, color: palette.textPrimary, fontWeight: '700' },
  sectionAction: { ...typography.bodyMedium, color: palette.primary, fontWeight: '600' },
  actionsRow: { marginTop: spacing.md, gap: spacing.sm },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: spacing.md,
    gap: spacing.md,
  },
  actionPrimary: { backgroundColor: palette.primary },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: { ...typography.bodyMedium, color: palette.textInverse, fontWeight: '700' },
  actionSubtitle: { ...typography.caption, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
});
