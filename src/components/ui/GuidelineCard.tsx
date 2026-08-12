import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ShieldCheck, Leaf, AlertCircle, ScanLine, ChevronRight } from '@/components/ui/icons';
import { Chip } from './Chip';
import { useThemeColors, type PaletteColors, radius, spacing, typography } from '@/theme';

export interface GuidelineCardProps {
  hasScannedPlan: boolean;
  allowedIngredients?: string[];
  restrictions?: string[];
  scannedAt?: string;
}

const DEFAULT_ALLOWED = ['Pollo magro', 'Arroz integral', 'Aguacate', 'Espinacas', 'Huevos', 'Pescado blanco', 'Avena'];
const DEFAULT_RESTRICTIONS = ['Sin TACC (Gluten)', 'Bajo en sodio', 'Sin azúcares añadidos', 'Lácteos desnatados'];

export function GuidelineCard({
  hasScannedPlan,
  allowedIngredients = DEFAULT_ALLOWED,
  restrictions = DEFAULT_RESTRICTIONS,
  scannedAt = 'Reciente',
}: GuidelineCardProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  if (!hasScannedPlan) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyHeader}>
          <View style={styles.emptyIconBg}>
            <ShieldCheck size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emptyTitle}>Sin Guía Médica activa</Text>
            <Text style={styles.emptySubtitle}>
              Escaneá tu plan nutricional para ver tus recomendaciones médicas e ingredientes.
            </Text>
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [styles.scanBtn, pressed && styles.pressed]}
          onPress={() => router.push('/scan')}
        >
          <ScanLine size={18} color={colors.textInverse} />
          <Text style={styles.scanBtnText}>Escanear plan médico</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.iconBg}>
            <ShieldCheck size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeRow}>
              <Text style={styles.title}>Guía Nutricional Médica</Text>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Activa</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>Escaneo: {scannedAt}</Text>
          </View>
        </View>
      </View>

      {/* Ingredientes Permitidos */}
      <View style={styles.section}>
        <View style={styles.sectionLabelRow}>
          <Leaf size={16} color={colors.success} />
          <Text style={styles.sectionLabel}>Ingredientes recomendados</Text>
        </View>
        <View style={styles.chipsRow}>
          {allowedIngredients.slice(0, 6).map((ing, idx) => (
            <Chip key={idx} label={ing} tone="success" />
          ))}
          {allowedIngredients.length > 6 ? (
            <Chip label={`+${allowedIngredients.length - 6} más`} tone="neutral" />
          ) : null}
        </View>
      </View>

      {/* Restricciones y Alérgenos */}
      <View style={styles.section}>
        <View style={styles.sectionLabelRow}>
          <AlertCircle size={16} color={colors.warning} />
          <Text style={styles.sectionLabel}>Restricciones médicas y alérgenos</Text>
        </View>
        <View style={styles.chipsRow}>
          {restrictions.map((res, idx) => (
            <Chip key={idx} label={res} tone="brand" />
          ))}
        </View>
      </View>

      {/* Footer Action */}
      <Pressable
        style={({ pressed }) => [styles.footerBtn, pressed && styles.pressed]}
        onPress={() => router.push('/scan')}
      >
        <Text style={styles.footerBtnText}>Actualizar plan (re-escanear)</Text>
        <ChevronRight size={16} color={colors.primary} />
      </Pressable>
    </View>
  );
}

function createStyles(colors: PaletteColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.card,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.lg,
    },
    header: { gap: spacing.xs },
    headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    iconBg: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
    title: { ...typography.bodyMedium, color: colors.textPrimary, fontWeight: '700' },
    subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
    activeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.successSoft,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: radius.pill,
    },
    activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
    activeText: { ...typography.caption, color: colors.success, fontWeight: '700', fontSize: 11 },

    section: { gap: spacing.xs },
    sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    sectionLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
    chipsRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },

    footerBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerBtnText: { ...typography.caption, color: colors.primary, fontWeight: '700' },

    // Empty state container
    emptyContainer: {
      backgroundColor: colors.surface,
      borderRadius: radius.card,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,
    },
    emptyHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
    emptyIconBg: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: { ...typography.bodyMedium, color: colors.textPrimary, fontWeight: '700' },
    emptySubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
    scanBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      borderRadius: radius.button,
    },
    scanBtnText: { ...typography.button, color: colors.textInverse },
    pressed: { opacity: 0.85 },
  });
}
