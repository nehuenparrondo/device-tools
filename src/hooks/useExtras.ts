// src/hooks/useExtras.ts — Gestiona batería, red, brillo restaurable y acciones adicionales.
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useDatabase } from '@/context/DatabaseContext';
import { databaseService } from '@/services/databaseService';
import {
  Battery,
  Brightness,
  Network,
  copyText,
  readBrightness,
  readClipboard,
  readDeviceSnapshot,
  setAppBrightness,
  speak,
  stopSpeech,
  type DeviceSnapshot,
} from '@/services/extrasService';
import { tapFeedback } from '@/services/feedbackService';
import { pickPhoto, persistPhoto, removePrivatePhoto } from '@/services/mediaService';
import type { Removable } from '@/types/components';
import { useActiveScreen } from './useActiveScreen';
import { useAsyncAction } from './useAsyncAction';
export function useExtras() {
  const active = useActiveScreen();
  const [snapshot, setSnapshot] = useState<DeviceSnapshot | null>(null);
  const [text, setText] = useState('Hola, esta es una prueba de Device Tools.');
  const [brightness, setBrightness] = useState<number | null>(null);
  const originalBrightness = useRef<number | null>(null);
  const originalSystemBrightness = useRef<boolean | null>(null);
  const lifecycle = useRef(0);
  const [revision, setRevision] = useState(0);
  const action = useAsyncAction();
  const database = useDatabase();
  useEffect(() => {
    let canceled = false;
    const subscriptions: Removable[] = [];
    if (!active) return;
    readDeviceSnapshot().then((data) => {
      if (!canceled) setSnapshot(data);
    });
    if (Platform.OS !== 'web') {
      try {
        subscriptions.push(
          Battery.addBatteryLevelListener((event) =>
            setSnapshot((current) =>
              current
                ? { ...current, battery: event.batteryLevel >= 0 ? event.batteryLevel : null }
                : current,
            ),
          ),
        );
        subscriptions.push(
          Battery.addBatteryStateListener(() => {
            void readDeviceSnapshot().then((data) => {
              if (!canceled) setSnapshot(data);
            });
          }),
        );
        subscriptions.push(
          Network.addNetworkStateListener((event) =>
            setSnapshot((current) =>
              current
                ? {
                    ...current,
                    network: event.type ?? 'Desconocida',
                    connected: event.isConnected ?? null,
                    internet: event.isInternetReachable ?? null,
                  }
                : current,
            ),
          ),
        );
      } catch {
        /* La consulta inicial sigue disponible si el dispositivo no emite eventos. */
      }
    }
    return () => {
      canceled = true;
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, [active, revision]);
  useEffect(() => {
    const sessionReference = lifecycle;
    lifecycle.current++;
    if (!active) return;
    return () => {
      sessionReference.current++;
      void stopSpeech().catch(() => undefined);
      const original = originalBrightness.current;
      originalBrightness.current = null;
      if (original !== null) {
        const restore =
          Platform.OS === 'android' && originalSystemBrightness.current
            ? Brightness.restoreSystemBrightnessAsync()
            : Brightness.setBrightnessAsync(original);
        void restore.catch(() => undefined);
      }
      originalSystemBrightness.current = null;
    };
  }, [active]);
  function changeBrightness(value: number) {
    void action.run(async () => {
      const session = lifecycle.current;
      if (originalBrightness.current === null) {
        const original = await readBrightness();
        if (session !== lifecycle.current) return;
        originalBrightness.current = original;
        if (Platform.OS === 'android')
          originalSystemBrightness.current = await Brightness.isUsingSystemBrightnessAsync();
      }
      if (session !== lifecycle.current) return;
      await setAppBrightness(value);
      setBrightness(value);
      return 'Brillo de la app actualizado. Se restaura al salir.';
    });
  }
  function getBrightness() {
    void action.run(async () => {
      setBrightness(await readBrightness());
    });
  }
  function gallery() {
    void action.run(async () => {
      if (!database.ready)
        throw new Error(database.error ?? 'La base de datos todavía se está preparando.');
      const selected = await pickPhoto();
      if (!selected) return 'Selección cancelada.';
      const permanent = await persistPhoto(selected);
      try {
        await databaseService.save({
          kind: 'photo',
          data: permanent,
          note: 'Importada desde galería',
          tags: ['galería'],
        });
      } catch (error) {
        removePrivatePhoto(permanent.uri);
        throw error;
      }
      return 'Imagen guardada en el historial.';
    });
  }
  return {
    snapshot,
    text,
    setText,
    brightness,
    changeBrightness,
    getBrightness,
    gallery,
    refresh: () => setRevision((current) => current + 1),
    haptic: () =>
      void action.run(async () => {
        await tapFeedback();
        return 'Feedback háptico solicitado. Requiere dispositivo compatible.';
      }),
    speak: () =>
      void action.run(async () => {
        await speak(text);
        return 'Lectura finalizada.';
      }),
    stopSpeech: () => void stopSpeech().catch(() => undefined),
    copy: () =>
      void action.run(async () => {
        await copyText(text);
        return 'Texto copiado.';
      }),
    paste: () =>
      void action.run(async () => {
        setText((await readClipboard()).slice(0, 500));
        return 'Contenido del portapapeles leído.';
      }),
    ...action,
  };
}
