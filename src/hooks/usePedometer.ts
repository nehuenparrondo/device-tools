// src/hooks/usePedometer.ts — Pasos de la sesión con permiso solicitado al activar.
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Pedometer } from '@/services/sensorService';
import type { Removable } from '@/types/components';
import { getErrorMessage } from '@/utils/formatters';
import { useActiveScreen } from './useActiveScreen';
import type { SensorStatus } from './useLiveSensor';
export function usePedometer(enabled: boolean) {
  const active = useActiveScreen();
  const [steps, setSteps] = useState(0);
  const [status, setStatus] = useState<SensorStatus>('stopped');
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let canceled = false;
    let subscription: Removable | null = null;
    setSteps(0);
    setError(null);
    if (!active || !enabled) {
      setStatus('stopped');
      return;
    }
    if (Platform.OS === 'web') {
      setStatus('unavailable');
      return;
    }
    setStatus('loading');
    (async () => {
      if (!(await Pedometer.isAvailableAsync())) {
        if (!canceled) setStatus('unavailable');
        return;
      }
      if (canceled) return;
      const permission = await Pedometer.requestPermissionsAsync();
      if (canceled) return;
      if (!permission.granted) {
        setStatus('denied');
        return;
      }
      subscription = Pedometer.watchStepCount((result) => {
        if (!canceled) setSteps(result.steps);
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
  }, [active, enabled]);
  return { steps, status, error };
}
