// src/hooks/useBarometer.ts — Presión atmosférica si el hardware está presente.
import { Barometer } from '@/services/sensorService';
import { useLiveSensor } from './useLiveSensor';
export function useBarometer(enabled: boolean, interval: number) {
  return useLiveSensor(Barometer, enabled, interval);
}
