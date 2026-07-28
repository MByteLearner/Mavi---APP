import { Text, TextInput, View, StyleSheet, type TextInputProps } from 'react-native';
import { palette, radius, typography } from '@/theme';
import type { ReactNode } from 'react';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({ label, error, hint, leftIcon, rightIcon, ...rest }: InputProps) {
  const borderColor = error ? palette.error : palette.border;
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, { borderColor }]}>
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={palette.textDisabled}
          {...rest}
        />
        {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
      </View>
      {error ? (
        <Text style={[styles.helper, { color: palette.error }]}>{error}</Text>
      ) : hint ? (
        <Text style={styles.helper}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: {
    ...typography.label,
    color: palette.textSecondary,
    fontWeight: '600',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    backgroundColor: palette.surface,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: palette.textPrimary,
  },
  leftIcon: { marginRight: 8 },
  rightIcon: { marginLeft: 8 },
  helper: {
    ...typography.caption,
    color: palette.textSecondary,
  },
});
