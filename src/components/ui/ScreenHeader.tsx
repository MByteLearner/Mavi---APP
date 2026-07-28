import { Text, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { palette, spacing, typography } from '@/theme';

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
  const titleStyle = serif ? styles.titleSerif : styles.title;
  return (
    <View style={[styles.wrapper, style]}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <View style={[styles.row, align === 'center' && styles.rowCenter]}>
        {leading ? <View style={styles.leading}>{leading}</View> : null}
        <View style={styles.titles}>
          <Text style={[titleStyle, align === 'center' && styles.titleCenter]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, align === 'center' && styles.subtitleCenter]}>{subtitle}</Text> : null}
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
    color: palette.primary,
    marginBottom: 6,
  },
  title: {
    ...typography.title,
    color: palette.textPrimary,
  },
  titleSerif: {
    ...typography.display,
    color: palette.textPrimary,
    fontSize: 34,
  },
  titleCenter: { textAlign: 'center' },
  subtitle: {
    ...typography.bodySecondary,
    color: palette.textSecondary,
    marginTop: 6,
  },
  subtitleCenter: { textAlign: 'center' },
});
