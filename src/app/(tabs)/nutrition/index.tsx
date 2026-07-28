import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useUserStore } from '@/stores/useUserStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { RECIPES } from '@/constants/recipes';
import {
  ScreenHeader,
  Chip,
  EmptyState,
  Button,
  AnimatedEntry,
} from '@/components/ui';
import { ChevronRight } from '@/components/ui/icons';
import { palette, radius, spacing, typography } from '@/theme';

import { useThemeColors } from '@/theme';

export default function NutritionScreen() {
  const colors = useThemeColors();
  const hasScannedPlan = useUserStore((state) => state.hasScannedPlan);
  const activeRecipeId = useSessionStore((state) => state.activeRecipeId);
  const startWeighing = useSessionStore((state) => state.startWeighing);

  if (!hasScannedPlan) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.container}>
          <AnimatedEntry>
            <ScreenHeader
              eyebrow="Nutrición"
              title="Tu plan"
              subtitle="Recetas personalizadas según tu dieta médica"
            />
          </AnimatedEntry>
          <EmptyState
            illustration="recipe"
            title="Aún no escaneaste tu plan"
            body="Subí tu dieta médica y te mostraremos recetas pensadas para tus objetivos."
            action={
              <Button
                label="Escanear mi plan"
                size="md"
                fullWidth={false}
                onPress={() => router.push('/scan')}
              />
            }
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
            eyebrow="Nutrición"
            title="Recetas para hoy"
            subtitle="Elegí una opción para tu próxima comida"
          />
        </AnimatedEntry>

        <AnimatedEntry delay={80}>
          <View style={styles.filterRow}>
            <Chip label="Todas" tone="brand" />
            <Chip label="Desayuno" tone="neutral" />
            <Chip label="Almuerzo" tone="neutral" />
            <Chip label="Cena" tone="neutral" />
            <Chip label="Snack" tone="neutral" />
          </View>
        </AnimatedEntry>

        <View style={styles.list}>
          {RECIPES.map((recipe, idx) => {
            const isSelected = activeRecipeId === recipe.id;
            return (
              <AnimatedEntry key={recipe.id} delay={140 + idx * 60}>
                <Pressable
                  onPress={() => {
                    startWeighing(recipe.id);
                    router.push('/preparation');
                  }}
                  style={({ pressed }) => [
                    styles.item,
                    isSelected && styles.itemSelected,
                    pressed && styles.itemPressed,
                  ]}
                >
                  <View style={styles.itemEmoji}>
                    <Text style={styles.itemEmojiText}>{recipe.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{recipe.name}</Text>
                    <Text style={styles.itemDescription}>{recipe.description}</Text>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemMetaText}>
                        {recipe.ingredients.length} ingredientes
                      </Text>
                      <Text style={styles.itemMetaDot}>·</Text>
                      <Text style={styles.itemMetaText}>{recipe.calories} kcal</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={palette.textDisabled} />
                </Pressable>
              </AnimatedEntry>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 110 },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
  },
  list: { gap: spacing.md },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
  },
  itemSelected: { borderColor: palette.primary, borderWidth: 2 },
  itemPressed: { transform: [{ scale: 0.98 }] },
  itemEmoji: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: palette.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmojiText: { fontSize: 28 },
  itemName: { ...typography.bodyMedium, color: palette.textPrimary, fontWeight: '700' },
  itemDescription: { ...typography.caption, color: palette.textSecondary, marginTop: 2 },
  itemMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  itemMetaText: { ...typography.caption, color: palette.textSecondary },
  itemMetaDot: { ...typography.caption, color: palette.textDisabled },
});
