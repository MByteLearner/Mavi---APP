import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useAuthStore } from '@/stores/useAuthStore';
import { Button, Input, Card, AnimatedEntry } from '@/components/ui';
import { ArrowLeft, Leaf, Mail, Lock, User as UserIcon } from '@/components/ui/icons';
import { radius, spacing, typography, useThemeColors } from '@/theme';
import { toast } from '@/components/ui/Toast';

export default function RegisterScreen() {
  const colors = useThemeColors();
  const register = useAuthStore((s) => s.register);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const errs: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) errs.name = 'El nombre es requerido';
    if (!email.trim()) errs.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Correo inválido';
    if (!password) errs.password = 'La contraseña es requerida';
    else if (password.length < 6) errs.password = 'Mínimo 6 caracteres';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const ok = await register({ name, email, password, goal: 'maintain', restrictions: [] });
      if (ok) {
        toast.success('¡Registro exitoso!');
        router.replace('/(tabs)');
      } else {
        toast.error('No se pudo registrar la cuenta');
      }
    } catch {
      toast.error('Error durante el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.headerNav}>
        <Pressable style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.back()} accessibilityLabel="Volver">
          <ArrowLeft size={20} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerBrand}>
          <View style={[styles.headerLeaf, { backgroundColor: colors.primary }]}>
            <Leaf size={16} color={colors.textInverse} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>MAVI</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AnimatedEntry>
          <View style={styles.centerCard}>
            <Card variant="elevated" padding="lg" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <View style={styles.form}>
                <Text style={[styles.cardHeading, { color: colors.textPrimary }]}>Crear cuenta</Text>
                <Text style={[styles.cardSubheading, { color: colors.textSecondary }]}>Ingresá tus datos para empezar tu plan</Text>

                <Input
                  label="Nombre completo"
                  placeholder="María García"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  error={errors.name}
                  leftIcon={<UserIcon size={20} color={colors.textSecondary} />}
                />

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
                  label="Registrarme"
                  onPress={handleRegister}
                  loading={loading}
                  style={{ marginTop: spacing.xs }}
                />
              </View>
            </Card>

            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>¿Ya tenés cuenta? </Text>
              <Text
                style={[styles.linkText, { color: colors.primary }]}
                onPress={() => router.push('/(auth)/login')}
              >
                Iniciá sesión
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
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerLeaf: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.bodyMedium,
    fontFamily: 'Fraunces_700Bold',
    fontSize: 16,
    letterSpacing: 1.5,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  centerCard: {
    gap: spacing.lg,
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
