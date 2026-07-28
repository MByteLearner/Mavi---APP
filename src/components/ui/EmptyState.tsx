import { Text, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { spacing, typography, useThemeColors } from '@/theme';
import { IllustrationError, IllustrationPlan, IllustrationRecipe, IllustrationHistory, IllustrationProfile, IllustrationChat, IllustrationSparkle } from './Illustrations';

export type EmptyStateIllustration = 'plan' | 'recipe' | 'history' | 'profile' | 'chat' | 'sparkle' | 'error';

export interface EmptyStateProps {
  illustration?: EmptyStateIllustration;
  icon?: ReactNode;
  emoji?: string;
  title: string;
  body?: string;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const illustrationMap = {
  plan: IllustrationPlan,
  recipe: IllustrationRecipe,
  history: IllustrationHistory,
  profile: IllustrationProfile,
  chat: IllustrationChat,
  sparkle: IllustrationSparkle,
  error: IllustrationError,
} as const;

export function EmptyState({ illustration, icon, emoji, title, body, action, style }: EmptyStateProps) {
  const colors = useThemeColors();
  const Illustration = illustration ? illustrationMap[illustration] : null;

  return (
    <View style={[styles.container, style]}>
      {Illustration ? <Illustration size={160} /> : icon ? <View style={[styles.iconWrapper, { backgroundColor: colors.primarySoft }]}>{icon}</View> : null}
      {emoji && !Illustration && !icon ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {body ? <Text style={[styles.body, { color: colors.textSecondary }]}>{body}</Text> : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: spacing.lg },
  iconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emoji: { fontSize: 40, marginBottom: spacing.lg },
  title: {
    ...typography.titleSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  body: {
    ...typography.bodySecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 320,
  },
  action: { marginTop: spacing.xl },
});
