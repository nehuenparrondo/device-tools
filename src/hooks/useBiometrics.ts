// src/hooks/useBiometrics.ts — Comprueba soporte y evita aceptar respuestas de una pantalla inactiva.
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  authenticateIdentity,
  getBiometricCapability,
  type BiometricCapability,
} from '@/services/biometricService';
import { getErrorMessage } from '@/utils/formatters';
import { useActiveScreen } from './useActiveScreen';
import { useAsyncAction } from './useAsyncAction';
export function useBiometrics() {
  // iOS puede quedar inactivo durante el diálogo del sistema; segundo plano sí invalida la sesión.
  const active = useActiveScreen(true);
  const generation = useRef(0);
  const [capability, setCapability] = useState<BiometricCapability | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const action = useAsyncAction();
  useEffect(() => {
    const sessionReference = generation;
    const current = ++generation.current;
    if (!active) return;
    setLoading(true);
    setError(null);
    setCapability(null);
    getBiometricCapability()
      .then((result) => {
        if (generation.current === current) setCapability(result);
      })
      .catch((failure: unknown) => {
        if (generation.current === current) setError(getErrorMessage(failure));
      })
      .finally(() => {
        if (generation.current === current) setLoading(false);
      });
    return () => {
      sessionReference.current++;
    };
  }, [active, attempt]);
  const verify = useCallback(async () => {
    const current = generation.current;
    if (!active) throw new Error('Volvé a la pantalla para autenticarte.');
    await authenticateIdentity();
    if (current !== generation.current)
      throw new Error('La sesión cambió. Autenticate nuevamente.');
  }, [active]);
  function authenticate() {
    void action.run(async () => {
      await verify();
      return 'Identidad verificada correctamente.';
    });
  }
  return {
    capability,
    error,
    loading,
    refresh: () => setAttempt((current) => current + 1),
    verify,
    authenticate,
    ...action,
  };
}
