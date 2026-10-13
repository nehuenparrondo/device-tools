// src/services/databaseService.web.ts — La BD nativa degrada sin cargar WASM en web.
import type { DatabaseApi } from '@/types/database';
function unavailable(): never {
  throw new Error('SQLite local: no disponible en esta plataforma. Usá el APK de Android.');
}
export const databaseService: DatabaseApi = {
  initialize: async () => {},
  save: async () => unavailable(),
  list: async () => unavailable(),
  remove: async () => unavailable(),
};
