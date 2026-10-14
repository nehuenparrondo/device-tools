// src/services/biometricService.ts — El sistema verifica la identidad; la app nunca recibe huellas.
import * as LocalAuthentication from 'expo-local-authentication';
import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';
import {
  getAuthenticationOptions,
  resolveBiometricCapability,
  type BiometricCapability,
} from './biometricPolicy';
export type { BiometricCapability } from './biometricPolicy';
export async function getBiometricCapability(): Promise<BiometricCapability> {
  if (Platform.OS === 'web')
    return resolveBiometricCapability({
      platform: 'web',
      expoGo: false,
      hardware: false,
      enrolled: false,
      supported: [],
      securityLevel: 0,
    });
  const [hardware, enrolled, supported, securityLevel] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
    LocalAuthentication.getEnrolledLevelAsync(),
  ]);
  return resolveBiometricCapability({
    platform: Platform.OS,
    expoGo: isRunningInExpoGo(),
    hardware,
    enrolled,
    supported,
    securityLevel,
  });
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
  missing_usage_description:
    'Esta app no tiene configurado el permiso de Face ID. Usá el código del iPhone en Expo Go o instalá una compilación propia con permiso de Face ID.',
  passcode_not_set: 'Configurá un código de desbloqueo en el dispositivo.',
  invalid_context: 'La sesión de autenticación venció. Intentá nuevamente.',
  unable_to_process: 'El sistema no pudo procesar la autenticación. Intentá nuevamente.',
  no_space: 'El sistema no tiene recursos disponibles para autenticar.',
};
export async function authenticateIdentity() {
  const capability = await getBiometricCapability();
  if (!capability.available) throw new Error(capability.notice);
  const result = await LocalAuthentication.authenticateAsync(
    getAuthenticationOptions(capability.mode),
  );
  if (!result.success)
    throw new Error(FAILURE_MESSAGES[result.error] ?? 'No se pudo autenticar. Intentá nuevamente.');
  return capability.mode;
}
