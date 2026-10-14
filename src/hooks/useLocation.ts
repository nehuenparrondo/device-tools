// src/hooks/useLocation.ts — Cancela sesiones GPS antiguas y limpia seguimiento al perder foco.
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useDatabase } from '@/context/DatabaseContext';
import { databaseService } from '@/services/databaseService';
import {
  getAddress,
  getCurrentPosition,
  normalizeLocation,
  requireLocationPermission,
  watchPosition,
} from '@/services/locationService';
import { openMap } from '@/services/linkService';
import type { LocationData } from '@/types/database';
import { parseTags } from '@/utils/validators';
import { useActiveScreen } from './useActiveScreen';
import { useAsyncAction } from './useAsyncAction';
export function useLocation() {
  const active = useActiveScreen(true);
  const subscription = useRef<Location.LocationSubscription | null>(null);
  const session = useRef(0);
  const [position, setPosition] = useState<LocationData | null>(null);
  const [tracking, setTracking] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const action = useAsyncAction();
  const database = useDatabase();
  function stop() {
    session.current++;
    subscription.current?.remove();
    subscription.current = null;
    setTracking(false);
  }
  useEffect(() => {
    const sessionReference = session;
    if (!active) {
      session.current++;
      subscription.current?.remove();
      subscription.current = null;
      setTracking(false);
    }
    return () => {
      sessionReference.current++;
      subscription.current?.remove();
      subscription.current = null;
    };
  }, [active]);
  function current() {
    void action.run(async () => {
      if (Platform.OS === 'web') throw new Error('No disponible en esta plataforma.');
      stop();
      const requestSession = session.current;
      setGpsError(null);
      await requireLocationPermission();
      if (requestSession !== session.current) return;
      const data = normalizeLocation(await getCurrentPosition());
      if (requestSession !== session.current) return;
      setPosition(data);
      const address = await getAddress(data);
      if (requestSession === session.current) setPosition({ ...data, address });
      return address
        ? 'Ubicación actualizada.'
        : 'Ubicación obtenida. Dirección no disponible; podés guardar las coordenadas.';
    });
  }
  function start() {
    void action.run(async () => {
      if (Platform.OS === 'web') throw new Error('No disponible en esta plataforma.');
      stop();
      const requestSession = session.current;
      setGpsError(null);
      await requireLocationPermission();
      if (requestSession !== session.current) return;
      const watcher = await watchPosition(
        (data) => {
          if (requestSession === session.current) setPosition(data);
        },
        (message) => {
          if (requestSession === session.current) {
            setGpsError(message);
            stop();
          }
        },
      );
      if (requestSession !== session.current) watcher.remove();
      else {
        subscription.current = watcher;
        setTracking(true);
      }
    });
  }
  function address() {
    void action.run(async () => {
      if (!position) return;
      const original = position;
      const result = await getAddress(original);
      setPosition((latest) =>
        latest?.latitude === original.latitude && latest.longitude === original.longitude
          ? { ...latest, address: result }
          : latest,
      );
      return result
        ? 'Dirección actualizada.'
        : 'Dirección no disponible. Revisá la conexión a Internet.';
    });
  }
  function save() {
    void action.run(async () => {
      if (!position) return;
      if (!database.ready)
        throw new Error(database.error ?? 'La base de datos todavía se está preparando.');
      await databaseService.save({ kind: 'location', data: position, note, tags: parseTags(tags) });
      return 'Punto guardado en el historial.';
    });
  }
  function map() {
    void action.run(async () => {
      if (position) await openMap(position.latitude, position.longitude);
    });
  }
  return {
    position,
    tracking,
    gpsError,
    current,
    start,
    stop,
    address,
    save,
    map,
    note,
    setNote,
    tags,
    setTags,
    ...action,
  };
}
