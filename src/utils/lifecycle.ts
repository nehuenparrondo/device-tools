// src/utils/lifecycle.ts — Mantiene solicitudes del sistema durante inactive, nunca en background.
export function isScreenActive(focused: boolean, state: string | null, allowSystemPrompt: boolean) {
  return focused && (state === 'active' || (allowSystemPrompt && state === 'inactive'));
}
