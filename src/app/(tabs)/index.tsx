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
  Hero,
  AnimatedEntry,
} from '@/components/ui';
import {
  ScanLine,
  Flame,
  Plus,
  ChevronRight,
  Water,
  Target,
  Scale,
} from '@/components/ui/icons';
import { palette, radius, shadow, spacing, typography } from '@/theme';

export default function HomeScreen() {
  const streak = useUserStore((state) => state.streak);
  const hasActiveRecipe = useSessionStore((state) => state.activeRecipeId !== null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedEntry delay={0}>
          <View style={styles.appBar}>
            <View style={styles.appBarLeft}>
              <Avatar name="María García" size="md" />
              <View>
                <Text style={styles.eyebrow}>Hoy</Text>
                <Text style={styles.appBarGreeting}>María García</Text>
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
        </AnimatedEntry>

        <AnimatedEntry delay={80}>
          <View style={styles.streakRow}>
            <Chip
              tone="brand"
              icon={<Flame size={14} color={palette.primary} />}
              label={`${streak} días de racha`}
            />
            <Chip label="Plan activo" tone="success" />
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={160}>
          <Hero
            eyebrow="Hoy"
            title="Tu día se ve así"
            accentWords={["así"]}
            subtitle="Llevás 1.450 kcal de 2.200. Mantené el ritmo."
          />
        </AnimatedEntry>

        <AnimatedEntry delay={240}>
          <View style={styles.ringCard}>
            <View style={styles.ringCardHeader}>
              <Text style={styles.ringTitle}>Calorías</Text>
              <Text style={styles.ringSub}>Objetivo · 2.200 kcal</Text>
            </View>
            <View style={styles.ringBody}>
              <CaloriesRing consumed={1450} target={2200} size={200} />
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macrosRow}>
              <MacroProgress label="Proteínas" current={85} target={140} color={palette.primary} unit="g" />
              <MacroProgress label="Carbohidratos" current={160} target={240} color={palette.secondary} unit="g" />
              <MacroProgress label="Grasas" current={45} target={70} color={palette.info} unit="g" />
            </View>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={320}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: palette.infoSoft }]}>
                <Water size={20} color={palette.info} />
              </View>
              <Text style={styles.statValue}>5/8</Text>
              <Text style={styles.statLabel}>Agua</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: palette.successSoft }]}>
                <Scale size={20} color={palette.success} />
              </View>
              <Text style={styles.statValue}>68.4</Text>
              <Text style={styles.statLabel}>Peso kg</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: palette.warningSoft }]}>
                <Target size={20} color={palette.warning} />
              </View>
              <Text style={styles.statValue}>3/5</Text>
              <Text style={styles.statLabel}>Metas</Text>
            </View>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={400}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Para vos</Text>
              <Pressable hitSlop={8}>
                <Text style={styles.sectionAction}>Ver todo</Text>
              </Pressable>
            </View>
            <View style={{ gap: spacing.md }}>
              <AIRecommendationCard
                title="Sumá 20 g de proteína"
                body="Hoy te faltaron 20 g de proteína. Probá un yogurt griego como snack."
                tag="Hoy"
              />
              <AIRecommendationCard
                title="Aumentá tu hidratación"
                body="Vas 3 vasos por detrás. Un vaso de agua antes de cenar puede ayudar."
                tag="Recordatorio"
              />
            </View>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={480}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Últimas comidas</Text>
              <Pressable hitSlop={8}>
                <Text style={styles.sectionAction}>Historial</Text>
              </Pressable>
            </View>
            <View style={{ gap: spacing.sm }}>
              <FoodCard
                title="Avena con manzana"
                subtitle="Desayuno · 14:00"
                calories={320}
                time="Hoy"
                emoji="🥣"
              />
              <FoodCard
                title="Pollo a la plancha"
                subtitle="Almuerzo · 20:30"
                calories={450}
                time="Ayer"
                emoji="🍗"
              />
            </View>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={560}>
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
              <View style={[styles.actionIcon, { backgroundColor: palette.primarySoft }]}>
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
        </AnimatedEntry>
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
  eyebrow: { ...typography.overline, color: palette.textSecondary, marginBottom: 2 },
  appBarGreeting: { ...typography.bodyMedium, color: palette.textPrimary, fontFamily: 'Fraunces_500Medium', fontSize: 18 },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
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
    borderRadius: radius.card,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.sm,
  },
  ringCardHeader: { marginBottom: spacing.lg },
  ringTitle: { ...typography.titleSecondary, color: palette.textPrimary },
  ringSub: { ...typography.caption, color: palette.textSecondary, marginTop: 4 },
  ringBody: { alignItems: 'center', marginBottom: spacing.lg },
  macroDivider: {
    height: 1,
    backgroundColor: palette.divider,
    marginBottom: spacing.lg,
  },
  macrosRow: { gap: spacing.md },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: palette.border,
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
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.titleSecondary, color: palette.textPrimary, fontFamily: 'Fraunces_500Medium' },
  sectionAction: { ...typography.bodyMedium, color: palette.primary, fontWeight: '600' },
  actionsRow: { marginTop: spacing.md, gap: spacing.sm },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
  },
  actionPrimary: { backgroundColor: palette.primary, borderColor: palette.primary },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: { ...typography.bodyMedium, color: palette.textInverse, fontWeight: '700' },
  actionSubtitle: { ...typography.caption, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
});
