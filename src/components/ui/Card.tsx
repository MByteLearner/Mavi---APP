import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { palette, radius, shadow, spacing } from '@/theme';

export interface CardProps {
  children: ReactNode;
  variant?: 'elevated' | 'flat' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  className?: string;
}

const paddingMap = {
  none: 0,
  sm: spacing.md,
  md: spacing.lg,
  lg: spacing.xl,
} as const;

export function Card({
  children,
  variant = 'elevated',
  padding = 'md',
  style,
}: CardProps) {
  const baseStyle =
    variant === 'elevated'
      ? styles.elevated
      : variant === 'outlined'
        ? styles.outlined
        : styles.flat;

  return <View style={[styles.base, baseStyle, { padding: paddingMap[padding] }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
  },
  elevated: {
    ...shadow.sm,
  },
  flat: {
    backgroundColor: palette.background,
  },
  outlined: {
    borderWidth: 1,
    borderColor: palette.border,
  },
});
