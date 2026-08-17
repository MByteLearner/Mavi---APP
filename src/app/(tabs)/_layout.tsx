import { Platform, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassView from 'expo-glass-effect/build/GlassView';

import {
  Home,
  BookOpen,
  Sparkles,
  TrendingUp,
  Person,
} from '@/components/ui/icons';
import { useThemeStore } from '@/stores/useThemeStore';

// ── Dimensiones del glass bar ──────────────────────────────────────────────
const BAR_HEIGHT = 60;
const BAR_MARGIN_H = 20;
const BAR_MARGIN_B = 12;
const BAR_RADIUS = 32;

// ── Colores ────────────────────────────────────────────────────────────────
const ACTIVE_COLOR = '#10B981';
const INACTIVE_LIGHT = '#6B7280';
const INACTIVE_DARK = '#9CA3AF';
const GLASS_TINT_LIGHT = 'rgba(255,255,255,0.65)';
const GLASS_TINT_DARK = 'rgba(20,20,20,0.6)';

export default function TabLayout() {
  const resolved = useThemeStore((s) => s.resolved);
  const isDark = resolved === 'dark';
  const insets = useSafeAreaInsets();

  const inactiveColor = isDark ? INACTIVE_DARK : INACTIVE_LIGHT;
  const glassScheme = isDark ? 'dark' : 'light';
  const glassTint = isDark ? GLASS_TINT_DARK : GLASS_TINT_LIGHT;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: inactiveColor,

        tabBarStyle: {
          position: 'absolute',
          bottom: BAR_MARGIN_B + insets.bottom,
          left: BAR_MARGIN_H,
          right: BAR_MARGIN_H,
          height: BAR_HEIGHT,
          borderRadius: BAR_RADIUS,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          overflow: 'hidden',
          paddingHorizontal: 8,
          paddingBottom: 0,
          paddingTop: 0,
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarItemStyle: {
          height: BAR_HEIGHT,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 0,
          paddingBottom: 0,
          paddingHorizontal: 0,
          marginHorizontal: 0,
        },
        tabBarIconStyle: {
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        },

        tabBarBackground: () => (
          <GlassBackground isDark={isDark} glassScheme={glassScheme} glassTint={glassTint} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Home size={24} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <BookOpen size={24} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="ia"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Sparkles size={24} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <TrendingUp size={24} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Person size={24} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

// ── Componente de ícono con dot indicator ──
// Cada ícono activo tiene un pequeño dot verde debajo

// ── GlassBackground ──
function GlassBackground({
  isDark,
  glassScheme,
  glassTint,
}: {
  isDark: boolean;
  glassScheme: 'light' | 'dark';
  glassTint: string;
}) {
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)';
  const shadowColor = isDark ? '#000' : 'rgba(0,0,0,0.08)';

  if (Platform.OS === 'ios') {
    return (
      <GlassView
        style={StyleSheet.absoluteFill}
        glassEffectStyle="regular"
        colorScheme={glassScheme}
        tintColor={glassTint}
      >
        <View
          style={[
            styles.glassBorder,
            { borderColor, shadowColor },
          ]}
        />
      </GlassView>
    );
  }

  // Android / Web fallback
  const bg = isDark ? 'rgba(18,18,18,0.92)' : 'rgba(255,255,255,0.92)';

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        styles.androidFallback,
        { backgroundColor: bg, borderColor, shadowColor },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: BAR_HEIGHT,
    paddingTop: 4,
    gap: 3,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: ACTIVE_COLOR,
  },
  glassBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: BAR_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 0,
  },
  androidFallback: {
    borderRadius: BAR_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
});
