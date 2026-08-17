import { Text, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { radius, typography, useThemeColors } from '@/theme';

export type ChipTone = 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'info';

export interface ChipProps {
  label: string;
  tone?: ChipTone;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Chip({ label, tone = 'neutral', icon, style }: ChipProps) {
  const colors = useThemeColors();

  const toneStyles: Record<ChipTone, { bg: string; text: string }> = {
    neutral: { bg: colors.divider, text: colors.textPrimary },
    brand: { bg: colors.primarySoft, text: colors.primary },
    success: { bg: colors.successSoft, text: colors.success },
    warning: { bg: colors.warningSoft, text: colors.warning },
    error: { bg: colors.errorSoft, text: colors.error },
    info: { bg: colors.infoSoft, text: colors.info },
  };

  const t = toneStyles[tone] ?? toneStyles.neutral;
  return (
    <View style={[styles.chip, { backgroundColor: t.bg }, style]}>
      {icon}
      <Text style={[styles.text, { color: t.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 4,
  },
  text: {
    ...typography.label,
    fontWeight: '600',
  },
});
