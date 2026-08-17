import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { ArrowLeft, Send, Sparkles, Leaf } from '@/components/ui/icons';
import { useThemeColors, type PaletteColors, radius, shadow, spacing, typography } from '@/theme';
import { AnimatedEntry, Chip } from '@/components/ui';
import { apiRequest } from '@/services/api';
import { API_CONFIG } from '@/services/config';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const DEFAULT_SUGGESTIONS = [
  '¿Qué puedo cenar hoy?',
  '¿Cómo aumento mi proteína?',
  'Sugerí un snack saludable',
  '¿Cuántos vasos de agua debo tomar?',
];

function getAIMessage(query: string, name: string): string {
  const q = query.toLowerCase();

  if (q.includes('cenar') || q.includes('cena')) {
    return `Hola ${name}, para la cena te recomiendo una opción ligera: Pechuga de pollo a la plancha con ensalada verde o verduras al vapor. Te aportará proteína de alta calidad sin exceder tus calorías.`;
  }
  if (q.includes('proteín') || q.includes('proteina')) {
    return `Para incrementar tu consumo de proteína, ${name}, podés incluir yogurt griego sin azúcar, huevos revueltos al desayuno, pechuga de pavo, atún al agua o frutos secos como almendras.`;
  }
  if (q.includes('snack') || q.includes('merienda')) {
    return `Una gran opción de snack saludable es una manzana cortada con una cucharada de mantequilla de maní natural, o un puñado de 15 almendras con una infusión.`;
  }
  if (q.includes('agua') || q.includes('hidratación')) {
    return `El objetivo recomendado es de 2 a 2.5 litros de agua al día (aprox. 8 vasos). Llevar un vaso de agua cerca mientras trabajás te ayudará a cumplir tu meta.`;
  }
  if (q.includes('hola') || q.includes('buenas')) {
    return `¡Hola ${name}! 👋 Soy MAVI, tu asistente nutricional con IA. ¿En qué te puedo ayudar con tu plan o alimentación de hoy?`;
  }

  return `Entendido, ${name}. Basándome en tu perfil nutricional y objetivos, te recomiendo mantener un balance adecuado entre proteínas y vegetales en tu próxima comida. ¿Te gustaría que te sugiera una receta específica?`;
}

export default function ChatIAScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const user = useAuthStore((s) => s.user);
  const userProfile = useUserStore((s) => s.profile);
  const userName = userProfile?.name ?? user?.name ?? 'Usuario';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      text: `¡Hola ${userName}! 👋 Soy MAVI IA. Estoy aquí para responder tus dudas nutricionales, sugerirte recetas y ayudarte con tu plan alimenticio.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      },
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const sendMessage = async (textToSend?: string) => {
    const messageText = (textToSend ?? input).trim();
    if (!messageText || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      if (!API_CONFIG.useMocks) {
        const response = await apiRequest<{ reply: string }>('/ai/chat', {
          method: 'POST',
          body: { message: messageText },
          timeoutMs: 60_000,
        });
        const replyText = response?.reply || getAIMessage(messageText, userName.split(' ')[0]);
        const aiMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          role: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Mocks active');
      }
    } catch (err) {
      console.log('[Chat IA Error]:', err);
      const aiReply = getAIMessage(messageText, userName.split(' ')[0]);
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* ── Encabezado ── */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Volver"
        >
          <ArrowLeft size={20} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <View style={styles.avatar}>
            <Sparkles size={18} color={colors.textInverse} />
          </View>
          <View>
            <Text style={styles.headerTitle}>MAVI IA</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>En línea · Asistente Nutricional</Text>
            </View>
          </View>
        </View>

        <Chip label="IA" tone="brand" />
      </View>

      {/* ── Feed de Mensajes ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.feed}
          contentContainerStyle={styles.feedContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubbleContainer,
                m.role === 'user' ? styles.userBubbleContainer : styles.aiBubbleContainer,
              ]}
            >
              {m.role === 'assistant' && (
                <View style={styles.aiBadgeIcon}>
                  <Leaf size={14} color={colors.primary} />
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  m.role === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    m.role === 'user' ? styles.userBubbleText : styles.aiBubbleText,
                  ]}
                >
                  {m.text}
                </Text>
                <Text
                  style={[
                    styles.timestamp,
                    m.role === 'user' ? styles.userTimestamp : styles.aiTimestamp,
                  ]}
                >
                  {m.timestamp}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.bubbleContainer, styles.aiBubbleContainer]}>
              <View style={styles.aiBadgeIcon}>
                <Leaf size={14} color={colors.primary} />
              </View>
              <View style={[styles.bubble, styles.aiBubble, styles.typingBubble]}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.bubbleText, styles.aiBubbleText, { marginLeft: 8 }]}>
                  MAVI está escribiendo...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* ── Sugerencias Rápidas y Compositor ── */}
        <View
          style={[
            styles.composerWrapper,
            isKeyboardVisible && styles.composerWrapperKeyboard,
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsRow}
          >
            {DEFAULT_SUGGESTIONS.map((s) => (
              <Pressable
                key={s}
                style={({ pressed }) => [
                  styles.suggestionPill,
                  pressed && styles.suggestionPillPressed,
                ]}
                onPress={() => sendMessage(s)}
              >
                <Text style={styles.suggestionText}>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Preguntale algo a MAVI IA..."
              placeholderTextColor={colors.textDisabled}
              style={styles.input}
              multiline={false}
              onSubmitEditing={() => sendMessage()}
              returnKeyType="send"
            />
            <Pressable
              onPress={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              style={[
                styles.sendBtn,
                (!input.trim() || isTyping) && styles.sendBtnDisabled,
              ]}
              accessibilityLabel="Enviar mensaje"
            >
              <Send size={18} color={colors.textInverse} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(colors: PaletteColors) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
      marginLeft: spacing.xs,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadow.sm,
    },
    headerTitle: {
      ...typography.bodyMedium,
      color: colors.textPrimary,
      fontFamily: 'Fraunces_600SemiBold',
      fontSize: 16,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 2,
    },
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: colors.success,
    },
    statusText: {
      ...typography.caption,
      color: colors.textSecondary,
      fontSize: 11,
    },

    feed: {
      flex: 1,
    },
    feedContent: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      gap: spacing.md,
    },

    bubbleContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginVertical: 4,
    },
    userBubbleContainer: {
      justifyContent: 'flex-end',
    },
    aiBubbleContainer: {
      justifyContent: 'flex-start',
      gap: spacing.xs,
    },
    aiBadgeIcon: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 2,
    },
    bubble: {
      maxWidth: '82%',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: radius.card,
    },
    userBubble: {
      backgroundColor: colors.primary,
      borderBottomRightRadius: 4,
    },
    aiBubble: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderBottomLeftRadius: 4,
      ...shadow.sm,
    },
    typingBubble: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm + 4,
    },

    bubbleText: {
      ...typography.bodyMedium,
      fontSize: 15,
      lineHeight: 22,
    },
    userBubbleText: {
      color: colors.textInverse,
    },
    aiBubbleText: {
      color: colors.textPrimary,
    },

    timestamp: {
      fontSize: 10,
      marginTop: 4,
      alignSelf: 'flex-end',
    },
    userTimestamp: {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    aiTimestamp: {
      color: colors.textDisabled,
    },

    composerWrapper: {
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: Platform.OS === 'ios' ? 100 : 90,
      gap: spacing.sm,
    },
    composerWrapperKeyboard: {
      paddingBottom: spacing.sm,
    },
    suggestionsRow: {
      gap: spacing.xs,
      paddingBottom: spacing.xs,
    },
    suggestionPill: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderRadius: radius.pill,
    },
    suggestionPillPressed: {
      backgroundColor: colors.primarySoft,
    },
    suggestionText: {
      ...typography.caption,
      color: colors.textPrimary,
      fontWeight: '500',
    },

    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: Platform.OS === 'ios' ? 8 : 4,
      gap: spacing.sm,
    },
    input: {
      flex: 1,
      ...typography.bodyMedium,
      color: colors.textPrimary,
      maxHeight: 90,
      paddingVertical: 4,
    },
    sendBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadow.sm,
    },
    sendBtnDisabled: {
      backgroundColor: colors.border,
      opacity: 0.6,
    },
  });
}
