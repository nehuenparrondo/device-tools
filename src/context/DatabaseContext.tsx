// src/context/DatabaseContext.tsx — Inicializa SQLite una vez y permite reintentar errores.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import { databaseService } from '@/services/databaseService';
import { getErrorMessage } from '@/utils/formatters';
interface DatabaseValue {
  ready: boolean;
  error: string | null;
  supported: boolean;
  retry(): void;
}
const DatabaseContext = createContext<DatabaseValue | null>(null);
export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((current) => current + 1), []);
  useEffect(() => {
    let mounted = true;
    setError(null);
    setReady(false);
    databaseService
      .initialize()
      .then(() => {
        if (mounted) setReady(true);
      })
      .catch((failure: unknown) => {
        if (mounted) setError(getErrorMessage(failure));
      });
    return () => {
      mounted = false;
    };
  }, [attempt]);
  const value = useMemo(
    () => ({ ready, error, supported: Platform.OS !== 'web', retry }),
    [ready, error, retry],
  );
  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}
export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase necesita DatabaseProvider.');
  return context;
}
