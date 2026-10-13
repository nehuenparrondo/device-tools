// src/services/linkService.ts — Confirmaciones y enlaces externos con protocolos permitidos.
import { Alert, Linking, Platform } from 'react-native';
import { getSafeUrl, validateCoordinates } from '@/utils/validators';
export async function confirmAction(title: string, message: string): Promise<boolean> {
  if (Platform.OS === 'web') return globalThis.confirm(`${title}\n\n${message}`);
  return new Promise((resolve) =>
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Continuar', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    ),
  );
}
export async function openScannedUrl(content: string): Promise<void> {
  const url = getSafeUrl(content);
  if (!url) throw new Error('Solo se pueden abrir enlaces HTTP o HTTPS sin credenciales.');
  if (await confirmAction('Abrir enlace externo', `Vas a salir de Device Tools.\n${url}`))
    await Linking.openURL(url);
}
export async function openMap(latitude: number, longitude: number): Promise<void> {
  validateCoordinates(latitude, longitude);
  const coordinate = `${latitude},${longitude}`;
  const nativeUrl =
    Platform.OS === 'ios' ? `maps:0,0?q=${coordinate}` : `geo:${coordinate}?q=${coordinate}`;
  try {
    if (Platform.OS !== 'web') {
      await Linking.openURL(nativeUrl);
      return;
    }
  } catch {
    /* Si no hay mapas instalados, ofrecemos la versión web. */
  }
  await Linking.openURL(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinate)}`,
  );
}
export async function openSettings(): Promise<void> {
  if (Platform.OS === 'web') throw new Error('Configurá los permisos desde tu navegador.');
  await Linking.openSettings();
}
