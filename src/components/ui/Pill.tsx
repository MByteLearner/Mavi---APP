import { Text, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { palette, radius, typography } from '@/theme';

export type PillTone = 'brand' | 'neutral' | 'success';

export interface PillProps {
  children: React.ReactNode;
  tone?: PillTone;
  style?: StyleProp<ViewStyle>;
}

const toneStyles: Record<PillTone, { bg: string; text: string }> = {
  brand: { bg: '#FFEDED', text: palette.primary },
  neutral: { bg: palette.divider, text: palette.textPrimary },
  success: { bg: '#E8F5E9', text: palette.success },
};

export function Pill({ children, tone = 'neutral', style }: PillProps) {
  const t = toneStyles[tone];
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }, style]}>
      <Text style={[styles.text, { color: t.text }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.label,
    fontWeight: '600',
  },
});
