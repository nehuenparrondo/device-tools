// src/services/biometricService.ts — El sistema verifica la identidad; la app nunca recibe huellas.
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
export interface BiometricCapability {
  hardware: boolean;
  enrolled: boolean;
  types: string[];
  available: boolean;
}
export async function getBiometricCapability(): Promise<BiometricCapability> {
  if (Platform.OS === 'web')
    return { hardware: false, enrolled: false, types: [], available: false };
  const [hardware, enrolled, supported] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);
  const names: Record<number, string> = {
    1: 'Huella digital',
    2: 'Reconocimiento facial',
    3: 'Iris',
  };
  return {
    hardware,
    enrolled,
    types: supported.map((type) => names[type] ?? 'Biometría'),
    available: hardware && enrolled,
  };
}
const FAILURE_MESSAGES: Record<string, string> = {
  user_cancel: 'Autenticación cancelada.',
  system_cancel: 'El sistema canceló la autenticación.',
  app_cancel: 'La app canceló la autenticación.',
  authentication_failed: 'No se reconoció la identidad. Intentá nuevamente.',
  not_enrolled: 'No hay biometría registrada. Configurá una huella o rostro.',
  not_available: 'Biometría no disponible.',
  lockout: 'Demasiados intentos. Desbloqueá el dispositivo y esperá antes de reintentar.',
  timeout: 'Se agotó el tiempo de autenticación.',
  user_fallback: 'Se canceló el acceso biométrico.',
};
export async function authenticateIdentity(): Promise<void> {
  const capability = await getBiometricCapability();
  if (!capability.available)
    throw new Error('No hay biometría disponible y registrada en este dispositivo.');
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Desbloquear Device Tools',
    cancelLabel: 'Cancelar',
    fallbackLabel: '',
    disableDeviceFallback: true,
  });
  if (!result.success)
    throw new Error(FAILURE_MESSAGES[result.error] ?? 'No se pudo autenticar. Intentá nuevamente.');
}
