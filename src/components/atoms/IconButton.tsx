// src/components/atoms/IconButton.tsx — Acción compacta con etiqueta para lectores de pantalla.
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { tapFeedback } from '@/services/feedbackService';
export type IconName = ComponentProps<typeof Ionicons>['name'];
export function IconButton({
  icon,
  label,
  onPress,
}: {
  icon: IconName;
  label: string;
  onPress(): void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        void tapFeedback();
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.primary, opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <Ionicons name={icon} size={24} color={colors.onPrimary} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    boxShadow: '0px 3px 12px #00000030',
  },
});
