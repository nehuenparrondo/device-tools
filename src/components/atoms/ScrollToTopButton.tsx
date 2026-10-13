// src/components/atoms/ScrollToTopButton.tsx — Muestra una acción animada solo tras desplazar contenido.
import { useContext, useEffect, useState } from 'react';
import { Animated, Platform } from 'react-native';
import { ScrollContext } from '@/context/ScrollContext';
import { SCROLL_THRESHOLD } from '@/constants/app';
import { IconButton } from './IconButton';
export function ScrollToTopButton() {
  const context = useContext(ScrollContext);
  const visible = (context?.offset ?? 0) > SCROLL_THRESHOLD;
  const [opacity] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const animation = Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 180,
      useNativeDriver: Platform.OS !== 'web',
    });
    animation.start();
    return () => animation.stop();
  }, [opacity, visible]);
  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      accessibilityElementsHidden={!visible}
      aria-hidden={!visible}
      importantForAccessibility={visible ? 'auto' : 'no-hide-descendants'}
      style={{ opacity }}
    >
      <IconButton icon="arrow-up" label="Volver al inicio" onPress={() => context?.scrollToTop()} />
    </Animated.View>
  );
}
