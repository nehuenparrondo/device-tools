// src/hooks/useCapabilities.ts — Actualiza el panel al volver desde otras pantallas o ajustes.
import { useEffect, useState } from 'react';
import { getToolAvailability } from '@/services/deviceService';
import type { Availability } from '@/types/components';
import { useActiveScreen } from './useActiveScreen';
export function useCapabilities() {
  const active = useActiveScreen();
  const [availability, setAvailability] = useState<Record<string, Availability>>({});
  useEffect(() => {
    let canceled = false;
    if (active)
      void getToolAvailability().then((result) => {
        if (!canceled) setAvailability(result);
      });
    return () => {
      canceled = true;
    };
  }, [active]);
  return availability;
}
