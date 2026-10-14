// src/components/organisms/ScannerGuide.tsx — Marco animado que no intercepta las acciones.
import { useEffect, useState } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
export function ScannerGuide() {
  const { colors } = useTheme();
  const [progress] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [progress]);
  return (
    <View style={styles.guide}>
      <View style={styles.frame}>
        <Animated.View
          style={[
            styles.line,
            { backgroundColor: colors.heroAccent },
            {
              opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] }),
              transform: [
                { scaleX: progress.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  guide: {
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: '65%',
    maxWidth: 360,
    height: '65%',
    maxHeight: 300,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  line: { height: 3, width: '100%' },
});
