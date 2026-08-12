import { View, Text, ScrollView, Pressable, StyleSheet, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';

import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { useThemeStore, type ThemeMode } from '@/stores/useThemeStore';
import { useHaptics } from '@/hooks/useHaptics';
import { toast } from '@/components/ui/Toast';
import { ProfileCard, GuidelineCard, Button, Chip, AnimatedEntry } from '@/components/ui';
import {
  ChevronRight,
  Notification,
  Edit,
  Heart,
  Target,
  Moon,
  Sun,
  Contrast,
  ShieldCheck,
} from '@/components/ui/icons';
import { radius, spacing, typography, useThemeColors, type PaletteColors } from '@/theme';

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: 'sun' | 'moon' | 'contrast' }[] = [
  { mode: 'light', label: 'Claro', icon: 'sun' },
  { mode: 'dark', label: 'Oscuro', icon: 'moon' },
  { mode: 'system', label: 'Auto', icon: 'contrast' },
];

const ThemeIcon = ({ name, size, color }: { name: string; size: number; color: string }) => {
  switch (name) {
    case 'sun': return <Sun size={size} color={color} />;
    case 'moon': return <Moon size={size} color={color} />;
    default: return <Contrast size={size} color={color} />;
  }
};

export default function ProfileScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const [notifications, setNotifications] = useState(true);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const themeMode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setMode);

  const hasScannedPlan = useUserStore((s) => s.hasScannedPlan);
  const userProfile = useUserStore((s) => s.profile);
  const streak = useUserStore((s) => s.streak);
  const haptics = useHaptics();

  const activeName = userProfile?.name ?? user?.name ?? 'María García';
  const activeGoal = userProfile?.goal ?? user?.goal ?? 'maintain';
  const activeGoals = userProfile?.goals ?? user?.goals ?? ['Mantener peso saludable', 'Comer 5 veces al día'];
  const goalLabel =
    activeGoal === 'lose'
      ? 'Perder grasa'
      : activeGoal === 'gain'
        ? 'Ganar músculo'
        : 'Mantener peso';

  const handleLogout = () => {
    haptics.medium();
    logout();
    toast.info('Sesión cerrada correctamente');
    router.replace('/(auth)/login');
  };

  const handleThemeChange = (mode: ThemeMode) => {
    if (mode === themeMode) return;
    haptics.light();
    setThemeMode(mode);
    const labels: Record<ThemeMode, string> = {
      light: '☀️ Modo claro activado',
      dark: '🌙 Modo oscuro activado',
      system: '🔄 Modo automático (sistema)',
    };
    toast.info(labels[mode]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedEntry>
          <View style={styles.header}>
            <Text style={styles.title}>Perfil</Text>
            <Pressable
              onPress={() => router.push('/edit-profile' as any)}
              style={styles.settingsBtn}
              accessibilityLabel="Editar perfil"
            >
              <Edit size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
        </AnimatedEntry>

        {/* Tarjeta de usuario */}
        <AnimatedEntry delay={80}>
          <ProfileCard
            name={activeName}
            level="Nivel Avanzado"
            streak={streak}
            weight="68.4"
            height="168"
            age={28}
            goal={goalLabel}
          />
        </AnimatedEntry>

        {/* Guía Médica Activa */}
        <AnimatedEntry delay={120}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Guía Médica Activa</Text>
            <GuidelineCard
              hasScannedPlan={hasScannedPlan}
              allowedIngredients={userProfile?.guideline?.allowedIngredients}
              restrictions={userProfile?.guideline?.restrictions}
            />
          </View>
        </AnimatedEntry>

        {/* Objetivos */}
        <AnimatedEntry delay={160}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mis objetivos</Text>
            <View style={styles.goalsRow}>
              {activeGoals.map((g, idx) => (
                <Chip
                  key={idx}
                  label={g}
                  tone={idx === 0 ? 'brand' : idx === 1 ? 'success' : 'info'}
                  icon={idx === 0 ? <Target size={14} color={colors.primary} /> : undefined}
                />
              ))}
            </View>
          </View>
        </AnimatedEntry>

        {/* Apariencia — Toggle Dark/Light/System */}
        <AnimatedEntry delay={200}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Apariencia</Text>
            <View style={styles.themeRow}>
              {THEME_OPTIONS.map((opt) => {
                const isActive = themeMode === opt.mode;
                return (
                  <Pressable
                    key={opt.mode}
                    disabled={isActive}
                    style={[
                      styles.themeOption,
                      isActive && styles.themeOptionActive,
                    ]}
                    onPress={() => handleThemeChange(opt.mode)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive, disabled: isActive }}
                    accessibilityLabel={`Tema ${opt.label}`}
                  >
                    <View
                      style={[
                        styles.themeIconBg,
                        isActive && styles.themeIconBgActive,
                      ]}
                    >
                      <ThemeIcon
                        name={opt.icon}
                        size={20}
                        color={isActive ? colors.textInverse : colors.textSecondary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.themeLabel,
                        isActive && styles.themeLabelActive,
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

        <AnimatedEntry delay={280}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configuración</Text>
            <View style={styles.menuGroup}>
              <MenuRow
                icon={<Edit size={20} color={colors.primary} />}
                label="Editar perfil"
                colors={colors}
                onPress={() => router.push('/edit-profile' as any)}
              />
              <MenuRow
                icon={<ShieldCheck size={20} color={colors.primary} />}
                label="Guía nutricional médica"
                colors={colors}
                onPress={() => router.push('/scan')}
              />
              <MenuRow
                icon={<Notification size={20} color={colors.primary} />}
                label="Notificaciones"
                colors={colors}
                right={
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: colors.divider, true: colors.primary }}
                    thumbColor={colors.surface}
                  />
                }
              />
              <MenuRow
                icon={<Heart size={20} color={colors.primary} />}
                label="Favoritos"
                colors={colors}
                onPress={() => Alert.alert('Próximamente')}
                isLast
              />
            </View>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={360}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Más</Text>
            <View style={styles.menuGroup}>
              <MenuRow label="Términos y condiciones" colors={colors} onPress={() => Alert.alert('Próximamente')} />
              <MenuRow label="Política de privacidad" colors={colors} onPress={() => Alert.alert('Próximamente')} />
              <MenuRow label="Ayuda y soporte" colors={colors} onPress={() => Alert.alert('Próximamente')} />
              <MenuRow label="Acerca de MAVI" colors={colors} onPress={() => Alert.alert('Próximamente')} isLast />
            </View>
          </View>
        </AnimatedEntry>

        <View style={styles.footer}>
          <Button
            label="Cerrar sesión"
            variant="outlined"
            onPress={handleLogout}
            fullWidth={false}
          />
          <Text style={styles.version}>MAVI v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  right,
  isLast,
  colors,
}: {
  icon?: React.ReactNode;
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
  isLast?: boolean;
  colors: ReturnType<typeof useThemeColors>;
}) {
  const styles = createStyles(colors);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.divider },
        isLast && { borderBottomWidth: 0 },
        pressed && { backgroundColor: colors.background },
      ]}
    >
      {icon ? <View style={[styles.rowIcon, { backgroundColor: colors.primarySoft }]}>{icon}</View> : null}
      <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{label}</Text>
      {right ?? <ChevronRight size={18} color={colors.textDisabled} />}
    </Pressable>
  );
}

function createStyles(colors: PaletteColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.lg, paddingBottom: 110 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      marginBottom: spacing.lg,
    },
    title: { ...typography.title, color: colors.textPrimary, fontFamily: 'Fraunces_500Medium' },
    settingsBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    section: { marginTop: spacing.lg },
    sectionTitle: {
      ...typography.titleSecondary,
      color: colors.textPrimary,
      fontFamily: 'Fraunces_500Medium',
      marginBottom: spacing.md,
    },
    goalsRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },

    // ── Apariencia / Theme Selector ──
    themeRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    themeOption: {
      flex: 1,
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.card,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    themeOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primarySoft,
      opacity: 0.9,
    },
    themeIconBg: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    themeIconBgActive: {
      backgroundColor: colors.primary,
    },
    themeLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    themeLabelActive: {
      color: colors.primary,
      fontWeight: '700',
    },

    // ── Menu ──
    menuGroup: {
      borderRadius: radius.card,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: spacing.md,
      borderBottomWidth: 1,
      gap: spacing.md,
    },
    rowIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowLabel: { ...typography.body, flex: 1 },
    footer: { marginTop: spacing.xl, alignItems: 'center', gap: spacing.md },
    version: { ...typography.caption, color: colors.textDisabled, marginTop: spacing.sm },
  });
}

