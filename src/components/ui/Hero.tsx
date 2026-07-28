import { Text, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { palette, spacing, typography } from '@/theme';

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
  const tokens = title.split(/(\s+)/);
  return (
    <View style={[styles.wrapper, style, align === 'center' && styles.center]}>
      {eyebrow ? (
        <Text style={[styles.eyebrow, align === 'center' && styles.centerText]}>
          {eyebrow}
        </Text>
      ) : null}
      <Text style={[styles.title, align === 'center' && styles.centerText]}>
        {tokens.map((token, i) => {
          const isAccent = accentWords.includes(token);
          return (
            <Text
              key={i}
              style={isAccent ? styles.accent : undefined}
            >
              {token}
            </Text>
          );
        })}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, align === 'center' && styles.centerText]}>
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
    color: palette.primary,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.display,
    color: palette.textPrimary,
  },
  accent: {
    color: palette.primary,
    fontStyle: 'italic',
  },
  subtitle: {
    ...typography.bodySecondary,
    color: palette.textSecondary,
    marginTop: spacing.md,
    maxWidth: 480,
  },
  centerText: { textAlign: 'center' },
  trailing: { marginTop: spacing.lg },
});
