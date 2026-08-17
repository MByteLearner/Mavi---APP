import { forwardRef } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { radius, shadow, typography, useThemeColors } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { height: 40, paddingHorizontal: 16, borderRadius: 14 },
    text: { fontSize: 13 },
  },
  md: {
    container: { height: 48, paddingHorizontal: 20, borderRadius: 16 },
    text: { fontSize: 14 },
  },
  lg: {
    container: { height: 56, paddingHorizontal: 24, borderRadius: radius.button },
    text: { fontSize: 15 },
  },
};

export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    label,
    variant = 'primary',
    size = 'lg',
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    fullWidth = true,
    style,
    ...rest
  },
  ref,
) {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;
  const sizeStyle = sizeStyles[size] ?? sizeStyles.lg;

  const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
    primary: {
      container: { backgroundColor: colors.primary },
      text: { color: colors.textInverse },
    },
    secondary: {
      container: { backgroundColor: colors.primarySoft },
      text: { color: colors.primary },
    },
    outlined: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.textPrimary,
      },
      text: { color: colors.textPrimary },
    },
    destructive: {
      container: { backgroundColor: colors.error },
      text: { color: colors.textInverse },
    },
    ghost: {
      container: { backgroundColor: 'transparent' },
      text: { color: colors.textPrimary },
    },
  };

  const variantStyle = variantStyles[variant] ?? variantStyles.primary;

  return (
    <Pressable
      ref={ref}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        sizeStyle.container,
        variantStyle.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        variant === 'primary' && !isDisabled && shadow.sm,
        pressed && styles.pressed,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'destructive' ? colors.textInverse : colors.primary}
        />
      ) : (
        <>
          {leftIcon}
          <Text style={[styles.text, sizeStyle.text, variantStyle.text]}>{label}</Text>
          {rightIcon}
        </>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.97 }] },
  text: { ...typography.button },
});
