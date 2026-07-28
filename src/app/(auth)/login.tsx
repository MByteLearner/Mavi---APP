import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useAuthStore } from '@/stores/useAuthStore';
import { Button, Input, AnimatedEntry, LoadingOverlay } from '@/components/ui';
import { Mail, Lock, Eye, EyeOff } from '@/components/ui/icons';
import { palette, radius, shadow, spacing, typography } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const haptics = useHaptics();

  const [email, setEmail] = useState('maria.garcia@mavi.app');
  const [password, setPassword] = useState('mavi2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    haptics.medium();

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      haptics.success();
      router.replace('/(tabs)');
    } else {
      haptics.error();
      setError(result.message ?? 'Credenciales incorrectas');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.centerCard}>
          <AnimatedEntry delay={0}>
            <View style={styles.brandBadgeWrapper}>
              <View style={styles.brandLogo}>
                <Text style={styles.brandLogoText}>✦</Text>
              </View>
              <View style={styles.brandTextWrapper}>
                <Text style={styles.brandTitle}>MAVI</Text>
                <Text style={styles.brandTagline}>ASISTENTE DE NUTRICIÓN</Text>
              </View>
            </View>
          </AnimatedEntry>

          <AnimatedEntry delay={80}>
            <View style={styles.heroBlock}>
              <Text style={styles.heroTitle}>Bienvenido de nuevo</Text>
              <Text style={styles.heroSubtitle}>
                Ingresá a tu centro de control nutricional con visión robótica y precisión inteligente.
              </Text>
            </View>
          </AnimatedEntry>

          <AnimatedEntry delay={160}>
            <View style={styles.form}>
              <Input
                label="Correo electrónico"
                placeholder="tu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setError(null);
                }}
                leftIcon={<Mail size={20} color={palette.textSecondary} />}
              />

              <Input
                label="Contraseña"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setError(null);
                }}
                leftIcon={<Lock size={20} color={palette.textSecondary} />}
                rightIcon={
                  <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                    {showPassword ? (
                      <EyeOff size={20} color={palette.textSecondary} />
                    ) : (
                      <Eye size={20} color={palette.textSecondary} />
                    )}
                  </Pressable>
                }
              />

              {error ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <Pressable style={styles.forgotBtn}>
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </Pressable>

              <Button
                label="Iniciar sesión"
                variant="primary"
                size="lg"
                onPress={handleLogin}
                loading={loading}
                fullWidth
              />
            </View>
          </AnimatedEntry>

          <AnimatedEntry delay={240}>
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>¿No tenés una cuenta aún?</Text>
              <Pressable onPress={() => router.push('/(auth)/register')} hitSlop={8}>
                <Text style={styles.registerLink}>Registrate acá</Text>
              </Pressable>
            </View>
          </AnimatedEntry>
        </View>
      </ScrollView>

      <LoadingOverlay visible={loading} title="Iniciando sesión..." hint="Cargando tu perfil" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  centerCard: {
    gap: spacing.lg,
  },
  brandBadgeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  brandLogo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  brandLogoText: {
    color: palette.textInverse,
    fontSize: 24,
    fontFamily: 'Fraunces_700Bold',
  },
  brandTextWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  brandTitle: {
    ...typography.bodyMedium,
    color: palette.textPrimary,
    fontFamily: 'Fraunces_700Bold',
    fontSize: 20,
    letterSpacing: 1.5,
  },
  brandTagline: {
    ...typography.caption,
    color: palette.textSecondary,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 2,
  },
  heroBlock: {
    alignItems: 'center',
  },
  heroTitle: {
    ...typography.title,
    color: palette.textPrimary,
    fontFamily: 'Fraunces_500Medium',
    fontSize: 28,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...typography.bodySecondary,
    color: palette.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 22,
    textAlign: 'center',
  },
  form: { gap: spacing.md },
  errorBanner: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    ...typography.bodyMedium,
    color: palette.error,
    textAlign: 'center',
    fontWeight: '500',
  },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -4 },
  forgotText: {
    ...typography.caption,
    color: palette.primary,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  footerText: {
    ...typography.bodySecondary,
    color: palette.textSecondary,
  },
  registerLink: {
    ...typography.bodyMedium,
    color: palette.primary,
    fontWeight: '700',
  },
});
