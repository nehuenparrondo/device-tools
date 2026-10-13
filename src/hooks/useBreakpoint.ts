// src/hooks/useBreakpoint.ts — Recalcula el diseño al rotar o redimensionar.
import { useWindowDimensions } from 'react-native';
import { BREAKPOINTS } from '@/styles/theme';
export function useBreakpoint() {
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  return {
    width,
    height,
    landscape,
    columns:
      width >= BREAKPOINTS.desktop
        ? 3
        : width >= BREAKPOINTS.tablet || (landscape && width >= BREAKPOINTS.landscape)
          ? 2
          : 1,
    wide: width >= BREAKPOINTS.tablet,
  };
}
