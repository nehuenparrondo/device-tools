// src/components/molecules/Card.tsx — Superficie compartida que agrupa contenido relacionado.
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}
    >
      {children}
    </View>
  );
}
const styles = StyleSheet.create({
  card: { padding: 20, borderWidth: 1, borderRadius: 24, gap: 12 },
});
