import { View, Text, ScrollView, Pressable, StyleSheet, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { ProfileCard, Button, Chip, AnimatedEntry } from '@/components/ui';
import { ChevronRight, Settings, Notification, Edit, Heart, Target } from '@/components/ui/icons';
import { palette, radius, spacing, typography } from '@/theme';

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedEntry>
          <View style={styles.header}>
            <Text style={styles.title}>Perfil</Text>
            <Pressable style={styles.settingsBtn} accessibilityLabel="Configuración">
              <Settings size={20} color={palette.textPrimary} />
            </Pressable>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={80}>
          <ProfileCard
            name="María García"
            level="Nivel Avanzado"
            streak={7}
            weight="68.4"
            height="168"
            age={28}
            goal="Perder grasa"
          />
        </AnimatedEntry>

        <AnimatedEntry delay={160}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mis objetivos</Text>
            <View style={styles.goalsRow}>
              <Chip label="Perder 3 kg" tone="brand" icon={<Target size={14} color={palette.primary} />} />
              <Chip label="5 comidas/día" tone="success" />
              <Chip label="8 vasos de agua" tone="info" />
            </View>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={240}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configuración</Text>
            <View style={styles.menuGroup}>
              <MenuRow icon={<Edit size={20} color={palette.primary} />} label="Editar perfil" onPress={() => Alert.alert('Próximamente')} />
              <MenuRow icon={<Target size={20} color={palette.primary} />} label="Mis objetivos" onPress={() => Alert.alert('Próximamente')} />
              <MenuRow
                icon={<Notification size={20} color={palette.primary} />}
                label="Notificaciones"
                right={
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: palette.divider, true: palette.primary }}
                    thumbColor={palette.surface}
                  />
                }
              />
              <MenuRow icon={<Heart size={20} color={palette.primary} />} label="Favoritos" onPress={() => Alert.alert('Próximamente')} isLast />
            </View>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={320}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Más</Text>
            <View style={styles.menuGroup}>
              <MenuRow label="Términos y condiciones" onPress={() => Alert.alert('Próximamente')} />
              <MenuRow label="Política de privacidad" onPress={() => Alert.alert('Próximamente')} />
              <MenuRow label="Ayuda y soporte" onPress={() => Alert.alert('Próximamente')} />
              <MenuRow label="Acerca de MAVI" onPress={() => Alert.alert('Próximamente')} isLast />
            </View>
          </View>
        </AnimatedEntry>

        <View style={styles.footer}>
          <Button
            label="Cerrar sesión"
            variant="outlined"
            onPress={() => Alert.alert('Próximamente')}
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
}: {
  icon?: React.ReactNode;
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        isLast && { borderBottomWidth: 0 },
        pressed && { backgroundColor: palette.background },
      ]}
    >
      {icon ? <View style={styles.rowIcon}>{icon}</View> : null}
      <Text style={styles.rowLabel}>{label}</Text>
      {right ?? <ChevronRight size={18} color={palette.textDisabled} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing['2xl'] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  title: { ...typography.title, color: palette.textPrimary, fontFamily: 'Fraunces_500Medium' },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { marginTop: spacing.lg },
  sectionTitle: {
    ...typography.titleSecondary,
    color: palette.textPrimary,
    fontFamily: 'Fraunces_500Medium',
    marginBottom: spacing.md,
  },
  goalsRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  menuGroup: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.divider,
    gap: spacing.md,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: palette.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { ...typography.body, color: palette.textPrimary, flex: 1 },
  footer: { marginTop: spacing.xl, alignItems: 'center', gap: spacing.md },
  version: { ...typography.caption, color: palette.textDisabled, marginTop: spacing.sm },
});
