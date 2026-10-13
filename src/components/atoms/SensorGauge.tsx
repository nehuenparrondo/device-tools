// src/components/atoms/SensorGauge.tsx — Barra acotada proporcional a la magnitud de cada eje.
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from './AppText';
import { formatNumber } from '@/utils/formatters';
export function SensorGauge({
  label,
  value,
  unit,
  range,
}: {
  label: string;
  value: number;
  unit: string;
  range: number;
}) {
  const { colors } = useTheme();
  const percent = Math.min(100, (Math.abs(value) / range) * 100);
  return (
    <View style={styles.group}>
      <AppText variant="small">
        {label}: {formatNumber(value, unit, 3)}
      </AppText>
      <View
        accessibilityLabel={`${label}: ${value.toFixed(3)} ${unit}`}
        style={[styles.track, { backgroundColor: colors.raised }]}
      >
        <View style={[styles.fill, { width: `${percent}%`, backgroundColor: colors.primary }]} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  group: { gap: 4 },
  track: { height: 12, borderRadius: 6, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 6 },
});
