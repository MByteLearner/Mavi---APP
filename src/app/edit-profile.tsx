import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { useHaptics } from '@/hooks/useHaptics';
import { toast } from '@/components/ui/Toast';
import { Input, Button, Chip, AnimatedEntry } from '@/components/ui';
import { ArrowLeft, Plus, CloseIcon, Target, ShieldCheck } from '@/components/ui/icons';
import { useThemeColors, type PaletteColors, radius, spacing, typography } from '@/theme';

type GoalType = 'lose' | 'maintain' | 'gain';

const GOAL_OPTIONS: { id: GoalType; label: string; icon: string }[] = [
  { id: 'lose', label: 'Perder grasa', icon: '📉' },
  { id: 'maintain', label: 'Mantener peso', icon: '⚖️' },
  { id: 'gain', label: 'Ganar músculo', icon: '💪' },
];

export default function EditProfileScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const haptics = useHaptics();

  const authUser = useAuthStore((s) => s.user);
  const userProfile = useUserStore((s) => s.profile);
  const updateProfile = useUserStore((s) => s.updateProfile);

  const [name, setName] = useState(userProfile?.name ?? authUser?.name ?? 'María García');
  const [goal, setGoal] = useState<GoalType>(
    (userProfile?.goal ?? authUser?.goal ?? 'maintain') as GoalType,
  );
  const [goals, setGoals] = useState<string[]>(
    userProfile?.goals ?? authUser?.goals ?? ['Mantener peso saludable', 'Comer 5 veces al día'],
  );
  const [allergies, setAllergies] = useState<string[]>(
    userProfile?.allergies ?? authUser?.allergies ?? ['Gluten (Sin TACC)', 'Lactosa'],
  );

  const [newGoalInput, setNewGoalInput] = useState('');
  const [newAllergyInput, setNewAllergyInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddGoal = () => {
    const trimmed = newGoalInput.trim();
    if (!trimmed) return;
    if (goals.includes(trimmed)) {
      toast.error('Ese objetivo ya existe');
      return;
    }
    haptics.light();
    setGoals([...goals, trimmed]);
    setNewGoalInput('');
  };

  const handleRemoveGoal = (index: number) => {
    haptics.light();
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleAddAllergy = () => {
    const trimmed = newAllergyInput.trim();
    if (!trimmed) return;
    if (allergies.includes(trimmed)) {
      toast.error('Ese alérgeno o restricción ya existe');
      return;
    }
    haptics.light();
    setAllergies([...allergies, trimmed]);
    setNewAllergyInput('');
  };

  const handleRemoveAllergy = (index: number) => {
    haptics.light();
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('El nombre no puede estar vacío');
      return;
    }

    setLoading(true);
    haptics.medium();

    try {
      await updateProfile({
        name: name.trim(),
        goal,
        goals,
        allergies,
      });

      haptics.success();
      toast.success('Perfil actualizado correctamente');
      router.back();
    } catch {
      toast.error('No se pudieron guardar los cambios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityLabel="Volver"
          >
            <ArrowLeft size={20} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Editar perfil</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Nombre completo */}
          <AnimatedEntry delay={40}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Ingresá tu nombre"
                autoCapitalize="words"
              />
            </View>
          </AnimatedEntry>

          {/* Objetivo Principal */}
          <AnimatedEntry delay={80}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Objetivo nutricional principal</Text>
              <View style={styles.goalGrid}>
                {GOAL_OPTIONS.map((opt) => {
                  const isSelected = goal === opt.id;
                  return (
                    <Pressable
                      key={opt.id}
                      onPress={() => {
                        haptics.selection();
                        setGoal(opt.id);
                      }}
                      style={[
                        styles.goalCard,
                        isSelected && styles.goalCardSelected,
                      ]}
                    >
                      <Text style={styles.goalIcon}>{opt.icon}</Text>
                      <Text
                        style={[
                          styles.goalText,
                          isSelected && styles.goalTextSelected,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </AnimatedEntry>

          {/* Lista de Objetivos Personalizados */}
          <AnimatedEntry delay={120}>
            <View style={styles.fieldGroup}>
              <View style={styles.sectionHeaderRow}>
                <Target size={18} color={colors.primary} />
                <Text style={styles.label}>Objetivos específicos</Text>
              </View>

              <View style={styles.inputWithBtn}>
                <View style={{ flex: 1 }}>
                  <Input
                    value={newGoalInput}
                    onChangeText={setNewGoalInput}
                    placeholder="Ej: Beber 2L de agua"
                    onSubmitEditing={handleAddGoal}
                    returnKeyType="done"
                  />
                </View>
                <Pressable onPress={handleAddGoal} style={styles.addBtn}>
                  <Plus size={20} color={colors.textInverse} />
                </Pressable>
              </View>

              <View style={styles.tagsContainer}>
                {goals.map((g, idx) => (
                  <View key={idx} style={styles.tagItem}>
                    <Chip label={g} tone="brand" />
                    <Pressable
                      onPress={() => handleRemoveGoal(idx)}
                      style={styles.removeTagBtn}
                      accessibilityLabel={`Eliminar ${g}`}
                    >
                      <CloseIcon size={14} color={colors.textSecondary} />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          </AnimatedEntry>

          {/* Restricciones y Alérgenos */}
          <AnimatedEntry delay={160}>
            <View style={styles.fieldGroup}>
              <View style={styles.sectionHeaderRow}>
                <ShieldCheck size={18} color={colors.warning} />
                <Text style={styles.label}>Alérgenos y Restricciones</Text>
              </View>

              <View style={styles.inputWithBtn}>
                <View style={{ flex: 1 }}>
                  <Input
                    value={newAllergyInput}
                    onChangeText={setNewAllergyInput}
                    placeholder="Ej: Mariscos, Maní, Bajo en sodio"
                    onSubmitEditing={handleAddAllergy}
                    returnKeyType="done"
                  />
                </View>
                <Pressable onPress={handleAddAllergy} style={styles.addBtn}>
                  <Plus size={20} color={colors.textInverse} />
                </Pressable>
              </View>

              <View style={styles.tagsContainer}>
                {allergies.map((a, idx) => (
                  <View key={idx} style={styles.tagItem}>
                    <Chip label={a} tone="warning" />
                    <Pressable
                      onPress={() => handleRemoveAllergy(idx)}
                      style={styles.removeTagBtn}
                      accessibilityLabel={`Eliminar ${a}`}
                    >
                      <CloseIcon size={14} color={colors.textSecondary} />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          </AnimatedEntry>

          {/* Action Footer */}
          <View style={styles.footer}>
            <Button
              label={loading ? 'Guardando...' : 'Guardar cambios'}
              onPress={handleSave}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(colors: PaletteColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: { ...typography.titleSecondary, color: colors.textPrimary, fontFamily: 'Fraunces_500Medium' },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing['3xl'], gap: spacing.xl },
    fieldGroup: { gap: spacing.sm },
    label: { ...typography.bodyMedium, color: colors.textPrimary, fontWeight: '700' },
    sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },

    // Goal selector
    goalGrid: { flexDirection: 'row', gap: spacing.sm },
    goalCard: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xs,
      borderRadius: radius.card,
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
      gap: 4,
    },
    goalCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primarySoft,
    },
    goalIcon: { fontSize: 20 },
    goalText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },
    goalTextSelected: { color: colors.primary, fontWeight: '700' },

    // Dynamic Tags Input
    inputWithBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    addBtn: {
      width: 48,
      height: 48,
      borderRadius: radius.button,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
    tagItem: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    removeTagBtn: {
      padding: 4,
      borderRadius: radius.pill,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },

    footer: { marginTop: spacing.md },
  });
}
