// src/hooks/useCameraPermission.ts — Lee el permiso sin pedirlo hasta que el usuario actúa.
import { useCameraPermissions } from 'expo-camera';
import * as Device from 'expo-device';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
export function useCameraPermission() {
  const [permission, requestPermission, refreshPermission] = useCameraPermissions();
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refreshPermission().catch(() => undefined);
    });
    return () => subscription.remove();
  }, [refreshPermission]);
  return { permission, requestPermission, supported: Platform.OS !== 'web' && Device.isDevice };
}
