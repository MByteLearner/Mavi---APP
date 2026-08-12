import { View, Text, ScrollView, Pressable, StyleSheet, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';

import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore, type ThemeMode } from '@/stores/useThemeStore';
import { useHaptics } from '@/hooks/useHaptics';
import { toast } from '@/components/ui/Toast';
import { ProfileCard, Button, Chip, AnimatedEntry } from '@/components/ui';
import {
  ChevronRight,
  Settings,
  Notification,
  Edit,
  Heart,
  Target,
  Moon,
  Sun,
  Contrast,
} from '@/components/ui/icons';
import { radius, spacing, typography, useThemeColors } from '@/theme';


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
  const [notifications, setNotifications] = useState(true);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const themeMode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setMode);
  const haptics = useHaptics();

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
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedEntry>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Perfil</Text>
            <Pressable style={[styles.settingsBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} accessibilityLabel="Configuración">
              <Settings size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={80}>
          <ProfileCard
            name={user?.name ?? 'María García'}
            level="Nivel Avanzado"
            streak={7}
            weight="68.4"
            height="168"
            age={28}
            goal={user?.goal === 'lose' ? 'Perder grasa' : user?.goal === 'gain' ? 'Ganar músculo' : 'Mantener peso'}
          />
        </AnimatedEntry>

        <AnimatedEntry delay={160}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Mis objetivos</Text>
            <View style={styles.goalsRow}>
              <Chip label="Perder 3 kg" tone="brand" icon={<Target size={14} color={colors.primary} />} />
              <Chip label="5 comidas/día" tone="success" />
              <Chip label="8 vasos de agua" tone="info" />
            </View>
          </View>
        </AnimatedEntry>

        {/* ── Apariencia — Toggle Dark/Light/System ── */}
        <AnimatedEntry delay={200}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Apariencia</Text>
            <View style={styles.themeRow}>
              {THEME_OPTIONS.map((opt) => {
                const isActive = themeMode === opt.mode;
                return (
                  <Pressable
                    key={opt.mode}
                    disabled={isActive}
                    style={[
                      styles.themeOption,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      isActive && { borderColor: colors.primary, backgroundColor: colors.primarySoft, opacity: 0.9 },
                    ]}
                    onPress={() => handleThemeChange(opt.mode)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive, disabled: isActive }}
                    accessibilityLabel={`Tema ${opt.label}`}
                  >
                    <View style={[
                      styles.themeIconBg,
                      { backgroundColor: colors.background },
                      isActive && { backgroundColor: colors.primary },
                    ]}>
                      <ThemeIcon
                        name={opt.icon}
                        size={20}
                        color={isActive ? colors.textInverse : colors.textSecondary}
                      />
                    </View>
                    <Text style={[
                      styles.themeLabel,
                      { color: colors.textSecondary },
                      isActive && { color: colors.primary, fontWeight: '700' },
                    ]}>
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
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Configuración</Text>
            <View style={[styles.menuGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <MenuRow icon={<Edit size={20} color={colors.primary} />} label="Editar perfil" colors={colors} onPress={() => Alert.alert('Próximamente')} />
              <MenuRow icon={<Target size={20} color={colors.primary} />} label="Mis objetivos" colors={colors} onPress={() => Alert.alert('Próximamente')} />
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
              <MenuRow icon={<Heart size={20} color={colors.primary} />} label="Favoritos" colors={colors} onPress={() => Alert.alert('Próximamente')} isLast />
            </View>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={360}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Más</Text>
            <View style={[styles.menuGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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
          <Text style={[styles.version, { color: colors.textDisabled }]}>MAVI v1.0.0</Text>
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

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 110 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  title: { ...typography.title, fontFamily: 'Fraunces_500Medium' },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { marginTop: spacing.lg },
  sectionTitle: {
    ...typography.titleSecondary,
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
  },
  themeIconBg: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeLabel: {
    ...typography.caption,
    fontWeight: '600',
  },

  // ── Menu ──
  menuGroup: {
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
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
  version: { ...typography.caption, marginTop: spacing.sm },
});
