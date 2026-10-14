// tests/theme.test.ts — Comprueba contraste AA de la paleta marfil, petróleo, grafito y cobre.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LIGHT_COLORS, DARK_COLORS } from '../src/styles/theme.ts';
function luminance(color: string): number {
  const channels = [1, 3, 5].map((offset) => {
    const value = parseInt(color.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return (channels[0] ?? 0) * 0.2126 + (channels[1] ?? 0) * 0.7152 + (channels[2] ?? 0) * 0.0722;
}
function contrast(foreground: string, background: string): number {
  const values = [luminance(foreground), luminance(background)].sort(
    (first, second) => second - first,
  );
  return ((values[0] ?? 0) + 0.05) / ((values[1] ?? 0) + 0.05);
}
for (const [name, colors] of Object.entries({ light: LIGHT_COLORS, dark: DARK_COLORS })) {
  test(`paleta ${name}: textos, botones, estados y panel destacado cumplen contraste 4.5:1`, () => {
    const pairs = [
      [colors.text, colors.background],
      [colors.text, colors.surface],
      [colors.text, colors.raised],
      [colors.muted, colors.background],
      [colors.muted, colors.surface],
      [colors.muted, colors.raised],
      [colors.onPrimary, colors.primary],
      [colors.primary, colors.surface],
      [colors.primary, colors.raised],
      [colors.accent, colors.raised],
      [colors.danger, colors.raised],
      [colors.warning, colors.raised],
      [colors.onHero, colors.hero],
      [colors.heroMuted, colors.hero],
      [colors.heroAccent, colors.hero],
    ];
    for (const [foreground, background] of pairs) {
      assert.ok(foreground && background);
      assert.ok(contrast(foreground, background) >= 4.5, `${foreground} sobre ${background}`);
    }
  });
}
