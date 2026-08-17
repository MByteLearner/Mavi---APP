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
  FileText,
} from '@/components/ui/icons';
import { useThemeColors, type PaletteColors, radius, shadow, spacing, typography } from '@/theme';

export default function HomeScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const streak = useUserStore((state) => state.streak);
  const hasScannedPlan = useUserStore((state) => state.hasScannedPlan);
  const hasActiveRecipe = useSessionStore((state) => state.activeRecipeId !== null);
  const user = useAuthStore((s) => s.user);
  const userName = user?.name?.split(' ')[0] ?? 'Usuario';

  const hasPlan = hasScannedPlan || Boolean(user?.guideline);

  if (!hasPlan) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <AnimatedEntry delay={0}>
            <View style={styles.appBar}>
              <View style={styles.appBarLeft}>
                <View style={styles.logoMark}>
                  <Leaf size={20} color={colors.textInverse} />
                </View>
                <View>
                  <Text style={styles.greeting}>Hola, {userName} 👋</Text>
                  <Text style={styles.subGreeting}>Bienvenido a MAVI</Text>
                </View>
              </View>
            </View>
          </AnimatedEntry>

          {/* Estado Inicial Solicitando Plan Alimenticio */}
          <AnimatedEntry delay={100}>
            <View style={styles.welcomeCard}>
              <View style={styles.welcomeIconWrapper}>
                <FileText size={38} color={colors.primary} />
              </View>
              <Text style={styles.welcomeTitle}>Cargá tu Plan Alimenticio</Text>
              <Text style={styles.welcomeDescription}>
                Para poder sugerirte recetas personalizadas y realizar el seguimiento de tu nutrición, por favor escaneá o subí tu plan médico nutricional.
              </Text>

              <Pressable
                style={styles.scanActionBtn}
                onPress={() => router.push('/scan')}
                accessibilityRole="button"
                accessibilityLabel="Subir o Escanear Plan Alimenticio"
              >
                <ScanLine size={20} color={colors.textInverse} />
                <Text style={styles.scanActionBtnText}>Escanear o Subir Plan</Text>
              </Pressable>
            </View>
          </AnimatedEntry>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <AnimatedEntry delay={0}>
          <View style={styles.appBar}>
            <View style={styles.appBarLeft}>
              {/* Logo MAVI */}
              <View style={styles.logoMark}>
                <Leaf size={20} color={colors.textInverse} />
              </View>
              <View>
                <Text style={styles.greeting}>Hola, {userName} 👋</Text>
                <Text style={styles.subGreeting}>¿Listo para comer bien hoy?</Text>
              </View>
            </View>
            {/* Racha — naranja cálido */}
            <Pressable style={styles.streakBadge} accessibilityLabel={`Racha de ${streak} días`}>
              <Flame size={14} color={colors.secondary} />
              <Text style={styles.streakText}>{streak} días</Text>
            </Pressable>
          </View>
        </AnimatedEntry>

        {/* ── Acciones principales — Tarjetas grandes ── */}
        <AnimatedEntry delay={80}>
          <View style={styles.heroCards}>
            {/* Tarjeta Escanear Plan */}
            <Pressable
              style={[styles.heroCard, styles.heroCardPrimary]}
              onPress={() => router.push('/scan')}
              accessibilityRole="button"
              accessibilityLabel="Escanear plan médico"
            >
              <View style={styles.heroCardIconWrapper}>
                <ScanLine size={28} color={colors.textInverse} />
              </View>
              <Text style={styles.heroCardTitlePrimary}>Escanear{'\n'}Plan Médico</Text>
              <Text style={styles.heroCardSubPrimary}>Subí tu dieta en PDF o foto</Text>
              <View style={styles.heroCardArrow}>
                <ChevronRight size={16} color="rgba(255,255,255,0.7)" />
              </View>
            </Pressable>

            {/* Tarjeta Receta */}
            <Pressable
              style={[styles.heroCard, styles.heroCardSecondary]}
              onPress={() => router.push('/(tabs)/nutrition')}
              accessibilityRole="button"
              accessibilityLabel={hasActiveRecipe ? 'Continuar receta' : 'Nueva receta'}
            >
              <View style={styles.heroCardIconMint}>
                <BookOpen size={28} color={colors.primary} />
              </View>
              <Text style={styles.heroCardTitleSecondary}>
                {hasActiveRecipe ? 'Continuar\nReceta' : 'Nueva\nReceta'}
              </Text>
              <Text style={styles.heroCardSubSecondary}>
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
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.infoSoft }]}>
                <Water size={20} color={colors.info} />
              </View>
              <Text style={styles.statValue}>5/8</Text>
              <Text style={styles.statLabel}>Agua</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.successSoft }]}>
                <Scale size={20} color={colors.success} />
              </View>
              <Text style={styles.statValue}>68.4</Text>
              <Text style={styles.statLabel}>Peso kg</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.secondarySoft }]}>
                <Target size={20} color={colors.secondary} />
              </View>
              <Text style={styles.statValue}>3/5</Text>
              <Text style={styles.statLabel}>Metas</Text>
            </View>
          </View>
        </AnimatedEntry>

        {/* ── Calorías del día ── */}
        <AnimatedEntry delay={240}>
          <View style={styles.ringCard}>
            <View style={styles.ringCardHeader}>
              <Text style={styles.ringTitle}>Calorías de hoy</Text>
              <Text style={styles.ringSub}>Objetivo · 2.200 kcal</Text>
            </View>
            <View style={styles.ringBody}>
              <CaloriesRing consumed={1450} target={2200} size={200} />
            </View>
            <View style={styles.macroDivider} />
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
              <Text style={styles.sectionTitle}>Para vos hoy</Text>
              <Pressable hitSlop={8} onPress={() => router.push('/chat-ia')}>
                <Text style={styles.sectionAction}>Chat con IA</Text>
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
              <Text style={styles.sectionTitle}>Últimas comidas</Text>
              <Pressable hitSlop={8} onPress={() => router.push('/(tabs)/history')}>
                <Text style={styles.sectionAction}>Progreso</Text>
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
        style={styles.fab}
        onPress={() => router.push('/scan')}
        accessibilityRole="button"
        accessibilityLabel="Escanear plan"
      >
        <Plus size={28} color={colors.textInverse} />
      </Pressable>
    </SafeAreaView>
  );
}

function createStyles(colors: PaletteColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing['2xl'] + 110,
    },

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
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadow.sm,
    },
    greeting: {
      ...typography.bodyMedium,
      color: colors.textPrimary,
      fontFamily: 'Fraunces_500Medium',
      fontSize: 17,
    },
    subGreeting: {
      ...typography.caption,
      color: colors.textSecondary,
      marginTop: 2,
    },
    streakBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: colors.secondarySoft,
      paddingHorizontal: spacing.md,
      paddingVertical: 7,
      borderRadius: radius.pill,
      borderWidth: 1.5,
      borderColor: colors.secondary + '44',
    },
    streakText: {
      ...typography.label,
      color: colors.secondaryDark,
      fontWeight: '700',
      fontSize: 12,
    },

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
      backgroundColor: colors.primary,
      ...shadow.lg,
    },
    heroCardSecondary: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
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
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroCardTitlePrimary: {
      ...typography.subheading,
      color: colors.textInverse,
      fontFamily: 'Fraunces_700Bold',
      fontSize: 17,
      lineHeight: 22,
      marginTop: 8,
    },
    heroCardTitleSecondary: {
      ...typography.subheading,
      color: colors.textPrimary,
      fontFamily: 'Fraunces_700Bold',
      fontSize: 17,
      lineHeight: 22,
      marginTop: 8,
    },
    heroCardSubPrimary: {
      ...typography.caption,
      color: 'rgba(255,255,255,0.75)',
      marginBottom: 4,
    },
    heroCardSubSecondary: {
      ...typography.caption,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    heroCardArrow: {
      alignSelf: 'flex-start',
    },

    statsRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.card,
      padding: spacing.md,
      alignItems: 'center',
      gap: 6,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.textPrimary,
      fontWeight: '700',
    },
    statLabel: { ...typography.caption, color: colors.textSecondary },

    ringCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.card,
      padding: spacing.xl,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow.sm,
    },
    ringCardHeader: { marginBottom: spacing.lg },
    ringTitle: {
      ...typography.titleSecondary,
      color: colors.textPrimary,
      fontFamily: 'Fraunces_500Medium',
    },
    ringSub: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
    ringBody: { alignItems: 'center', marginBottom: spacing.lg },
    macroDivider: {
      height: 1,
      backgroundColor: colors.divider,
      marginBottom: spacing.lg,
    },
    macrosRow: { gap: spacing.md },

    section: { marginTop: spacing.sm, marginBottom: spacing.md },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    sectionTitle: {
      ...typography.titleSecondary,
      color: colors.textPrimary,
      fontFamily: 'Fraunces_500Medium',
    },
    sectionAction: {
      ...typography.bodyMedium,
      color: colors.primary,
      fontWeight: '600',
    },

    fab: {
      position: 'absolute',
      bottom: spacing.xl + 80,
      right: spacing.lg,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadow.orange,
    },

    emptyContainer: {
      flexGrow: 1,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl + 80,
      justifyContent: 'center',
    },
    welcomeCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: radius.card,
      padding: spacing.xl,
      alignItems: 'center',
      gap: spacing.md,
      marginTop: spacing.md,
      ...shadow.sm,
    },
    welcomeIconWrapper: {
      width: 76,
      height: 76,
      borderRadius: 24,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xs,
    },
    welcomeTitle: {
      ...typography.titleSecondary,
      color: colors.textPrimary,
      fontFamily: 'Fraunces_600SemiBold',
      fontSize: 22,
      textAlign: 'center',
    },
    welcomeDescription: {
      ...typography.bodyMedium,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    scanActionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md + 2,
      borderRadius: radius.pill,
      width: '100%',
      marginTop: spacing.sm,
      ...shadow.sm,
    },
    scanActionBtnText: {
      ...typography.bodyMedium,
      color: colors.textInverse,
      fontWeight: '600',
    },
  });
}

