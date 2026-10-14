// tests/biometrics.test.ts — Prueba decisiones de autenticación sin fingir una validación biométrica real.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  resolveBiometricCapability,
  getAuthenticationOptions,
} from '../src/services/biometricPolicy.ts';
const faceId = {
  platform: 'ios',
  expoGo: false,
  hardware: true,
  enrolled: true,
  supported: [2],
  securityLevel: 3,
};

test('Face ID en una compilación propia mantiene la autenticación biométrica', () => {
  const capability = resolveBiometricCapability(faceId);
  assert.equal(capability.mode, 'biometric');
  assert.equal(capability.available, true);
  assert.equal(capability.canBypass, false);
  assert.equal(getAuthenticationOptions(capability.mode).disableDeviceFallback, true);
});
test('Expo Go con Face ID ofrece código del sistema, no promete Face ID ni acceso libre', () => {
  const capability = resolveBiometricCapability({ ...faceId, expoGo: true });
  assert.equal(capability.mode, 'device-passcode');
  assert.equal(capability.available, true);
  assert.equal(capability.canBypass, false);
  assert.match(capability.notice, /Expo Go no permite Face ID/);
  assert.match(capability.actionLabel, /código del iPhone/);
  assert.deepEqual(getAuthenticationOptions(capability.mode), {
    promptMessage: 'Verificar con el código del iPhone',
    cancelLabel: 'Cancelar',
    fallbackLabel: 'Usar código',
    disableDeviceFallback: false,
  });
});
test('Expo Go sin código configurado no desbloquea un dispositivo con Face ID', () => {
  const capability = resolveBiometricCapability({ ...faceId, expoGo: true, securityLevel: 0 });
  assert.equal(capability.mode, 'unavailable');
  assert.equal(capability.canBypass, false);
  assert.throws(() => getAuthenticationOptions(capability.mode), /no hay autenticación/i);
});
test('la limitación de Face ID no deshabilita Touch ID en Expo Go', () => {
  assert.equal(
    resolveBiometricCapability({ ...faceId, expoGo: true, supported: [1] }).mode,
    'biometric',
  );
});
test('Android no usa una clave SIM como sustituto de biometría registrada', () => {
  const capability = resolveBiometricCapability({
    ...faceId,
    platform: 'android',
    expoGo: true,
    enrolled: false,
    securityLevel: 1,
  });
  assert.equal(capability.mode, 'unavailable');
  assert.equal(capability.canBypass, true);
});
test('el acceso manual solo se ofrece si realmente falta hardware o inscripción', () => {
  for (const input of [
    { ...faceId, hardware: false },
    { ...faceId, enrolled: false },
  ]) {
    const capability = resolveBiometricCapability(input);
    assert.equal(capability.available, false);
    assert.equal(capability.canBypass, true);
  }
  assert.equal(resolveBiometricCapability({ ...faceId, platform: 'web' }).canBypass, false);
});
