// src/hooks/useAsyncAction.ts — Centraliza progreso, errores y feedback de acciones.
import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '@/utils/formatters';
export function useAsyncAction() {
  const running = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const isRunning = useCallback(() => running.current, []);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const run = useCallback(async (action: () => Promise<string | void>) => {
    if (running.current || !mounted.current) return;
    running.current = true;
    setBusy(true);
    setMessage(null);
    setFailed(false);
    try {
      const result = await action();
      if (result && mounted.current) setMessage(result);
    } catch (error) {
      if (mounted.current) {
        setMessage(getErrorMessage(error));
        setFailed(true);
      }
    } finally {
      running.current = false;
      if (mounted.current) setBusy(false);
    }
  }, []);
  return { busy, message, failed, run, isRunning };
}
