// tests/camera.test.ts — Regresiones de cambio de cámara, montajes y captura sin hardware simulado como real.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cameraSessionReducer, createCameraSession } from '../src/services/cameraSession.ts';
import { capturePhoto, type CameraCaptureDevice } from '../src/services/cameraService.ts';

test('el cambio frontal/trasera crea un montaje nuevo y recupera la captura al estar listo', () => {
  let state = createCameraSession(true);
  for (let attempt = 0; attempt < 20; attempt++) {
    state = cameraSessionReducer(state, { type: 'ready', id: state.id });
    assert.equal(state.ready, true);
    const previous = state;
    state = cameraSessionReducer(state, { type: 'flip' });
    assert.equal(state.id, previous.id + 1);
    assert.notEqual(state.facing, previous.facing);
    assert.equal(state.ready, false);
  }
  state = cameraSessionReducer(state, { type: 'ready', id: state.id });
  assert.equal(state.ready, true);
  assert.equal(state.facing, 'back');
});

test('ignora onCameraReady y errores tardíos de la cámara anterior', () => {
  const original = cameraSessionReducer(createCameraSession(true), { type: 'ready', id: 0 });
  const flipped = cameraSessionReducer(original, { type: 'flip' });
  assert.equal(cameraSessionReducer(flipped, { type: 'ready', id: original.id }), flipped);
  assert.equal(
    cameraSessionReducer(flipped, { type: 'error', id: original.id, message: 'viejo' }),
    flipped,
  );
  assert.equal(cameraSessionReducer(flipped, { type: 'flip' }), flipped);
});

test('pausa, vuelve a primer plano y exige un evento nuevo de cámara lista', () => {
  let state = cameraSessionReducer(createCameraSession(true), { type: 'ready', id: 0 });
  const previousId = state.id;
  state = cameraSessionReducer(state, { type: 'activity', active: false });
  assert.equal(state.ready, false);
  assert.equal(cameraSessionReducer(state, { type: 'ready', id: state.id }), state);
  assert.equal(cameraSessionReducer(state, { type: 'flip' }), state);
  state = cameraSessionReducer(state, { type: 'activity', active: true });
  assert.notEqual(state.id, previousId);
  assert.equal(state.ready, false);
  state = cameraSessionReducer(state, { type: 'ready', id: state.id });
  assert.equal(state.ready, true);
});

test('reintentar o tomar otra foto invalida el montaje y elimina el error anterior', () => {
  const failed = cameraSessionReducer(createCameraSession(true), {
    type: 'error',
    id: 0,
    message: 'falló',
  });
  assert.equal(cameraSessionReducer(failed, { type: 'ready', id: 0 }).ready, false);
  const retried = cameraSessionReducer(failed, { type: 'restart' });
  assert.equal(retried.id, 1);
  assert.equal(retried.error, null);
  assert.equal(cameraSessionReducer(retried, { type: 'ready', id: 1 }).ready, true);
});

test('notificar la misma actividad no desmonta una cámara lista', () => {
  const ready = cameraSessionReducer(createCameraSession(true), { type: 'ready', id: 0 });
  assert.equal(cameraSessionReducer(ready, { type: 'activity', active: true }), ready);
});

test('captura solicita fotografía sin EXIF y conserva la cámara elegida', async () => {
  const camera: CameraCaptureDevice = {
    takePictureAsync: async (options) => {
      assert.deepEqual(options, { quality: 0.85, exif: false });
      return { uri: 'file:///cache/selfie.jpg', width: 1200, height: 1600 };
    },
  };
  assert.deepEqual(await capturePhoto(camera, 'front'), {
    uri: 'file:///cache/selfie.jpg',
    width: 1200,
    height: 1600,
    facing: 'front',
  });
});

test('rechaza fotos vacías, remotas o con dimensiones inválidas y conserva errores nativos', async () => {
  for (const picture of [
    undefined,
    { uri: '', width: 10, height: 10 },
    { uri: 'https://example.com/photo.jpg', width: 10, height: 10 },
    { uri: 'file:///photo.jpg', width: 0, height: 10 },
    { uri: 'file:///photo.jpg', width: 10, height: Number.NaN },
  ])
    await assert.rejects(
      capturePhoto({ takePictureAsync: async () => picture }, 'back'),
      /foto válida/,
    );
  await assert.rejects(
    capturePhoto(
      {
        takePictureAsync: async () => {
          throw new Error('Error nativo');
        },
      },
      'back',
    ),
    /Error nativo/,
  );
});
