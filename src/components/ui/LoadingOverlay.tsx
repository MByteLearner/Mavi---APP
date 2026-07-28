import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';

export interface LoadingOverlayProps {
  visible: boolean;
  title?: string;
  hint?: string;
  emoji?: string;
}

export function LoadingOverlay({
  visible,
  title = 'Cargando...',
  hint,
  emoji,
}: LoadingOverlayProps) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
        <ActivityIndicator size="small" color="#0A0A0A" />
        <Text style={styles.title}>{title}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  content: { alignItems: 'center', paddingHorizontal: 32 },
  emoji: { fontSize: 28, color: '#111827', marginBottom: 16 },
  title: {
    fontSize: 14,
    color: '#111827',
    marginTop: 16,
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});
