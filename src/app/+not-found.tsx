import { Link, Stack } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';
import { STRINGS } from '@/constants/strings';
import { palette, spacing, typography } from '@/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'No encontrado' }} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>404</Text>
          </View>
          <Text style={styles.title}>{STRINGS.notFound.title}</Text>
          <Text style={styles.body}>{STRINGS.notFound.body}</Text>
          <Link href="/" asChild>
            <Button label={STRINGS.notFound.action} size="md" fullWidth={false} />
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, gap: spacing.md },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFEDED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  iconText: { ...typography.title, color: palette.primary, fontWeight: '700' },
  title: { ...typography.title, color: palette.textPrimary, fontWeight: '700' },
  body: { ...typography.bodySecondary, color: palette.textSecondary, textAlign: 'center', maxWidth: 280 },
});
