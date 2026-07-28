import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useUserStore } from '@/stores/useUserStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  CaloriesRing,
  MacroProgress,
  AIRecommendationCard,
  FoodCard,
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
  Leaf,
  BookOpen,
} from '@/components/ui/icons';
import { palette, radius, shadow, spacing, typography } from '@/theme';

import { useThemeColors } from '@/theme';

export default function HomeScreen() {
  const colors = useThemeColors();
  const streak = useUserStore((state) => state.streak);
  const hasActiveRecipe = useSessionStore((state) => state.activeRecipeId !== null);
  const user = useAuthStore((s) => s.user);
  const userName = user?.name?.split(' ')[0] ?? 'Usuario';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <AnimatedEntry delay={0}>
          <View style={styles.appBar}>
            <View style={styles.appBarLeft}>
              {/* Logo MAVI */}
              <View style={[styles.logoMark, { backgroundColor: colors.primary }]}>
                <Leaf size={20} color={colors.textInverse} />
              </View>
              <View>
                <Text style={[styles.greeting, { color: colors.textPrimary }]}>Hola, {userName} 👋</Text>
                <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>¿Listo para comer bien hoy?</Text>
              </View>
            </View>
            {/* Racha — naranja cálido */}
            <Pressable style={[styles.streakBadge, { backgroundColor: colors.secondarySoft, borderColor: colors.secondary + '44' }]} accessibilityLabel={`Racha de ${streak} días`}>
              <Flame size={14} color={colors.secondary} />
              <Text style={[styles.streakText, { color: colors.secondaryDark }]}>{streak} días</Text>
            </Pressable>
          </View>
        </AnimatedEntry>

        {/* ── Acciones principales — Tarjetas grandes ── */}
        <AnimatedEntry delay={80}>
          <View style={styles.heroCards}>
            {/* Tarjeta Escanear Plan */}
            <Pressable
              style={[styles.heroCard, { backgroundColor: colors.primary }, shadow.lg]}
              onPress={() => router.push('/scan')}
              accessibilityRole="button"
              accessibilityLabel="Escanear plan médico"
            >
              <View style={styles.heroCardIconWrapper}>
                <ScanLine size={28} color={colors.textInverse} />
              </View>
              <Text style={[styles.heroCardTitle, { color: colors.textInverse }]}>Escanear{'\n'}Plan Médico</Text>
              <Text style={styles.heroCardSub}>Subí tu dieta en PDF o foto</Text>
              <View style={styles.heroCardArrow}>
                <ChevronRight size={16} color="rgba(255,255,255,0.7)" />
              </View>
            </Pressable>

            {/* Tarjeta Receta */}
            <Pressable
              style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1.5 }, shadow.sm]}
              onPress={() => router.push('/(tabs)/nutrition')}
              accessibilityRole="button"
              accessibilityLabel={hasActiveRecipe ? 'Continuar receta' : 'Nueva receta'}
            >
              <View style={[styles.heroCardIconWrapper, { backgroundColor: colors.primarySoft }]}>
                <BookOpen size={28} color={colors.primary} />
              </View>
              <Text style={[styles.heroCardTitle, { color: colors.textPrimary }]}>
                {hasActiveRecipe ? 'Continuar\nReceta' : 'Nueva\nReceta'}
              </Text>
              <Text style={[styles.heroCardSub, { color: colors.textSecondary }]}>
                {hasActiveRecipe ? 'Volvé a tu preparación' : 'Elegí una receta de tu plan'}
              </Text>
              <View style={styles.heroCardArrow}>
                <ChevronRight size={16} color={colors.textSecondary} />
              </View>
            </Pressable>
          </View>
        </AnimatedEntry>

        {/* ── Estadísticas rápidas ── */}
        <AnimatedEntry delay={160}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.statIcon, { backgroundColor: colors.infoSoft }]}>
                <Water size={20} color={colors.info} />
              </View>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>5/8</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Agua</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.statIcon, { backgroundColor: colors.successSoft }]}>
                <Scale size={20} color={colors.success} />
              </View>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>68.4</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Peso kg</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.statIcon, { backgroundColor: colors.secondarySoft }]}>
                <Target size={20} color={colors.secondary} />
              </View>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>3/5</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Metas</Text>
            </View>
          </View>
        </AnimatedEntry>

        {/* ── Calorías del día ── */}
        <AnimatedEntry delay={240}>
          <View style={[styles.ringCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.ringCardHeader}>
              <Text style={[styles.ringTitle, { color: colors.textPrimary }]}>Calorías de hoy</Text>
              <Text style={[styles.ringSub, { color: colors.textSecondary }]}>Objetivo · 2.200 kcal</Text>
            </View>
            <View style={styles.ringBody}>
              <CaloriesRing consumed={1450} target={2200} size={200} />
            </View>
            <View style={[styles.macroDivider, { backgroundColor: colors.divider }]} />
            <View style={styles.macrosRow}>
              <MacroProgress label="Proteínas" current={85} target={140} color={colors.primary} unit="g" />
              <MacroProgress label="Carbohidratos" current={160} target={240} color={colors.secondary} unit="g" />
              <MacroProgress label="Grasas" current={45} target={70} color={colors.info} unit="g" />
            </View>
          </View>
        </AnimatedEntry>

        {/* ── Recomendaciones IA ── */}
        <AnimatedEntry delay={320}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Para vos hoy</Text>
              <Pressable hitSlop={8} onPress={() => router.push('/(tabs)/ia')}>
                <Text style={[styles.sectionAction, { color: colors.primary }]}>Chat con IA</Text>
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

        {/* ── Últimas comidas ── */}
        <AnimatedEntry delay={400}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Últimas comidas</Text>
              <Pressable hitSlop={8} onPress={() => router.push('/(tabs)/history')}>
                <Text style={[styles.sectionAction, { color: colors.primary }]}>Progreso</Text>
              </Pressable>
            </View>
            <View style={{ gap: spacing.sm }}>
              <FoodCard
                title="Avena con manzana"
                subtitle="Desayuno · 08:00"
                calories={320}
                time="Hoy"
                emoji="🥣"
              />
              <FoodCard
                title="Pollo a la plancha"
                subtitle="Almuerzo · 13:30"
                calories={450}
                time="Hoy"
                emoji="🍗"
              />
            </View>
          </View>
        </AnimatedEntry>
      </ScrollView>

      {/* ── FAB Naranja — Acción secundaria ── */}
      <Pressable
        style={[styles.fab, { backgroundColor: colors.secondary }]}
        onPress={() => router.push('/scan')}
        accessibilityRole="button"
        accessibilityLabel="Escanear plan"
      >
        <Plus size={28} color={palette.textInverse} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'] + 110, // espacio para el glass tab bar flotante
  },

  // ── App Bar ──
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  appBarLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  greeting: {
    ...typography.bodyMedium,
    color: palette.textPrimary,
    fontFamily: 'Fraunces_500Medium',
    fontSize: 17,
  },
  subGreeting: {
    ...typography.caption,
    color: palette.textSecondary,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: '#FFE0B2',
  },
  streakText: {
    ...typography.label,
    color: '#E65100',
    fontWeight: '700',
    fontSize: 12,
  },

  // ── Hero Cards ──
  heroCards: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  heroCard: {
    flex: 1,
    borderRadius: radius.card,
    padding: spacing.md,
    minHeight: 160,
    justifyContent: 'flex-end',
    gap: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  heroCardPrimary: {
    backgroundColor: palette.primary,
    ...shadow.lg,
  },
  heroCardSecondary: {
    backgroundColor: palette.surface,
    borderWidth: 1.5,
    borderColor: palette.border,
    ...shadow.sm,
  },
  heroCardIconWrapper: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCardIconMint: {
    backgroundColor: palette.primarySoft,
  },
  heroCardTitle: {
    ...typography.subheading,
    color: palette.textInverse,
    fontFamily: 'Fraunces_700Bold',
    fontSize: 17,
    lineHeight: 22,
    marginTop: 8,
  },
  heroCardSub: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 4,
  },
  heroCardArrow: {
    alignSelf: 'flex-start',
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.sm,
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
  },
  statLabel: { ...typography.caption, color: palette.textSecondary },

  // ── Calories Ring ──
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
  ringTitle: {
    ...typography.titleSecondary,
    color: palette.textPrimary,
    fontFamily: 'Fraunces_500Medium',
  },
  ringSub: { ...typography.caption, color: palette.textSecondary, marginTop: 4 },
  ringBody: { alignItems: 'center', marginBottom: spacing.lg },
  macroDivider: {
    height: 1,
    backgroundColor: palette.divider,
    marginBottom: spacing.lg,
  },
  macrosRow: { gap: spacing.md },

  // ── Sections ──
  section: { marginTop: spacing.sm, marginBottom: spacing.md },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.titleSecondary,
    color: palette.textPrimary,
    fontFamily: 'Fraunces_500Medium',
  },
  sectionAction: {
    ...typography.bodyMedium,
    color: palette.primary,
    fontWeight: '600',
  },

  // ── FAB Naranja ──
  fab: {
    position: 'absolute',
    bottom: spacing.xl + 80, // sobre el tab bar
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.orange,
  },
});
