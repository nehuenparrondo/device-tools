// src/hooks/useActiveScreen.ts — Suspende hardware al perder foco o pasar a segundo plano.
import { useIsFocused } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
export function useActiveScreen(allowSystemPrompt = false) {
  const focused = useIsFocused();
  const [state, setState] = useState(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => setState(state));
    return () => subscription.remove();
  }, []);
  return focused && (state === 'active' || (allowSystemPrompt && state === 'inactive'));
}
