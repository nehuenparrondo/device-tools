// src/services/cameraService.ts — Captura solo después de recibir la señal de cámara lista.
import type { CameraView } from 'expo-camera';
import type { PhotoData } from '@/types/database';
export async function capturePhoto(
  camera: CameraView,
  facing: 'front' | 'back',
): Promise<PhotoData> {
  const picture = await camera.takePictureAsync({ quality: 0.85, exif: false });
  if (!picture?.uri) throw new Error('No se pudo capturar la foto. Intentá nuevamente.');
  return { uri: picture.uri, width: picture.width, height: picture.height, facing };
}
