// app/_layout.tsx — Proveedores y acciones flotantes compartidos por todas las rutas.
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Slot, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/atoms/AppText';
import { ScrollToTopButton } from '@/components/atoms/ScrollToTopButton';
import { ThemeToggleButton } from '@/components/atoms/ThemeToggleButton';
import { StatePanel } from '@/components/molecules/StatePanel';
import { DatabaseProvider } from '@/context/DatabaseContext';
import { ScrollProvider } from '@/context/ScrollContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/useTheme';
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <View style={styles.error}>
          <StatePanel title="Ocurrió un error" message={error.message} action={retry} />
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
function AppShell() {
  const { mode, colors, ready, error } = useTheme();
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const [fontsLoaded, fontError] = useFonts(Ionicons.font);
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      {!ready || (!fontsLoaded && !fontError) ? (
        <StatePanel
          title="Preparando Device Tools"
          message="Cargando preferencias e íconos."
          loading
        />
      ) : fontError ? (
        <StatePanel title="No se pudieron cargar los íconos" message={fontError.message} />
      ) : (
        <Slot />
      )}
      {error && <AppText accessibilityLiveRegion="polite">{error}</AppText>}
      {ready && fontsLoaded && (
        <View
          style={[
            styles.floating,
            { pointerEvents: 'box-none' },
            {
              bottom: Math.max(72, 48 + 24 * fontScale) + insets.bottom + 16,
              right: Math.max(16, insets.right + 8),
            },
          ]}
        >
          <ScrollToTopButton />
          <ThemeToggleButton />
        </View>
      )}
    </View>
  );
}
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DatabaseProvider>
          <ScrollProvider>
            <AppShell />
          </ScrollProvider>
        </DatabaseProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1 },
  floating: { position: 'absolute', gap: 12 },
  error: { flex: 1, padding: 24, justifyContent: 'center' },
});
