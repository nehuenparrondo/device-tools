// src/components/organisms/ScreenContainer.tsx — Scroll adaptable, safe area y espacio para acciones flotantes.
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/atoms/AppText';
import { useTheme } from '@/hooks/useTheme';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import type { PageProps } from '@/types/components';
export function ScreenContainer({
  title,
  subtitle,
  children,
}: PageProps & { children: ReactNode }) {
  const { colors } = useTheme();
  const { scrollRef, onScroll } = useScrollToTop();
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.content}>
          <View style={styles.heading}>
            <AppText variant="small" muted>
              DEVICE TOOLS / EXPLORÁ TU DISPOSITIVO
            </AppText>
            <AppText variant="title" accessibilityRole="header">
              {title}
            </AppText>
            <AppText muted>{subtitle}</AppText>
          </View>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flexGrow: 1, padding: 16, paddingBottom: 152 },
  content: { width: '100%', maxWidth: 1280, alignSelf: 'center', gap: 16 },
  heading: { gap: 8, paddingVertical: 16 },
});
