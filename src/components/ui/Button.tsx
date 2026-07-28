import { forwardRef, useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { palette, radius, shadow, typography } from '@/theme';

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

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: { backgroundColor: palette.primary },
    text: { color: palette.textInverse },
  },
  secondary: {
    container: { backgroundColor: palette.primarySoft },
    text: { color: palette.primary },
  },
  outlined: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: palette.textPrimary,
    },
    text: { color: palette.textPrimary },
  },
  destructive: {
    container: { backgroundColor: palette.primaryDark },
    text: { color: palette.textInverse },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: palette.textPrimary },
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
    className,
    style,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const sizeStyle = sizeStyles[size];
  const variantStyle = variantStyles[variant];

  const pressStyle = useMemo<ViewStyle>(
    () => ({ transform: [{ scale: 0.97 }] }),
    [],
  );

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
        pressed && pressStyle,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'destructive' ? palette.textInverse : palette.primary}
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
  text: { ...typography.button },
});
