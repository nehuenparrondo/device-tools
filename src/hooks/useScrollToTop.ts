// src/hooks/useScrollToTop.ts — Registra y limpia la referencia del scroll según el foco.
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useId, useRef } from 'react';
import { ScrollView, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { ScrollContext } from '@/context/ScrollContext';
export function useScrollToTop() {
  const context = useContext(ScrollContext);
  if (!context) throw new Error('useScrollToTop necesita ScrollProvider.');
  const { register, unregister, update } = context;
  const owner = useId();
  const scrollRef = useRef<ScrollView>(null);
  const offsetRef = useRef(0);
  useFocusEffect(
    useCallback(() => {
      register(owner, () => scrollRef.current?.scrollTo({ y: 0, animated: true }));
      update(owner, offsetRef.current);
      return () => unregister(owner);
    }, [owner, register, unregister, update]),
  );
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      offsetRef.current = event.nativeEvent.contentOffset.y;
      update(owner, offsetRef.current);
    },
    [owner, update],
  );
  return { scrollRef, onScroll };
}
