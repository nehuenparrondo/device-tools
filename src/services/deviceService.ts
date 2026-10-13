// src/services/deviceService.ts — Consulta capacidades sin pedir permisos al abrir el panel.
import { Camera } from 'expo-camera';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { getBiometricCapability } from './biometricService';
import { VECTOR_SENSORS } from './sensorService';
import type { Availability } from '@/types/components';
export async function getToolAvailability(): Promise<Record<string, Availability>> {
  const state: Record<string, Availability> = {
    about: 'available',
    extras: Platform.OS === 'web' ? 'unavailable' : 'available',
    history: Platform.OS === 'web' ? 'unavailable' : 'available',
  };
  if (Platform.OS === 'web')
    return {
      ...state,
      camera: 'unavailable',
      scanner: 'unavailable',
      location: 'unavailable',
      sensors: 'unavailable',
      biometrics: 'unavailable',
    };
  const checks = await Promise.allSettled([
    Camera.getCameraPermissionsAsync(),
    Location.getForegroundPermissionsAsync(),
    Promise.all(Object.values(VECTOR_SENSORS).map((sensor) => sensor.isAvailableAsync())),
    getBiometricCapability(),
  ]);
  const camera = checks[0];
  state.camera = !Device.isDevice
    ? 'unavailable'
    : camera?.status === 'fulfilled'
      ? camera.value.granted
        ? 'available'
        : 'pending'
      : 'error';
  state.scanner = state.camera;
  const location = checks[1];
  state.location =
    location?.status === 'fulfilled' ? (location.value.granted ? 'available' : 'pending') : 'error';
  const sensors = checks[2];
  state.sensors =
    sensors?.status === 'fulfilled'
      ? sensors.value.some(Boolean)
        ? 'available'
        : 'unavailable'
      : 'error';
  const biometrics = checks[3];
  state.biometrics =
    biometrics?.status === 'fulfilled'
      ? biometrics.value.available
        ? 'available'
        : biometrics.value.hardware
          ? 'pending'
          : 'unavailable'
      : 'error';
  return state;
}
