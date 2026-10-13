// src/context/ScrollContext.tsx — El layout comparte únicamente el scroll de la pantalla enfocada.
import { createContext, useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
interface ScrollValue {
  offset: number;
  register(owner: string, action: () => void): void;
  unregister(owner: string): void;
  update(owner: string, offset: number): void;
  scrollToTop(): void;
}
export const ScrollContext = createContext<ScrollValue | null>(null);
export function ScrollProvider({ children }: { children: ReactNode }) {
  const active = useRef<{ owner: string; action: () => void } | null>(null);
  const [offset, setOffset] = useState(0);
  const register = useCallback((owner: string, action: () => void) => {
    active.current = { owner, action };
    setOffset(0);
  }, []);
  const unregister = useCallback((owner: string) => {
    if (active.current?.owner === owner) {
      active.current = null;
      setOffset(0);
    }
  }, []);
  const update = useCallback((owner: string, next: number) => {
    if (active.current?.owner === owner) setOffset(next);
  }, []);
  const scrollToTop = useCallback(() => active.current?.action(), []);
  const value = useMemo(
    () => ({ offset, register, unregister, update, scrollToTop }),
    [offset, register, unregister, update, scrollToTop],
  );
  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}
