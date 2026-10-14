// tests/timeouts.test.ts — Evita esperas indefinidas y comprueba errores tardíos controlados.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { withTimeout } from '../src/utils/withTimeout.ts';
test('devuelve el resultado cuando la operación termina antes del límite', async () => {
  assert.equal(await withTimeout(Promise.resolve(42), 1000, 'agotado'), 42);
});
test('conserva el error original del hardware', async () => {
  await assert.rejects(
    withTimeout(Promise.reject(new Error('hardware')), 1000, 'agotado'),
    /hardware/,
  );
});
test('una operación bloqueada produce un error recuperable', async () => {
  await assert.rejects(withTimeout(new Promise<never>(() => undefined), 5, 'agotado'), /agotado/);
});
test('una respuesta tardía no deja rechazos sin controlar', async () => {
  let rejectOperation: (reason: Error) => void = () => undefined;
  const pending = new Promise<never>((_resolve, reject) => {
    rejectOperation = reject;
  });
  await assert.rejects(withTimeout(pending, 5, 'agotado'), /agotado/);
  rejectOperation(new Error('respuesta tardía'));
  await new Promise<void>((resolve) => setImmediate(resolve));
});
