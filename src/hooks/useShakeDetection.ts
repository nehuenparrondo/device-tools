// src/hooks/useShakeDetection.ts — Detecta sacudidas con umbral y período de enfriamiento.
import { useEffect, useRef, useState } from 'react';
import { SHAKE_COOLDOWN, SHAKE_THRESHOLD } from '@/constants/app';
import { movementMagnitude } from '@/services/sensorService';
import { shakeFeedback } from '@/services/feedbackService';
import type { SensorData } from '@/types/components';
export function useShakeDetection(data: SensorData | null, enabled: boolean) {
  const lastShake = useRef(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (
      enabled &&
      data &&
      movementMagnitude(data) > SHAKE_THRESHOLD &&
      Date.now() - lastShake.current > SHAKE_COOLDOWN
    ) {
      lastShake.current = Date.now();
      setCount((current) => current + 1);
      shakeFeedback();
    }
  }, [data, enabled]);
  return count;
}
