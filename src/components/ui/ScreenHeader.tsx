import { Text, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { spacing, typography, useThemeColors } from '@/theme';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  leading?: ReactNode;
  eyebrow?: string;
  serif?: boolean;
  align?: 'left' | 'center';
  style?: StyleProp<ViewStyle>;
}

export function ScreenHeader({
  title,
  subtitle,
  trailing,
  leading,
  eyebrow,
  serif = false,
  align = 'left',
  style,
}: ScreenHeaderProps) {
  const colors = useThemeColors();
  const titleStyle = serif ? styles.titleSerif : styles.title;

  return (
    <View style={[styles.wrapper, style]}>
      {eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text> : null}
      <View style={[styles.row, align === 'center' && styles.rowCenter]}>
        {leading ? <View style={styles.leading}>{leading}</View> : null}
        <View style={styles.titles}>
          <Text style={[titleStyle, { color: colors.textPrimary }, align === 'center' && styles.titleCenter]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }, align === 'center' && styles.subtitleCenter]}>{subtitle}</Text> : null}
        </View>
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.xl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowCenter: { justifyContent: 'center' },
  leading: {},
  titles: { flex: 1 },
  trailing: {},
  eyebrow: {
    ...typography.overline,
    marginBottom: 6,
  },
  title: {
    ...typography.title,
  },
  titleSerif: {
    ...typography.display,
    fontSize: 34,
  },
  titleCenter: { textAlign: 'center' },
  subtitle: {
    ...typography.bodySecondary,
    marginTop: 6,
  },
  subtitleCenter: { textAlign: 'center' },
});
