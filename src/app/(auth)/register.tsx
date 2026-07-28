import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useAuthStore } from '@/stores/useAuthStore';
import { Button, Input, AnimatedEntry, LoadingOverlay } from '@/components/ui';
import { User, Mail, Lock, ArrowLeft } from '@/components/ui/icons';
import { palette, radius, spacing, typography } from '@/theme';
import { useHaptics } from '@/hooks/useHaptics';

export default function RegisterScreen() {
  const register = useAuthStore((s) => s.register);
  const haptics = useHaptics();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    if (!name.trim()) {
      setError('Ingresá tu nombre completo');
      haptics.warning();
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Ingresá un correo electrónico válido');
      haptics.warning();
      return;
    }
    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      haptics.warning();
      return;
    }

    setLoading(true);
    haptics.medium();

    const res = await register({
      name,
      email,
      password,
      goal: 'maintain',
      restrictions: [],
    });

    setLoading(false);

    if (res.success) {
      haptics.success();
      router.replace('/(tabs)');
    } else {
      haptics.error();
      setError(res.message ?? 'No se pudo crear la cuenta');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Volver">
          <ArrowLeft size={20} color={palette.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Crear cuenta MAVI</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.centerCard}>
          <AnimatedEntry delay={0}>
            <View style={styles.heroBlock}>
              <Text style={styles.heroTitle}>Creá tu cuenta</Text>
              <Text style={styles.heroSubtitle}>
                Ingresá tus datos personales para comenzar a utilizar MAVI.
              </Text>
            </View>
          </AnimatedEntry>

          <AnimatedEntry delay={80}>
            <View style={styles.form}>
              <Input
                label="Nombre completo"
                placeholder="Ej. María García"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  setError(null);
                }}
                leftIcon={<User size={20} color={palette.textSecondary} />}
              />
              <Input
                label="Correo electrónico"
                placeholder="maria@ejemplo.com"
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
                placeholder="Mínimo 4 caracteres"
                secureTextEntry
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setError(null);
                }}
                leftIcon={<Lock size={20} color={palette.textSecondary} />}
              />
            </View>
          </AnimatedEntry>

          {error ? (
            <AnimatedEntry delay={140}>
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            </AnimatedEntry>
          ) : null}

          <AnimatedEntry delay={200}>
            <Button
              label="Crear mi cuenta"
              variant="primary"
              size="lg"
              onPress={handleRegister}
              loading={loading}
              fullWidth
            />
          </AnimatedEntry>

          <AnimatedEntry delay={260}>
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>¿Ya tenés una cuenta?</Text>
              <Pressable onPress={() => router.back()} hitSlop={8}>
                <Text style={styles.loginLink}>Iniciá sesión</Text>
              </Pressable>
            </View>
          </AnimatedEntry>
        </View>
      </ScrollView>

      <LoadingOverlay visible={loading} title="Creando tu cuenta..." hint="Configurando tu perfil MAVI" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.divider,
    backgroundColor: palette.surface,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.bodyMedium,
    color: palette.textPrimary,
    fontFamily: 'Fraunces_500Medium',
    fontSize: 16,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  centerCard: {
    gap: spacing.lg,
  },
  heroBlock: {
    alignItems: 'center',
    textAlign: 'center',
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
  loginLink: {
    ...typography.bodyMedium,
    color: palette.primary,
    fontWeight: '700',
  },
});
