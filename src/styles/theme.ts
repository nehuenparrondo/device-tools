// src/styles/theme.ts — Paletas accesibles y escalas visuales compartidas.
export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const TYPOGRAPHY = { small: 13, body: 16, subtitle: 20, title: 30 } as const;
export const BREAKPOINTS = { landscape: 600, tablet: 768, desktop: 1100 } as const;
export const LIGHT_COLORS = {
  background: '#F0F4F9',
  surface: '#FFFFFF',
  raised: '#E6EDF7',
  text: '#152238',
  muted: '#52617A',
  primary: '#2058B0',
  onPrimary: '#FFFFFF',
  accent: '#12735E',
  border: '#C6D2E3',
  danger: '#B52B3B',
  warning: '#885700',
};
export const DARK_COLORS: typeof LIGHT_COLORS = {
  background: '#101A2B',
  surface: '#1A2940',
  raised: '#263A54',
  text: '#F1F5FD',
  muted: '#B6C6DD',
  primary: '#8DB9FF',
  onPrimary: '#10233F',
  accent: '#74D8BB',
  border: '#425B78',
  danger: '#FF9BA7',
  warning: '#F4CE86',
};
export type ThemeColors = typeof LIGHT_COLORS;
export type ThemeMode = 'light' | 'dark';
