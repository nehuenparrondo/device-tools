// src/hooks/useHistory.ts — Solo lee datos tras autorización y bloquea al perder foco.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useDatabase } from '@/context/DatabaseContext';
import { databaseService } from '@/services/databaseService';
import { removePrivatePhoto } from '@/services/mediaService';
import { confirmAction } from '@/services/linkService';
import type { HistoryRecord, RecordKind } from '@/types/database';
import { getErrorMessage } from '@/utils/formatters';
import { useActiveScreen } from './useActiveScreen';
import { useAsyncAction } from './useAsyncAction';
import { useBiometrics } from './useBiometrics';
export function useHistory() {
  const biometrics = useBiometrics();
  const active = useActiveScreen(true);
  const database = useDatabase();
  const [unlocked, setUnlocked] = useState(false);
  const [filter, setFilter] = useState<RecordKind | undefined>();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const generation = useRef(0);
  const action = useAsyncAction();
  useEffect(() => {
    const sessionReference = generation;
    if (!active) {
      setUnlocked(false);
      setRecords([]);
    }
    return () => {
      sessionReference.current++;
    };
  }, [active]);
  useEffect(() => {
    const sessionReference = generation;
    const current = ++generation.current;
    if (!unlocked || !active || !database.ready || Platform.OS === 'web') return;
    setLoading(true);
    setError(null);
    setRecords([]);
    databaseService
      .list(filter)
      .then((items) => {
        if (current === generation.current) setRecords(items);
      })
      .catch((failure: unknown) => {
        if (current === generation.current) setError(getErrorMessage(failure));
      })
      .finally(() => {
        if (current === generation.current) setLoading(false);
      });
    return () => {
      sessionReference.current++;
    };
  }, [unlocked, active, database.ready, filter, revision]);
  const refresh = useCallback(() => setRevision((current) => current + 1), []);
  function unlock() {
    void action.run(async () => {
      await biometrics.verify();
      setUnlocked(true);
    });
  }
  function bypass() {
    if (active && biometrics.capability && !biometrics.capability.available) setUnlocked(true);
  }
  function remove(record: HistoryRecord) {
    void action.run(async () => {
      const current = generation.current;
      const confirmed = await confirmAction(
        'Eliminar registro',
        'Se eliminará del historial y, si es una foto, del almacenamiento privado de la app. Una copia en galería se conserva.',
      );
      if (!confirmed || !unlocked || !active || current !== generation.current) return;
      await databaseService.remove(record.id);
      let warning = false;
      if (record.kind === 'photo') {
        try {
          removePrivatePhoto(record.data.uri);
        } catch {
          warning = true;
        }
      }
      refresh();
      return warning
        ? 'Registro eliminado. No se pudo borrar su archivo privado.'
        : 'Registro eliminado.';
    });
  }
  return {
    biometrics,
    unlocked: unlocked && active,
    filter,
    setFilter,
    records: unlocked && active ? records : [],
    loading,
    error,
    refresh,
    unlock,
    bypass,
    remove,
    database,
    ...action,
  };
}
