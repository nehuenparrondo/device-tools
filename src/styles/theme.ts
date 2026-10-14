// src/styles/theme.ts — Paletas accesibles y escalas visuales compartidas.
export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const TYPOGRAPHY = { small: 13, body: 16, subtitle: 20, title: 30 } as const;
export const BREAKPOINTS = { landscape: 600, tablet: 768, desktop: 1100 } as const;
export const LIGHT_COLORS = {
  background: '#F6F2EA',
  surface: '#FFFCF7',
  raised: '#E8E4DA',
  text: '#252D29',
  muted: '#62665E',
  primary: '#1D6256',
  onPrimary: '#FFFFFF',
  accent: '#98512D',
  border: '#D8D4C8',
  danger: '#A9363F',
  warning: '#805619',
  hero: '#1E5143',
  onHero: '#FFF9ED',
  heroMuted: '#D8E6D9',
  heroAccent: '#F2C599',
};
export const DARK_COLORS: typeof LIGHT_COLORS = {
  background: '#181E1B',
  surface: '#222B26',
  raised: '#303B34',
  text: '#F3F0E7',
  muted: '#B8C3B8',
  primary: '#A5D8B8',
  onPrimary: '#162D22',
  accent: '#E8B486',
  border: '#47574B',
  danger: '#F3AAA9',
  warning: '#E6C78B',
  hero: '#344B3C',
  onHero: '#FFF9ED',
  heroMuted: '#D8E6D9',
  heroAccent: '#F2C599',
};
export type ThemeColors = typeof LIGHT_COLORS;
export type ThemeMode = 'light' | 'dark';
