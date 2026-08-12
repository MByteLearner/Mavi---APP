import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { AIRecommendationCard, Chip, AnimatedEntry } from '@/components/ui';
import { Mic, Send, Image } from '@/components/ui/icons';
import { useThemeColors, type PaletteColors, radius, spacing, typography } from '@/theme';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const seed: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    text: 'Hola, soy MAVI. Hoy te propongo una cena ligera con proteínas para terminar el día. ¿Querés que te sugiera algo?',
  },
];

const suggestions = [
  '¿Qué puedo cenar hoy?',
  '¿Cuánta proteína necesito?',
  'Sugerí un snack saludable',
];

export default function IAScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const [messages] = useState<ChatMessage[]>(seed);
  const [input, setInput] = useState('');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>✦</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>MAVI IA</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>En línea</Text>
            </View>
          </View>
        </View>
        <Chip label="Beta" tone="warning" />
      </View>

      <ScrollView
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => (
          <AnimatedEntry key={m.id} delay={80}>
            <View
              style={[
                styles.bubble,
                m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  m.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextAssistant,
                  m.role === 'assistant' && styles.bubbleTextSerif,
                ]}
              >
                {m.text}
              </Text>
            </View>
          </AnimatedEntry>
        ))}

        <View style={styles.suggestionsBlock}>
          <Text style={styles.suggestionsTitle}>Sugerencias para vos</Text>
          <View style={{ gap: spacing.md }}>
            <AIRecommendationCard
              title="Cena ligera con proteínas"
              body="Recomiendo pollo grillado con ensalada verde. Bajo en calorías y alto en proteínas para recuperarte del entrenamiento."
              tag="Recomendado"
            />
            <AIRecommendationCard
              title="Snack pre-entrenamiento"
              body="Un plátano con mantequilla de maní te dará energía sostenida para tu sesión de la tarde."
              tag="Para hoy 17:00"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.composer}>
        <View style={styles.suggestionsRow}>
          {suggestions.map((s) => (
            <Pressable key={s} style={styles.suggestionPill}>
              <Text style={styles.suggestionText}>{s}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.inputRow}>
          <Pressable style={styles.iconBtn} accessibilityLabel="Adjuntar imagen">
            <Image size={20} color={colors.textSecondary} />
          </Pressable>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Escribí tu pregunta..."
            placeholderTextColor={colors.textDisabled}
            style={styles.input}
          />
          <Pressable style={styles.iconBtn} accessibilityLabel="Dictar">
            <Mic size={20} color={colors.textSecondary} />
          </Pressable>
          <Pressable
            style={[styles.sendBtn, !input && styles.sendBtnDisabled]}
            accessibilityLabel="Enviar"
            disabled={!input}
          >
            <Send size={18} color={colors.textInverse} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: PaletteColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: { color: colors.textInverse, fontSize: 18, fontWeight: '700', fontFamily: 'Fraunces_700Bold' },
    headerTitle: { ...typography.bodyMedium, color: colors.textPrimary, fontWeight: '700', fontFamily: 'Fraunces_500Medium', fontSize: 16 },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
    statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
    statusText: { ...typography.caption, color: colors.textSecondary },
    feed: { flex: 1 },
    feedContent: { padding: spacing.lg, paddingBottom: spacing['2xl'] },
    bubble: {
      padding: spacing.md,
      borderRadius: radius.lg,
      marginBottom: spacing.sm,
      maxWidth: '88%',
      borderWidth: 1,
    },
    bubbleUser: {
      alignSelf: 'flex-end',
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    bubbleAssistant: {
      alignSelf: 'flex-start',
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    bubbleText: { ...typography.body, lineHeight: 24 },
    bubbleTextUser: { color: colors.textInverse },
    bubbleTextAssistant: { color: colors.textPrimary },
    bubbleTextSerif: { fontFamily: 'Fraunces_400Regular', fontSize: 16, lineHeight: 26 },
    suggestionsBlock: { marginTop: spacing.lg, gap: spacing.md },
    suggestionsTitle: {
      ...typography.titleSecondary,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    composer: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    suggestionsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, flexWrap: 'wrap' },
    suggestionPill: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
    },
    suggestionText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: radius.pill,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      flex: 1,
      ...typography.body,
      color: colors.textPrimary,
      paddingHorizontal: 8,
    },
    sendBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendBtnDisabled: { backgroundColor: colors.textDisabled, opacity: 0.5 },
  });
}

