// src/services/sensorService.ts — Adaptadores de sensores sin dependencia de componentes visuales.
import { Accelerometer, Gyroscope, Magnetometer, Barometer, Pedometer } from 'expo-sensors';
import type { SensorData } from '@/types/components';
export const VECTOR_SENSORS = {
  accelerometer: Accelerometer,
  gyroscope: Gyroscope,
  magnetometer: Magnetometer,
} as const;
export { Barometer, Pedometer };
export function movementMagnitude(data: SensorData): number {
  return Math.hypot(data.x, data.y, data.z);
}
