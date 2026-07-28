import { View, Text, type StyleProp, type ViewStyle } from 'react-native';
import { palette, radius } from '@/theme';

interface IllustrationProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const frameStyle = (size: number): ViewStyle => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: palette.primarySoft,
  overflow: 'hidden',
});

const innerCircle = (size: number, color: string): ViewStyle => ({
  width: size * 0.6,
  height: size * 0.6,
  borderRadius: size * 0.3,
  backgroundColor: color,
  alignItems: 'center',
  justifyContent: 'center',
});

/** Plan / nutrition plan empty state — circle with mark */
export function IllustrationPlan({ size = 160, style }: IllustrationProps) {
  return (
    <View style={[frameStyle(size), style]}>
      <View
        style={{
          width: size * 0.55,
          height: size * 0.7,
          borderRadius: radius.md,
          backgroundColor: palette.surface,
          borderWidth: 1.5,
          borderColor: palette.textPrimary,
          padding: 8,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ width: '100%', height: 2, backgroundColor: palette.textPrimary, borderRadius: 1 }} />
        <View style={{ width: '70%', height: 2, backgroundColor: palette.textSecondary, borderRadius: 1 }} />
        <View style={{ width: '85%', height: 2, backgroundColor: palette.textSecondary, borderRadius: 1 }} />
        <View style={{ width: '55%', height: 2, backgroundColor: palette.textSecondary, borderRadius: 1 }} />
      </View>
      <View
        style={{
          position: 'absolute',
          top: size * 0.15,
          right: size * 0.15,
          width: size * 0.2,
          height: size * 0.2,
          borderRadius: size * 0.1,
          backgroundColor: palette.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: palette.textInverse, fontSize: size * 0.1, fontWeight: '700' }}>✓</Text>
      </View>
    </View>
  );
}

/** Recipe empty state — bowl with ingredients */
export function IllustrationRecipe({ size = 160, style }: IllustrationProps) {
  return (
    <View style={[frameStyle(size), style]}>
      <View
        style={{
          width: size * 0.5,
          height: size * 0.5,
          borderRadius: size * 0.25,
          backgroundColor: palette.surface,
          borderWidth: 1.5,
          borderColor: palette.textPrimary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: size * 0.35,
            height: size * 0.35,
            borderRadius: size * 0.175,
            borderWidth: 1.5,
            borderColor: palette.divider,
            borderStyle: 'dashed',
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: size * 0.1,
            left: size * 0.2,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: palette.secondary,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: size * 0.15,
            right: size * 0.18,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: palette.primary,
          }}
        />
      </View>
    </View>
  );
}

/** History empty state — clock with line */
export function IllustrationHistory({ size = 160, style }: IllustrationProps) {
  return (
    <View style={[frameStyle(size), style]}>
      <View
        style={{
          width: size * 0.55,
          height: size * 0.55,
          borderRadius: size * 0.275,
          backgroundColor: palette.surface,
          borderWidth: 1.5,
          borderColor: palette.textPrimary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ position: 'absolute', top: '20%', width: 2, height: '30%', backgroundColor: palette.primary, borderRadius: 1 }} />
        <View style={{ position: 'absolute', left: '50%', width: '30%', height: 2, backgroundColor: palette.primary, borderRadius: 1 }} />
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: palette.textPrimary,
            position: 'absolute',
            top: '47%',
            left: '47%',
          }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          top: size * 0.18,
          right: size * 0.18,
          width: size * 0.14,
          height: size * 0.14,
          borderRadius: size * 0.07,
          backgroundColor: palette.secondary,
        }}
      />
    </View>
  );
}

/** Profile empty state — avatar + badge */
export function IllustrationProfile({ size = 160, style }: IllustrationProps) {
  return (
    <View style={[frameStyle(size), style]}>
      <View
        style={{
          width: size * 0.32,
          height: size * 0.32,
          borderRadius: size * 0.16,
          backgroundColor: palette.surface,
          borderWidth: 1.5,
          borderColor: palette.textPrimary,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: size * 0.22,
          width: size * 0.5,
          height: size * 0.25,
          borderTopLeftRadius: size * 0.25,
          borderTopRightRadius: size * 0.25,
          backgroundColor: palette.surface,
          borderWidth: 1.5,
          borderColor: palette.textPrimary,
          borderBottomWidth: 0,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.15,
          right: size * 0.15,
          width: size * 0.18,
          height: size * 0.18,
          borderRadius: size * 0.09,
          backgroundColor: palette.secondary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: palette.textInverse, fontSize: size * 0.09, fontWeight: '700' }}>★</Text>
      </View>
    </View>
  );
}

/** Chat / AI empty state */
export function IllustrationChat({ size = 160, style }: IllustrationProps) {
  return (
    <View style={[frameStyle(size), style]}>
      <View
        style={{
          width: size * 0.7,
          height: size * 0.5,
          borderRadius: size * 0.12,
          backgroundColor: palette.surface,
          borderWidth: 1.5,
          borderColor: palette.textPrimary,
          padding: size * 0.08,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: palette.primary }} />
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: palette.secondary }} />
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: palette.primary }} />
      </View>
    </View>
  );
}

/** Error */
export function IllustrationError({ size = 160, style }: IllustrationProps) {
  return (
    <View style={[frameStyle(size), style]}>
      <View style={innerCircle(size, palette.surface)}>
        <View style={{ width: 2.5, height: size * 0.12, backgroundColor: palette.primary, borderRadius: 2, marginBottom: 4 }} />
        <View style={{ width: 2.5, height: 2.5, borderRadius: 1.25, backgroundColor: palette.primary }} />
      </View>
    </View>
  );
}

/** Sparkle / AI */
export function IllustrationSparkle({ size = 160, style }: IllustrationProps) {
  return (
    <View style={[frameStyle(size), style]}>
      <Text style={{ fontSize: size * 0.4, color: palette.primary }}>✦</Text>
    </View>
  );
}

