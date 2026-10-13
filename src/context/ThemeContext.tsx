// src/context/ThemeContext.tsx — Sigue el sistema hasta elegir un tema y conserva la elección.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { THEME_STORAGE_KEY } from '@/constants/app';
import { DARK_COLORS, LIGHT_COLORS, type ThemeColors, type ThemeMode } from '@/styles/theme';
interface ThemeValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme(): void;
  ready: boolean;
  error: string | null;
}
export const ThemeContext = createContext<ThemeValue | null>(null);
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemMode = useColorScheme();
  const [preference, setPreference] = useState<ThemeMode | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mode = preference ?? (systemMode === 'dark' ? 'dark' : 'light');
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((stored) => {
        if (mounted && (stored === 'light' || stored === 'dark')) setPreference(stored);
      })
      .catch(() => {
        if (mounted) setError('No se pudo recuperar el tema guardado.');
      })
      .finally(() => {
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);
  const toggleTheme = useCallback(() => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setPreference(next);
    setError(null);
    AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(() =>
      setError('No se pudo guardar el tema.'),
    );
  }, [mode]);
  const value = useMemo(
    () => ({
      mode,
      colors: mode === 'dark' ? DARK_COLORS : LIGHT_COLORS,
      toggleTheme,
      ready,
      error,
    }),
    [mode, toggleTheme, ready, error],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
