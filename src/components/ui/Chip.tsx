import { Text, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { palette, radius, typography } from '@/theme';

export type ChipTone = 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'info';

export interface ChipProps {
  label: string;
  tone?: ChipTone;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const toneStyles: Record<ChipTone, { bg: string; text: string }> = {
  neutral: { bg: palette.divider, text: palette.textPrimary },
  brand: { bg: '#FFEDED', text: palette.primary },
  success: { bg: '#E8F5E9', text: palette.success },
  warning: { bg: '#FFF8E1', text: palette.warning },
  error: { bg: '#FFEBEE', text: palette.error },
  info: { bg: '#E3F2FD', text: palette.info },
};

export function Chip({ label, tone = 'neutral', icon, style }: ChipProps) {
  const t = toneStyles[tone];
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
