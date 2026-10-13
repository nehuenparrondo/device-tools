// src/hooks/useCamera.ts — Captura y persistencia desacopladas del visor.
import type { CameraView } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { capturePhoto } from '@/services/cameraService';
import { databaseService } from '@/services/databaseService';
import { persistPhoto, removePrivatePhoto, saveToGallery } from '@/services/mediaService';
import { successFeedback } from '@/services/feedbackService';
import { openSettings } from '@/services/linkService';
import type { PhotoData } from '@/types/database';
import { parseTags, validateMetadata } from '@/utils/validators';
import { useAsyncAction } from './useAsyncAction';
import { useActiveScreen } from './useActiveScreen';
export function useCamera() {
  const active = useActiveScreen();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [flash, setFlash] = useState(false);
  const [torch, setTorch] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
  }, [active]);
  const [photo, setPhoto] = useState<PhotoData | null>(null);
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const action = useAsyncAction();
  const database = useDatabase();
  function capture() {
    void action.run(async () => {
      if (!ready || !cameraRef.current) throw new Error('Esperá a que la cámara esté lista.');
      setPhoto(await capturePhoto(cameraRef.current, facing));
      setSaved(false);
      await successFeedback();
    });
  }
  function save() {
    void action.run(async () => {
      if (!photo || saved) return;
      if (!database.ready)
        throw new Error(database.error ?? 'La base de datos todavía se está preparando.');
      const metadata = { note, tags: parseTags(tags) };
      validateMetadata(metadata);
      const permanent = await persistPhoto(photo);
      try {
        await databaseService.save({ kind: 'photo', data: permanent, ...metadata });
      } catch (error) {
        removePrivatePhoto(permanent.uri);
        throw error;
      }
      setPhoto(permanent);
      setSaved(true);
      await successFeedback();
      return 'Foto guardada en el historial.';
    });
  }
  function gallery() {
    void action.run(async () => {
      if (!photo) return;
      await saveToGallery(photo.uri);
      return 'Foto guardada en la galería.';
    });
  }
  function reset() {
    setPhoto(null);
    setSaved(false);
    setReady(false);
    setNote('');
    setTags('');
  }
  function flip() {
    setReady(false);
    setTorch(false);
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }
  return {
    cameraRef,
    facing,
    flash,
    torch,
    ready,
    setReady,
    photo,
    saved,
    note,
    setNote,
    tags,
    setTags,
    toggleFlash: () => setFlash((current) => !current),
    toggleTorch: () => setTorch((current) => !current),
    capture,
    settings: () => void action.run(openSettings),
    save,
    gallery,
    reset,
    flip,
    ...action,
  };
}
