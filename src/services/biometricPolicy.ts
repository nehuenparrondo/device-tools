// src/services/biometricPolicy.ts — Distingue biometría real, código del sistema y acceso no protegido.
export type AuthenticationMode = 'biometric' | 'device-passcode' | 'unavailable';
export interface BiometricCapability {
  hardware: boolean;
  enrolled: boolean;
  types: string[];
  available: boolean;
  mode: AuthenticationMode;
  canBypass: boolean;
  notice: string;
  actionLabel: string;
}
interface CapabilityInput {
  platform: string;
  expoGo: boolean;
  hardware: boolean;
  enrolled: boolean;
  supported: readonly number[];
  securityLevel: number;
}
export function resolveBiometricCapability(input: CapabilityInput): BiometricCapability {
  const names: Record<number, string> = {
    1: 'Huella digital',
    2: 'Reconocimiento facial',
    3: 'Iris',
  };
  const expoFaceId = input.platform === 'ios' && input.expoGo && input.supported.includes(2);
  const mode: AuthenticationMode =
    input.platform === 'web'
      ? 'unavailable'
      : expoFaceId
        ? input.securityLevel >= 1
          ? 'device-passcode'
          : 'unavailable'
        : input.hardware && input.enrolled
          ? 'biometric'
          : 'unavailable';
  return {
    hardware: input.hardware,
    enrolled: input.enrolled,
    types: input.supported.map((type) => names[type] ?? 'Biometría'),
    available: mode !== 'unavailable',
    mode,
    canBypass:
      input.platform !== 'web' &&
      mode === 'unavailable' &&
      (!input.hardware || !input.enrolled) &&
      !expoFaceId,
    notice: expoFaceId
      ? 'Expo Go no permite Face ID. Podés verificar tu identidad con el código del iPhone, si está configurado. Face ID real requiere una compilación propia para iOS.'
      : mode === 'biometric'
        ? 'El sistema verifica tu identidad; la app nunca recibe huellas ni imágenes del rostro.'
        : 'No hay biometría disponible y registrada. Configurá una huella o rostro en el dispositivo.',
    actionLabel:
      mode === 'device-passcode' ? 'Verificar con código del iPhone' : 'Verificar con biometría',
  };
}
export function getAuthenticationOptions(mode: AuthenticationMode) {
  if (mode === 'unavailable') throw new Error('No hay autenticación disponible.');
  return {
    promptMessage:
      mode === 'device-passcode'
        ? 'Verificar con el código del iPhone'
        : 'Desbloquear Device Tools',
    cancelLabel: 'Cancelar',
    fallbackLabel: mode === 'device-passcode' ? 'Usar código' : '',
    disableDeviceFallback: mode !== 'device-passcode',
  };
}
