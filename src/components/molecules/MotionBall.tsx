// src/components/molecules/MotionBall.tsx — Pelota acotada dentro de un área que se adapta al ancho.
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/atoms/AppText';
import { useTheme } from '@/hooks/useTheme';
import type { SensorData } from '@/types/components';
export function MotionBall({ data }: { data: SensorData | null }) {
  const { colors } = useTheme();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const horizontal = Math.max(0, (size.width - 36) / 2);
  const vertical = Math.max(0, (size.height - 36) / 2);
  return (
    <>
      <AppText muted>Incliná el dispositivo para mover la pelota.</AppText>
      <View
        onLayout={(event) => setSize(event.nativeEvent.layout)}
        style={[styles.area, { backgroundColor: colors.raised }]}
      >
        <View
          style={[
            styles.ball,
            {
              backgroundColor: colors.accent,
              transform: [
                { translateX: Math.max(-1, Math.min(1, data?.x ?? 0)) * horizontal },
                { translateY: Math.max(-1, Math.min(1, -(data?.y ?? 0))) * vertical },
              ],
            },
          ]}
        />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  area: {
    width: '100%',
    aspectRatio: 1.8,
    maxHeight: 260,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ball: { width: 36, height: 36, borderRadius: 18 },
});
