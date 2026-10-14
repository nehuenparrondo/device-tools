// src/services/extrasService.ts — Acciones adicionales con comprobación de plataforma.
import * as Battery from 'expo-battery';
import * as Brightness from 'expo-brightness';
import * as Clipboard from 'expo-clipboard';
import * as Device from 'expo-device';
import * as Network from 'expo-network';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
export { Battery, Network, Brightness };
export interface DeviceSnapshot {
  battery: number | null;
  batteryState: string;
  network: string;
  connected: boolean | null;
  internet: boolean | null;
  deviceName: string;
  system: string;
  physical: boolean;
}
export async function readDeviceSnapshot(): Promise<DeviceSnapshot> {
  const results = await Promise.allSettled([
    Battery.isAvailableAsync().then(async (available) =>
      available
        ? Promise.all([Battery.getBatteryLevelAsync(), Battery.getBatteryStateAsync()])
        : null,
    ),
    Network.getNetworkStateAsync(),
  ]);
  const battery = results[0];
  const network = results[1];
  const powerStates: Record<number, string> = {
    0: 'Desconocido',
    1: 'Con batería',
    2: 'Cargando',
    3: 'Carga completa',
  };
  return {
    battery:
      battery?.status === 'fulfilled' && battery.value && battery.value[0] >= 0
        ? battery.value[0]
        : null,
    batteryState:
      battery?.status === 'fulfilled' && battery.value
        ? (powerStates[battery.value[1]] ?? 'Desconocido')
        : 'No disponible',
    network:
      network?.status === 'fulfilled' ? (network.value.type ?? 'Desconocida') : 'No disponible',
    connected: network?.status === 'fulfilled' ? (network.value.isConnected ?? null) : null,
    internet: network?.status === 'fulfilled' ? (network.value.isInternetReachable ?? null) : null,
    deviceName:
      [Device.manufacturer, Device.modelName].filter(Boolean).join(' ') ||
      'Dispositivo desconocido',
    system: [Device.osName, Device.osVersion].filter(Boolean).join(' ') || Platform.OS,
    physical: Platform.OS !== 'web' && Device.isDevice,
  };
}
export async function readBrightness(): Promise<number> {
  if (Platform.OS === 'web' || !(await Brightness.isAvailableAsync()))
    throw new Error('Brillo: no disponible en esta plataforma.');
  return Brightness.getBrightnessAsync();
}
export async function setAppBrightness(value: number): Promise<void> {
  if (Platform.OS === 'web' || !(await Brightness.isAvailableAsync()))
    throw new Error('Brillo: no disponible en esta plataforma.');
  await Brightness.setBrightnessAsync(Math.max(0, Math.min(1, value)));
}
export async function speak(
  text: string,
  shouldContinue: () => boolean = () => true,
): Promise<void> {
  if (!text.trim() || text.length > 500)
    throw new Error('Escribí un texto de entre 1 y 500 caracteres.');
  await Speech.stop();
  if (!shouldContinue()) return;
  await new Promise<void>((resolve, reject) =>
    Speech.speak(text.trim(), {
      language: 'es-AR',
      onDone: resolve,
      onStopped: resolve,
      onError: (error) => reject(error),
    }),
  );
}
export async function copyText(text: string): Promise<void> {
  if (!text.trim()) throw new Error('Escribí contenido antes de copiar.');
  await Clipboard.setStringAsync(text);
}
export async function readClipboard(): Promise<string> {
  return Clipboard.getStringAsync();
}
export async function stopSpeech(): Promise<void> {
  await Speech.stop();
}
