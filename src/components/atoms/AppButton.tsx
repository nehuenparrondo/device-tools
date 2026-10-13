// src/components/atoms/AppButton.tsx — Botón con estado ocupado y área táctil accesible.
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { tapFeedback } from '@/services/feedbackService';
import { AppText } from './AppText';
interface Props {
  label: string;
  onPress(): void;
  disabled?: boolean;
  busy?: boolean;
  secondary?: boolean;
  danger?: boolean;
}
export function AppButton({
  label,
  onPress,
  disabled = false,
  busy = false,
  secondary = false,
  danger = false,
}: Props) {
  const { colors } = useTheme();
  const foreground = danger ? colors.danger : secondary ? colors.text : colors.onPrimary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || busy, busy }}
      disabled={disabled || busy}
      onPress={() => {
        void tapFeedback();
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: secondary || danger ? colors.raised : colors.primary,
          opacity: disabled || busy ? 0.5 : pressed ? 0.75 : 1,
        },
      ]}
    >
      {busy ? (
        <ActivityIndicator color={foreground} />
      ) : (
        <AppText style={[styles.label, { color: foreground }]}>{label}</AppText>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    minWidth: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontWeight: '600', textAlign: 'center' },
});
