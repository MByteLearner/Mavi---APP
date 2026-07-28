import { Text, View, StyleSheet } from 'react-native';
import { palette, radius, typography } from '@/theme';

export interface AvatarProps {
  name?: string;
  uri?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
} as const;

export function Avatar({ name = '?', uri, size = 'md' }: AvatarProps) {
  const px = sizeMap[size];
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={name}
      style={[
        styles.base,
        {
          width: px,
          height: px,
          borderRadius: px / 2,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: px * 0.4 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  initials: {
    ...typography.bodyMedium,
    color: palette.textInverse,
    fontWeight: '700',
  },
});
