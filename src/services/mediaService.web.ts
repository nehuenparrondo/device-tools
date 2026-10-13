// src/services/mediaService.web.ts — Evita cargar módulos de galería nativos en navegador.
import type { PhotoData } from '@/types/database';
function unavailable(): never {
  throw new Error('Galería: no disponible en esta plataforma.');
}
export async function persistPhoto(_photo: PhotoData): Promise<PhotoData> {
  return unavailable();
}
export function removePrivatePhoto(_uri: string): void {
  unavailable();
}
export async function saveToGallery(_uri: string): Promise<void> {
  unavailable();
}
export async function pickPhoto(): Promise<PhotoData | null> {
  return unavailable();
}
