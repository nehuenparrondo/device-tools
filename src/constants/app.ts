// src/constants/app.ts — Límites y tiempos independientes de la presentación.
export const APP_NAME = 'Device Tools';
export const SCROLL_THRESHOLD = 240;
export const MAX_NOTE_LENGTH = 200;
export const MAX_CODE_LENGTH = 8192;
export const SENSOR_INTERVALS = [100, 250, 500, 1000] as const;
export const DEFAULT_SENSOR_INTERVAL = 250;
export const THEME_STORAGE_KEY = '@device-tools/theme';
export const SHAKE_THRESHOLD = 2.4;
export const SHAKE_COOLDOWN = 1500;
