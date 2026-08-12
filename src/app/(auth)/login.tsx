import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useAuthStore } from '@/stores/useAuthStore';
import { Button, Input, Card, AnimatedEntry } from '@/components/ui';
import { Leaf, Mail, Lock } from '@/components/ui/icons';
import { shadow, spacing, typography, useThemeColors } from '@/theme';
import { toast } from '@/components/ui/Toast';

export default function LoginScreen() {
  const colors = useThemeColors();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('demo@mavi.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Correo inválido';
    if (!password) errs.password = 'La contraseña es requerida';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const ok = await login(email, password);
      if (ok) {
        toast.success('¡Bienvenido de nuevo!');
        router.replace('/(tabs)');
      } else {
        toast.error('Credenciales incorrectas');
      }
    } catch {
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AnimatedEntry>
          <View style={styles.centerCard}>
            <View style={styles.brandBadgeWrapper}>
              <View style={[styles.brandLogo, { backgroundColor: colors.primary }]}>
                <Leaf size={28} color={colors.textInverse} />
              </View>
              <View style={styles.brandTextWrapper}>
                <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>MAVI</Text>
                <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>Asistente de Nutrición</Text>
              </View>
            </View>

            <Card variant="elevated" padding="lg" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <View style={styles.form}>
                <Text style={[styles.cardHeading, { color: colors.textPrimary }]}>Iniciar Sesión</Text>
                <Text style={[styles.cardSubheading, { color: colors.textSecondary }]}>Ingresá tus credenciales para continuar</Text>

                <Input
                  label="Correo electrónico"
                  placeholder="ejemplo@mavi.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                  leftIcon={<Mail size={20} color={colors.textSecondary} />}
                />

                <Input
                  label="Contraseña"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  error={errors.password}
                  leftIcon={<Lock size={20} color={colors.textSecondary} />}
                />

                <Button
                  label="Ingresar"
                  onPress={handleLogin}
                  loading={loading}
                  style={{ marginTop: spacing.xs }}
                />
              </View>
            </Card>

            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>¿No tenés cuenta? </Text>
              <Text
                style={[styles.linkText, { color: colors.primary }]}
                onPress={() => router.push('/(auth)/register')}
              >
                Registrate
              </Text>
            </View>
          </View>
        </AnimatedEntry>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
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
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  brandTextWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  brandTitle: {
    ...typography.displaySoft,
    fontSize: 26,
    fontFamily: 'Fraunces_700Bold',
    letterSpacing: 2,
  },
  brandSubtitle: {
    ...typography.caption,
    marginTop: -2,
  },
  form: {
    gap: spacing.md,
  },
  cardHeading: {
    ...typography.titleSecondary,
    fontFamily: 'Fraunces_500Medium',
  },
  cardSubheading: {
    ...typography.caption,
    marginTop: -8,
    marginBottom: spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  footerText: {
    ...typography.bodySecondary,
  },
  linkText: {
    ...typography.bodySecondary,
    fontWeight: '700',
  },
});
