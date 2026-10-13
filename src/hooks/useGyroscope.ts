// src/hooks/useGyroscope.ts — Rotación en radianes por segundo.
import { VECTOR_SENSORS } from '@/services/sensorService';
import { useLiveSensor } from './useLiveSensor';
export function useGyroscope(enabled: boolean, interval: number) {
  return useLiveSensor(VECTOR_SENSORS.gyroscope, enabled, interval);
}
