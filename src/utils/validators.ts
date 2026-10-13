// src/utils/validators.ts — Valida entradas antes de cualquier escritura SQL.
import type { RecordInput, RecordMetadata } from '../types/database.ts';

export function validateMetadata(metadata: RecordMetadata): void {
  if (metadata.note.trim().length > 200) throw new Error('La nota admite hasta 200 caracteres.');
  if (metadata.tags.length > 5) throw new Error('Podés agregar hasta 5 etiquetas.');
  if (metadata.tags.some((tag) => !tag.trim() || tag.trim().length > 24))
    throw new Error('Cada etiqueta debe tener entre 1 y 24 caracteres.');
}
export function parseTags(value: string): string[] {
  return [
    ...new Set(
      value
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}
export function validateCoordinates(latitude: number, longitude: number): void {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)
    throw new Error('La latitud debe estar entre -90 y 90.');
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)
    throw new Error('La longitud debe estar entre -180 y 180.');
}
export function validateRecord(input: RecordInput): void {
  validateMetadata(input);
  if (input.kind === 'scan') {
    if (!input.data.content.trim() || input.data.content.length > 8192)
      throw new Error('El código debe tener contenido y hasta 8192 caracteres.');
    if (!input.data.barcodeType.trim() || input.data.barcodeType.length > 40)
      throw new Error('El tipo de código no es válido.');
  } else if (input.kind === 'photo') {
    if (!input.data.uri.startsWith('file://'))
      throw new Error('La foto debe ser un archivo local.');
    if (![input.data.width, input.data.height].every((size) => Number.isInteger(size) && size > 0))
      throw new Error('Las dimensiones de la foto no son válidas.');
  } else {
    validateCoordinates(input.data.latitude, input.data.longitude);
    const { accuracy, altitude, speed, heading } = input.data;
    if (
      [accuracy, altitude, speed, heading].some(
        (value) => value !== null && !Number.isFinite(value),
      )
    )
      throw new Error('Los datos del GPS deben ser finitos.');
    if (accuracy !== null && accuracy < 0) throw new Error('La precisión no puede ser negativa.');
    if (speed !== null && speed < 0) throw new Error('La velocidad no puede ser negativa.');
    if (heading !== null && (heading < 0 || heading > 360))
      throw new Error('La dirección debe estar entre 0 y 360.');
    if (input.data.address !== null && input.data.address.length > 500)
      throw new Error('La dirección es demasiado larga.');
  }
}
export function getSafeUrl(content: string): string | null {
  try {
    const url = new URL(content.trim());
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
