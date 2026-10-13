// src/hooks/useTheme.ts — Acceso tipado al tema compartido.
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme necesita ThemeProvider.');
  return context;
}
