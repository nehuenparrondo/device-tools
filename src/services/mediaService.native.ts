// src/services/mediaService.native.ts — Conserva fotos y utiliza la API moderna de galería nativa.
import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Asset, requestPermissionsAsync } from 'expo-media-library';
import { Platform } from 'react-native';
import type { PhotoData } from '@/types/database';
export async function persistPhoto(photo: PhotoData): Promise<PhotoData> {
  if (Platform.OS === 'web') throw new Error('No disponible en esta plataforma.');
  const directory = new Directory(Paths.document, 'photos');
  directory.create({ intermediates: true, idempotent: true });
  const destination = new File(
    directory,
    `${Date.now()}-${Math.random().toString(36).slice(2)}${photo.uri.match(/\.(jpg|jpeg|png|heic|heif|webp|avif|gif|bmp)$/i)?.[0]?.toLowerCase() ?? '.jpg'}`,
  );
  new File(photo.uri).copy(destination);
  return { ...photo, uri: destination.uri };
}
export function removePrivatePhoto(uri: string): void {
  const directory = new Directory(Paths.document, 'photos');
  if (!uri.startsWith(directory.uri.replace(/\/+$/, '') + '/')) return;
  const file = new File(uri);
  if (file.exists) file.delete();
}
export async function saveToGallery(uri: string): Promise<void> {
  if (Platform.OS === 'web') throw new Error('No disponible en esta plataforma.');
  const permission = await requestPermissionsAsync(true, ['photo']);
  if (!permission.granted)
    throw new Error('Permiso de galería denegado. Habilitalo en Configuración.');
  await Asset.create(uri);
}
export async function pickPhoto(): Promise<PhotoData | null> {
  if (Platform.OS === 'web') throw new Error('No disponible en esta plataforma.');
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted)
    throw new Error('Permiso de galería denegado. Habilitalo en Configuración.');
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.85,
    exif: false,
  });
  const asset = result.assets?.[0];
  return result.canceled || !asset
    ? null
    : { uri: asset.uri, width: asset.width, height: asset.height, facing: 'gallery' };
}
