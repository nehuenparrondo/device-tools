// src/components/atoms/AppText.tsx — Texto accesible que responde al tema y escala de fuente.
import { StyleSheet, Text, type TextProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { TYPOGRAPHY } from '@/styles/theme';
export function AppText({
  variant = 'body',
  muted = false,
  style,
  ...props
}: TextProps & { variant?: 'body' | 'title' | 'subtitle' | 'small'; muted?: boolean }) {
  const { colors } = useTheme();
  return (
    <Text
      {...props}
      style={[
        styles.base,
        { color: muted ? colors.muted : colors.text, fontSize: TYPOGRAPHY[variant] },
        variant === 'title' || variant === 'subtitle' ? styles.heading : undefined,
        style,
      ]}
    />
  );
}
const styles = StyleSheet.create({
  base: { flexShrink: 1, lineHeight: 24 },
  heading: { fontWeight: '700', lineHeight: 36 },
});
