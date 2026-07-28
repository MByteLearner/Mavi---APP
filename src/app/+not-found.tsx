import { Link, Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, EmptyState } from '@/components/ui';
import { STRINGS } from '@/constants/strings';
import { palette, spacing } from '@/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'No encontrado' }} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <EmptyState
            illustration="error"
            title={STRINGS.notFound.title}
            body={STRINGS.notFound.body}
            action={
              <Link href="/" asChild>
                <Button label={STRINGS.notFound.action} size="md" fullWidth={false} />
              </Link>
            }
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
});
