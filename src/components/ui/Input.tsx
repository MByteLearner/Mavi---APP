import { Text, TextInput, View, StyleSheet, type TextInputProps } from 'react-native';
import { radius, typography, useThemeColors } from '@/theme';
import type { ReactNode } from 'react';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({ label, error, hint, leftIcon, rightIcon, ...rest }: InputProps) {
  const colors = useThemeColors();
  const borderColor = error ? colors.error : colors.border;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text> : null}
      <View style={[styles.field, { borderColor, backgroundColor: colors.surface }]}>
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholderTextColor={colors.textDisabled}
          {...rest}
        />
        {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
      </View>
      {error ? (
        <Text style={[styles.helper, { color: colors.error }]}>{error}</Text>
      ) : hint ? (
        <Text style={[styles.helper, { color: colors.textSecondary }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: {
    ...typography.label,
    fontWeight: '600',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    ...typography.body,
  },
  leftIcon: { marginRight: 8 },
  rightIcon: { marginLeft: 8 },
  helper: {
    ...typography.caption,
  },
});
