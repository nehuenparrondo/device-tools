// tests/lifecycle.test.ts — Los diálogos iOS no cancelan permisos; salir o bloquear sí detiene el hardware.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isScreenActive } from '../src/utils/lifecycle.ts';
test('un diálogo del sistema mantiene activas las solicitudes que lo permiten', () => {
  assert.equal(isScreenActive(true, 'inactive', true), true);
  assert.equal(isScreenActive(true, 'active', true), true);
});
test('la cámara se pausa en inactive cuando no está solicitando permisos', () => {
  assert.equal(isScreenActive(true, 'inactive', false), false);
  assert.equal(isScreenActive(true, 'active', false), true);
});
test('segundo plano, foco perdido o estado desconocido nunca autorizan sesiones', () => {
  for (const state of ['background', 'unknown', null])
    assert.equal(isScreenActive(true, state, true), false);
  assert.equal(isScreenActive(false, 'active', true), false);
  assert.equal(isScreenActive(false, 'inactive', true), false);
});
