import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { palette } from '@/theme';

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  trackColor?: string;
  isComplete?: boolean;
}

export function ProgressBar({
  progress,
  height = 6,
  color = palette.primary,
  trackColor = palette.divider,
}: ProgressBarProps) {
  const sharedProgress = useSharedValue(0);

  useEffect(() => {
    sharedProgress.value = withTiming(Math.min(Math.max(progress, 0), 1), {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, sharedProgress]);

  const animatedFill = useAnimatedStyle(() => ({
    width: `${sharedProgress.value * 100}%`,
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(progress * 100) }}
      style={[styles.track, { height, backgroundColor: trackColor, borderRadius: height / 2 }]}
    >
      <Animated.View
        style={[
          styles.fill,
          animatedFill,
          { height, backgroundColor: color, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
  fill: {},
});
