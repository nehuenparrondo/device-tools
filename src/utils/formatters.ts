// src/utils/formatters.ts — Formatea valores sin perder estados desconocidos.
export function formatNumber(value: number | null | undefined, unit = '', decimals = 2): string {
  return value === null || value === undefined || !Number.isFinite(value)
    ? 'No disponible'
    : `${value.toFixed(decimals)}${unit ? ' ' + unit : ''}`;
}
export function formatDate(value: string): string {
  return new Date(value).toLocaleString('es-AR');
}
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error. Intentá nuevamente.';
}
export function getCompassHeading(x: number, y: number): number {
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}
