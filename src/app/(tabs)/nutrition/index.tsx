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
} from '@/components/ui';
import { ChevronRight, Nutrition } from '@/components/ui/icons';
import { palette, radius, spacing, typography } from '@/theme';

export default function NutritionScreen() {
  const hasScannedPlan = useUserStore((state) => state.hasScannedPlan);
  const activeRecipeId = useSessionStore((state) => state.activeRecipeId);
  const startWeighing = useSessionStore((state) => state.startWeighing);

  if (!hasScannedPlan) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.container}>
          <ScreenHeader
            title="Nutrición"
            subtitle="Recetas recomendadas para tu plan"
          />
          <EmptyState
            icon={<Nutrition size={40} color={palette.primary} />}
            title="Escaneá tu plan primero"
            body="Subí tu dieta médica y te mostraremos recetas pensadas para vos."
            action={
              <Button
                label="Escanear plan"
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Nutrición"
          subtitle="Recetas para tu plan de hoy"
        />

        <View style={styles.filterRow}>
          <Chip label="Todas" tone="brand" />
          <Chip label="Desayuno" tone="neutral" />
          <Chip label="Almuerzo" tone="neutral" />
          <Chip label="Cena" tone="neutral" />
          <Chip label="Snack" tone="neutral" />
        </View>

        <View style={styles.list}>
          {RECIPES.map((recipe) => {
            const isSelected = activeRecipeId === recipe.id;
            return (
              <Pressable
                key={recipe.id}
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
                    <Text style={styles.itemMetaDot}>•</Text>
                    <Text style={styles.itemMetaText}>{recipe.calories} kcal</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={palette.textDisabled} />
              </Pressable>
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
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing['2xl'] },
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
  },
  itemSelected: { borderWidth: 2, borderColor: palette.primary },
  itemPressed: { transform: [{ scale: 0.98 }] },
  itemEmoji: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFEDED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmojiText: { fontSize: 28 },
  itemName: { ...typography.bodyMedium, color: palette.textPrimary, fontWeight: '600' },
  itemDescription: { ...typography.caption, color: palette.textSecondary, marginTop: 2 },
  itemMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  itemMetaText: { ...typography.label, color: palette.textSecondary },
  itemMetaDot: { ...typography.label, color: palette.textDisabled },
});
