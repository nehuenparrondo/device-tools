// tests/validators.test.ts — Casos límite de validación y enlaces externos.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  getSafeUrl,
  parseTags,
  validateCoordinates,
  validateMetadata,
  validateRecord,
} from '../src/utils/validators.ts';
test('acepta coordenadas límite y rechaza valores fuera de rango o no finitos', () => {
  validateCoordinates(-90, 180);
  validateCoordinates(90, -180);
  for (const latitude of [91, -91, NaN, Infinity])
    assert.throws(() => validateCoordinates(latitude, 0));
  for (const longitude of [181, -181, NaN, Infinity])
    assert.throws(() => validateCoordinates(0, longitude));
});
test('solo abre HTTP y HTTPS, sin credenciales embebidas', () => {
  assert.equal(getSafeUrl('https://example.com'), 'https://example.com/');
  for (const url of [
    'javascript:alert(1)',
    'file:///tmp/private',
    'intent://example',
    'https://user:pass@example.com',
    'hola',
  ])
    assert.equal(getSafeUrl(url), null);
});
test('normaliza y deduplica etiquetas, y respeta límites de metadatos', () => {
  assert.deepEqual(parseTags(' Clase,clase, prueba, , GPS '), ['clase', 'prueba', 'gps']);
  validateMetadata({ note: 'a'.repeat(200), tags: ['clase'] });
  assert.throws(() => validateMetadata({ note: 'a'.repeat(201), tags: [] }));
  assert.throws(() =>
    validateMetadata({ note: '', tags: Array.from({ length: 6 }, (_, index) => 'tag' + index) }),
  );
  assert.throws(() => validateMetadata({ note: '', tags: [''] }));
});
test('rechaza códigos vacíos y fotos con URI temporal o dimensiones inválidas', () => {
  assert.throws(() =>
    validateRecord({
      kind: 'scan',
      data: { barcodeType: 'qr', content: '   ' },
      note: '',
      tags: [],
    }),
  );
  assert.throws(() =>
    validateRecord({
      kind: 'scan',
      data: { barcodeType: 'qr', content: 'a'.repeat(8193) },
      note: '',
      tags: [],
    }),
  );
  assert.throws(() =>
    validateRecord({
      kind: 'photo',
      data: { uri: 'https://example.com/photo.jpg', width: 100, height: 100, facing: 'back' },
      note: '',
      tags: [],
    }),
  );
  assert.throws(() =>
    validateRecord({
      kind: 'photo',
      data: { uri: 'file:///photo.jpg', width: -1, height: 100, facing: 'back' },
      note: '',
      tags: [],
    }),
  );
  validateRecord({
    kind: 'photo',
    data: { uri: 'file:///photo.jpg', width: 100, height: 100, facing: 'back' },
    note: '',
    tags: [],
  });
});
test('valida medidas GPS opcionales y conserva datos desconocidos como null', () => {
  const data = {
    latitude: 0,
    longitude: 0,
    accuracy: null,
    altitude: null,
    speed: null,
    heading: null,
    address: null,
  };
  validateRecord({ kind: 'location', data, note: '', tags: [] });
  for (const invalid of [
    { accuracy: -1 },
    { speed: -1 },
    { altitude: Infinity },
    { heading: 361 },
  ]) {
    assert.throws(() =>
      validateRecord({ kind: 'location', data: { ...data, ...invalid }, note: '', tags: [] }),
    );
  }
});
