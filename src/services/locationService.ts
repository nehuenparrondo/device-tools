// src/services/locationService.ts — GPS en primer plano y dirección legible opcional.
import * as Location from 'expo-location';
import type { LocationData } from '@/types/database';
import { withTimeout } from '../utils/withTimeout.ts';
export async function requireLocationPermission() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted)
    throw new Error('Permiso de ubicación denegado. Habilitalo en Configuración.');
  if (!(await Location.hasServicesEnabledAsync()))
    throw new Error('El GPS está apagado. Activá la ubicación del dispositivo.');
  return permission;
}
export function normalizeLocation(
  position: Location.LocationObject,
  address: string | null = null,
): LocationData {
  const coordinate = position.coords;
  return {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    accuracy: coordinate.accuracy,
    altitude: coordinate.altitude,
    speed: coordinate.speed === null || coordinate.speed < 0 ? null : coordinate.speed,
    heading: coordinate.heading === null || coordinate.heading < 0 ? null : coordinate.heading,
    address,
  };
}
export async function getAddress(data: LocationData): Promise<string | null> {
  try {
    const results = await withTimeout(
      Location.reverseGeocodeAsync({
        latitude: data.latitude,
        longitude: data.longitude,
      }),
      10000,
      'No se obtuvo la dirección a tiempo.',
    );
    const address = results[0];
    return address
      ? [address.street, address.streetNumber, address.city, address.region, address.country]
          .filter(Boolean)
          .join(', ')
          .slice(0, 500)
      : null;
  } catch {
    return null;
  }
}
export async function getCurrentPosition(): Promise<Location.LocationObject> {
  return withTimeout(
    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
    20000,
    'No se obtuvo señal GPS en 20 segundos. Probá al aire libre.',
  );
}
export async function watchPosition(
  callback: (data: LocationData) => void,
  onError: (message: string) => void,
) {
  return Location.watchPositionAsync(
    { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 3 },
    (position) => callback(normalizeLocation(position)),
    onError,
  );
}
