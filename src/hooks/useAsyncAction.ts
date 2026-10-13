// src/hooks/useAsyncAction.ts — Centraliza progreso, errores y feedback de acciones.
import { useCallback, useRef, useState } from 'react';
import { getErrorMessage } from '@/utils/formatters';
export function useAsyncAction() {
  const running = useRef(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const run = useCallback(async (action: () => Promise<string | void>) => {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setMessage(null);
    setFailed(false);
    try {
      const result = await action();
      if (result) setMessage(result);
    } catch (error) {
      setMessage(getErrorMessage(error));
      setFailed(true);
    } finally {
      running.current = false;
      setBusy(false);
    }
  }, []);
  return { busy, message, failed, run };
}
