import { Text, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { spacing, typography, useThemeColors } from '@/theme';

export interface HeroProps {
  eyebrow?: string;
  title: string;
  /** Words in the title to render in accent color (must match exactly) */
  accentWords?: string[];
  subtitle?: string;
  trailing?: ReactNode;
  align?: 'left' | 'center';
  style?: StyleProp<ViewStyle>;
}

export function Hero({
  eyebrow,
  title,
  accentWords = [],
  subtitle,
  trailing,
  align = 'left',
  style,
}: HeroProps) {
  const colors = useThemeColors();
  const tokens = title.split(/(\s+)/);

  return (
    <View style={[styles.wrapper, style, align === 'center' && styles.center]}>
      {eyebrow ? (
        <Text style={[styles.eyebrow, { color: colors.primary }, align === 'center' && styles.centerText]}>
          {eyebrow}
        </Text>
      ) : null}
      <Text style={[styles.title, { color: colors.textPrimary }, align === 'center' && styles.centerText]}>
        {tokens.map((token, i) => {
          const isAccent = accentWords.includes(token);
          return (
            <Text
              key={i}
              style={isAccent ? [styles.accent, { color: colors.primary }] : undefined}
            >
              {token}
            </Text>
          );
        })}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textSecondary }, align === 'center' && styles.centerText]}>
          {subtitle}
        </Text>
      ) : null}
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.xl,
  },
  center: { alignItems: 'center' },
  eyebrow: {
    ...typography.overline,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.display,
  },
  accent: {
    fontStyle: 'italic',
  },
  subtitle: {
    ...typography.bodySecondary,
    marginTop: spacing.md,
    maxWidth: 480,
  },
  centerText: { textAlign: 'center' },
  trailing: { marginTop: spacing.lg },
});
