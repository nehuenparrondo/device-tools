// src/hooks/useLiveSensor.ts — Ciclo de vida compartido con permiso y suscripción propia.
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import type { Removable } from '@/types/components';
import { getErrorMessage } from '@/utils/formatters';
import { useActiveScreen } from './useActiveScreen';
export type SensorStatus = 'stopped' | 'loading' | 'live' | 'unavailable' | 'denied' | 'error';
interface SensorApi<Measurement> {
  isAvailableAsync(): Promise<boolean>;
  getPermissionsAsync(): Promise<{ granted: boolean; canAskAgain: boolean }>;
  requestPermissionsAsync(): Promise<{ granted: boolean }>;
  setUpdateInterval(interval: number): void;
  addListener(callback: (data: Measurement) => void): Removable;
}
export function useLiveSensor<Measurement>(
  sensor: SensorApi<Measurement>,
  enabled: boolean,
  interval: number,
) {
  const active = useActiveScreen();
  const [data, setData] = useState<Measurement | null>(null);
  const [status, setStatus] = useState<SensorStatus>('stopped');
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let canceled = false;
    let subscription: Removable | null = null;
    setError(null);
    if (!enabled || !active) {
      setStatus('stopped');
      return;
    }
    if (Platform.OS === 'web') {
      setStatus('unavailable');
      return;
    }
    setStatus('loading');
    (async () => {
      if (!(await sensor.isAvailableAsync())) {
        if (!canceled) setStatus('unavailable');
        return;
      }
      const current = await sensor.getPermissionsAsync();
      if (canceled) return;
      const permission =
        current.granted || !current.canAskAgain ? current : await sensor.requestPermissionsAsync();
      if (canceled) return;
      if (!permission.granted) {
        setStatus('denied');
        return;
      }
      sensor.setUpdateInterval(interval);
      subscription = sensor.addListener((measurement) => {
        if (!canceled) setData(measurement);
      });
      setStatus('live');
    })().catch((failure: unknown) => {
      if (!canceled) {
        setStatus('error');
        setError(getErrorMessage(failure));
      }
    });
    return () => {
      canceled = true;
      subscription?.remove();
    };
  }, [sensor, enabled, interval, active]);
  return { data, status, error };
}
