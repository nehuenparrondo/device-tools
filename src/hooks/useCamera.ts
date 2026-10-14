// src/hooks/useCamera.ts — Captura y persistencia desacopladas del visor.
import type { CameraView } from 'expo-camera';
import { useEffect, useReducer, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useDatabase } from '@/context/DatabaseContext';
import { capturePhoto } from '@/services/cameraService';
import { cameraSessionReducer, createCameraSession } from '@/services/cameraSession';
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
  const [session, dispatch] = useReducer(cameraSessionReducer, active, createCameraSession);
  const operation = useRef(0);
  const [flash, setFlash] = useState(false);
  const [torch, setTorch] = useState(false);
  useEffect(() => {
    const reference = operation;
    operation.current++;
    dispatch({ type: 'activity', active });
    if (!active) setTorch(false);
    return () => {
      reference.current++;
    };
  }, [active]);
  const [photo, setPhoto] = useState<PhotoData | null>(null);
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const action = useAsyncAction();
  const database = useDatabase();
  useEffect(() => {
    if (!active || !session.active || session.ready || session.error || photo) return;
    const timeout = setTimeout(
      () =>
        dispatch({
          type: 'error',
          id: session.id,
          message: 'La cámara tardó demasiado en iniciar. Volvé a intentarlo.',
        }),
      15000,
    );
    return () => clearTimeout(timeout);
  }, [active, session.active, session.ready, session.error, session.id, photo]);
  function capture() {
    void action.run(async () => {
      if (!active || !session.ready || !cameraRef.current)
        throw new Error('Esperá a que la cámara esté lista.');
      const request = operation.current;
      let captured: PhotoData;
      try {
        captured = await capturePhoto(cameraRef.current, session.facing);
      } catch (error) {
        if (request === operation.current)
          dispatch({
            type: 'error',
            id: session.id,
            message: error instanceof Error ? error.message : 'No se pudo capturar la foto.',
          });
        throw error;
      }
      if (request !== operation.current || AppState.currentState !== 'active') return;
      setPhoto(captured);
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
    if (action.isRunning()) return;
    operation.current++;
    setPhoto(null);
    setSaved(false);
    dispatch({ type: 'restart' });
    setNote('');
    setTags('');
  }
  function flip() {
    if (action.isRunning() || !session.ready) return;
    operation.current++;
    setTorch(false);
    setFlash(false);
    dispatch({ type: 'flip' });
  }
  function retry() {
    if (action.isRunning()) return;
    operation.current++;
    dispatch({ type: 'restart' });
  }
  return {
    cameraRef,
    facing: session.facing,
    flash,
    torch,
    ready: active && session.ready,
    sessionId: session.id,
    mountError: session.error,
    onReady: () => dispatch({ type: 'ready', id: session.id }),
    onMountError: (message: string) => dispatch({ type: 'error', id: session.id, message }),
    retry,
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
