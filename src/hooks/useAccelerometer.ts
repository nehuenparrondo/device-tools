// src/hooks/useAccelerometer.ts — Aceleración en g y limpieza centralizada.
import { VECTOR_SENSORS } from '@/services/sensorService';
import { useLiveSensor } from './useLiveSensor';
export function useAccelerometer(enabled: boolean, interval: number) {
  return useLiveSensor(VECTOR_SENSORS.accelerometer, enabled, interval);
}
