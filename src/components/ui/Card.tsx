import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { radius, shadow, spacing, useThemeColors } from '@/theme';

export interface CardProps {
  children: ReactNode;
  variant?: 'elevated' | 'flat' | 'outlined' | 'ghost';
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
  const colors = useThemeColors();

  const dynamicStyles = {
    base: {
      backgroundColor: colors.surface,
      borderRadius: radius.card,
    },
    elevated: {
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow.sm,
    },
    flat: {
      backgroundColor: colors.background,
    },
    outlined: {
      borderWidth: 1,
      borderColor: colors.border,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  };

  const baseStyle =
    variant === 'elevated'
      ? dynamicStyles.elevated
      : variant === 'outlined'
        ? dynamicStyles.outlined
        : variant === 'ghost'
          ? dynamicStyles.ghost
          : dynamicStyles.flat;

  return (
    <View style={[dynamicStyles.base, baseStyle, { padding: paddingMap[padding] }, style]}>
      {children}
    </View>
  );
}
