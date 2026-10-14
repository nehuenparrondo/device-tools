// src/services/cameraService.ts — Captura solo después de recibir la señal de cámara lista.
import type { PhotoData } from '@/types/database';
import { withTimeout } from '../utils/withTimeout.ts';
export interface CameraCaptureDevice {
  takePictureAsync(options: { quality: number; exif: boolean }): Promise<
    | {
        uri: string;
        width: number;
        height: number;
      }
    | undefined
  >;
}
export async function capturePhoto(
  camera: CameraCaptureDevice,
  facing: 'front' | 'back',
): Promise<PhotoData> {
  const picture = await withTimeout(
    camera.takePictureAsync({ quality: 0.85, exif: false }),
    15000,
    'La captura tardó demasiado. Reiniciá la cámara y probá nuevamente.',
  );
  if (
    !picture?.uri ||
    !picture.uri.startsWith('file://') ||
    ![picture.width, picture.height].every((size) => Number.isInteger(size) && size > 0)
  )
    throw new Error('La cámara no devolvió una foto válida. Intentá nuevamente.');
  return { uri: picture.uri, width: picture.width, height: picture.height, facing };
}
