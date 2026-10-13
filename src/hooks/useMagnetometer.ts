// src/hooks/useMagnetometer.ts — Campo magnético en microteslas.
import { VECTOR_SENSORS } from '@/services/sensorService';
import { useLiveSensor } from './useLiveSensor';
export function useMagnetometer(enabled: boolean, interval: number) {
  return useLiveSensor(VECTOR_SENSORS.magnetometer, enabled, interval);
}
